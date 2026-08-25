import * as Clock from "effect/Clock"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Schema from "effect/Schema"

import { AuthorizationService } from "../../authorization/mod.ts"
import { InventoryCapabilities } from "./capabilities.ts"
import { MessagingService } from "../../messaging/mod.ts"
import { InventoryStockCorrectedEvent } from "./events.ts"
import {
  AdjustStockInput,
  CompleteStockTransferInput,
  ConfirmStockTransferInput,
  CreateItemInput,
  CreateStockTransferInput,
  CreateWarehouseInput,
  FulfillReservationInput,
  InventoryService,
  Item,
  ReceiveStockInput,
  ReleaseReservationInput,
  ReserveStockInput,
  StockCorrection,
  StockReservation,
  StockTransfer,
  Warehouse,
} from "./contract.ts"
import {
  InventoryReferenceNotFound,
  InventoryUnitOfMeasureMismatch,
  InventoryWarehouseLegalEntityMismatch,
  ItemAlreadyExists,
  StockCorrectionIdempotencyConflict,
  StockReservationIdempotencyConflict,
  StockReservationInvalidState,
  StockReservationLegalEntityMismatch,
  StockReservationNotFound,
  StockTransferDifferentLegalEntity,
  StockTransferDuplicateItem,
  StockTransferInvalidState,
  StockTransferItemNotFound,
  StockTransferNotFound,
  StockTransferSameWarehouse,
  StockTransferWarehouseNotFound,
  StockUnavailable,
  WarehouseAlreadyExists,
} from "./errors.ts"

const referenceFailure = (tenantId: string, warehouseId: string, itemId: string) =>
  new InventoryReferenceNotFound({ tenantId, warehouseId, itemId })

export const makeInventoryMemoryLayer = () =>
  Layer.effect(
    InventoryService,
    Effect.gen(function* () {
      const authorization = yield* AuthorizationService
      const messaging = yield* MessagingService
      const clock = yield* Clock.Clock
      const now = () => new Date(clock.currentTimeMillisUnsafe())
      const storedWarehouses = new Map<string, Warehouse>()
      const storedItems = new Map<string, Item>()
      const balances = new Map<string, { onHand: bigint; reserved: bigint }>()
      const storedTransfers = new Map<string, StockTransfer>()
      const storedReservations = new Map<string, StockReservation>()
      const reservationIdsByIdempotencyKey = new Map<string, string>()
      const correctionsByIdempotencyKey = new Map<string, StockCorrection>()
      const nextId = () => crypto.randomUUID()
      const authorize = (principal: unknown, tenantId: string, capability: string) =>
        authorization.authorize({ principal, tenantId, capability })
      const service: InventoryService = {
        createWarehouse: (input) =>
          Effect.gen(function* () {
            const decoded = yield* Schema.decodeUnknownEffect(CreateWarehouseInput)(input)
            yield* authorize(
              decoded.principal,
              decoded.tenantId,
              InventoryCapabilities.warehouseCreate,
            )
            const name = decoded.name.trim()
            if (
              [...storedWarehouses.values()].some((value) =>
                value.tenantId === decoded.tenantId && value.name === name
              )
            ) {
              return yield* Effect.fail(
                new WarehouseAlreadyExists({ tenantId: decoded.tenantId, name }),
              )
            }
            const value = {
              id: nextId(),
              tenantId: decoded.tenantId,
              legalEntityId: decoded.legalEntityId,
              primaryBranchId: decoded.primaryBranchId ?? null,
              name,
            }
            storedWarehouses.set(value.id, value)
            return value
          }),
        createItem: (input) =>
          Effect.gen(function* () {
            const decoded = yield* Schema.decodeUnknownEffect(CreateItemInput)(input)
            yield* authorize(decoded.principal, decoded.tenantId, InventoryCapabilities.itemCreate)
            const sku = decoded.sku.trim().toUpperCase()
            const unitOfMeasure = decoded.unitOfMeasure.trim().toUpperCase()
            if (
              [...storedItems.values()].some((value) =>
                value.tenantId === decoded.tenantId && value.sku === sku
              )
            ) {
              return yield* Effect.fail(new ItemAlreadyExists({ tenantId: decoded.tenantId, sku }))
            }
            const value = {
              id: nextId(),
              tenantId: decoded.tenantId,
              sku,
              name: decoded.name.trim(),
              unitOfMeasure,
            }
            storedItems.set(value.id, value)
            return value
          }),
        receiveStock: (input) =>
          Effect.gen(function* () {
            const decoded = yield* Schema.decodeUnknownEffect(ReceiveStockInput)(input)
            yield* authorize(
              decoded.principal,
              decoded.tenantId,
              InventoryCapabilities.stockReceive,
            )
            const warehouse = storedWarehouses.get(decoded.warehouseId)
            if (
              warehouse?.tenantId !== decoded.tenantId ||
              storedItems.get(decoded.itemId)?.tenantId !== decoded.tenantId
            ) {
              return yield* Effect.fail(
                referenceFailure(decoded.tenantId, decoded.warehouseId, decoded.itemId),
              )
            }
            if (
              decoded.legalEntityId !== undefined &&
              warehouse.legalEntityId !== decoded.legalEntityId
            ) {
              return yield* Effect.fail(
                new InventoryWarehouseLegalEntityMismatch({
                  tenantId: decoded.tenantId,
                  warehouseId: decoded.warehouseId,
                  legalEntityId: decoded.legalEntityId,
                }),
              )
            }
            const key = `${decoded.tenantId}:${decoded.warehouseId}:${decoded.itemId}`
            const balance = balances.get(key) ?? { onHand: 0n, reserved: 0n }
            balance.onHand += BigInt(decoded.quantity)
            balances.set(key, balance)
            return {
              tenantId: decoded.tenantId,
              warehouseId: decoded.warehouseId,
              itemId: decoded.itemId,
              onHand: String(balance.onHand),
              reserved: String(balance.reserved),
              unitOfMeasure: storedItems.get(decoded.itemId)!.unitOfMeasure,
            }
          }),
        adjustStock: (input) =>
          Effect.gen(function* () {
            const decoded = yield* Schema.decodeUnknownEffect(AdjustStockInput)(input)
            yield* authorize(decoded.principal, decoded.tenantId, InventoryCapabilities.stockAdjust)
            const unitOfMeasure = decoded.unitOfMeasure.trim().toUpperCase()
            const reason = decoded.reason.trim()
            const commandId = decoded.commandId.trim()
            const correlationId = decoded.correlationId.trim()
            const causationId = decoded.causationId?.trim() ?? null
            const idempotencyKey = decoded.idempotencyKey.trim()
            const key = `${decoded.tenantId}:${idempotencyKey}`
            const existing = correctionsByIdempotencyKey.get(key)
            if (existing !== undefined) {
              if (
                existing.warehouseId !== decoded.warehouseId ||
                existing.itemId !== decoded.itemId ||
                existing.adjustment !== decoded.adjustment ||
                existing.unitOfMeasure !== unitOfMeasure ||
                existing.reason !== reason
              ) {
                return yield* Effect.fail(
                  new StockCorrectionIdempotencyConflict({
                    tenantId: decoded.tenantId,
                    idempotencyKey,
                  }),
                )
              }
              return existing
            }
            const item = storedItems.get(decoded.itemId)
            if (
              storedWarehouses.get(decoded.warehouseId)?.tenantId !== decoded.tenantId ||
              item?.tenantId !== decoded.tenantId
            ) {
              return yield* Effect.fail(
                referenceFailure(decoded.tenantId, decoded.warehouseId, decoded.itemId),
              )
            }
            if (item.unitOfMeasure !== unitOfMeasure) {
              return yield* Effect.fail(
                new InventoryUnitOfMeasureMismatch({
                  tenantId: decoded.tenantId,
                  itemId: decoded.itemId,
                  expected: item.unitOfMeasure,
                  actual: unitOfMeasure,
                }),
              )
            }
            const balanceKey = `${decoded.tenantId}:${decoded.warehouseId}:${decoded.itemId}`
            const balance = balances.get(balanceKey) ?? { onHand: 0n, reserved: 0n }
            const adjustment = BigInt(decoded.adjustment)
            if (balance.onHand + adjustment < balance.reserved) {
              return yield* Effect.fail(
                new StockUnavailable({
                  tenantId: decoded.tenantId,
                  warehouseId: decoded.warehouseId,
                  itemId: decoded.itemId,
                  requested: decoded.adjustment,
                }),
              )
            }
            const correction: StockCorrection = {
              id: crypto.randomUUID(),
              tenantId: decoded.tenantId,
              warehouseId: decoded.warehouseId,
              itemId: decoded.itemId,
              adjustment: decoded.adjustment,
              unitOfMeasure,
              reason,
              idempotencyKey,
            }
            yield* messaging.append({
              eventId: crypto.randomUUID(),
              eventType: InventoryStockCorrectedEvent.id,
              eventVersion: InventoryStockCorrectedEvent.version,
              tenantId: decoded.tenantId,
              aggregateType: InventoryStockCorrectedEvent.aggregateType,
              aggregateId: correction.id,
              commandId,
              correlationId,
              causationId,
              idempotencyKey,
              actorPrincipalId: decoded.principal.userAccountId,
              occurredAt: now().toISOString(),
              payload: {
                correctionId: correction.id,
                warehouseId: correction.warehouseId,
                itemId: correction.itemId,
              },
            })
            balance.onHand += adjustment
            balances.set(balanceKey, balance)
            correctionsByIdempotencyKey.set(key, correction)
            return correction
          }),
        reserveStock: (input) =>
          Effect.gen(function* () {
            const decoded = yield* Schema.decodeUnknownEffect(ReserveStockInput)(input)
            yield* authorize(
              decoded.principal,
              decoded.tenantId,
              InventoryCapabilities.stockReserve,
            )
            if (decoded.legalEntityId !== undefined) {
              const warehouse = storedWarehouses.get(decoded.warehouseId)
              if (
                warehouse?.tenantId !== decoded.tenantId ||
                warehouse?.legalEntityId !== decoded.legalEntityId
              ) {
                return yield* Effect.fail(
                  new StockReservationLegalEntityMismatch({
                    tenantId: decoded.tenantId,
                    warehouseId: decoded.warehouseId,
                    legalEntityId: decoded.legalEntityId,
                  }),
                )
              }
            }
            const idempotencyKey = decoded.idempotencyKey === undefined
              ? undefined
              : `${decoded.tenantId}:${decoded.idempotencyKey}`
            const existing = idempotencyKey === undefined
              ? undefined
              : storedReservations.get(reservationIdsByIdempotencyKey.get(idempotencyKey) ?? "")
            if (existing !== undefined) {
              if (
                existing.warehouseId !== decoded.warehouseId ||
                existing.itemId !== decoded.itemId ||
                existing.quantity !== decoded.quantity
              ) {
                return yield* Effect.fail(
                  new StockReservationIdempotencyConflict({
                    tenantId: decoded.tenantId,
                    idempotencyKey: decoded.idempotencyKey!,
                  }),
                )
              }
              return existing
            }
            const key = `${decoded.tenantId}:${decoded.warehouseId}:${decoded.itemId}`
            const balance = balances.get(key)
            const quantity = BigInt(decoded.quantity)
            if (balance === undefined || balance.onHand - balance.reserved < quantity) {
              return yield* Effect.fail(
                new StockUnavailable({
                  tenantId: decoded.tenantId,
                  warehouseId: decoded.warehouseId,
                  itemId: decoded.itemId,
                  requested: decoded.quantity,
                }),
              )
            }
            balance.reserved += quantity
            const reservation: StockReservation = {
              id: nextId(),
              tenantId: decoded.tenantId,
              warehouseId: decoded.warehouseId,
              itemId: decoded.itemId,
              quantity: decoded.quantity,
              idempotencyKey: decoded.idempotencyKey ?? null,
              status: "active",
            }
            storedReservations.set(reservation.id, reservation)
            if (idempotencyKey !== undefined) {
              reservationIdsByIdempotencyKey.set(idempotencyKey, reservation.id)
            }
            return reservation
          }),
        releaseReservation: (input) =>
          Effect.gen(function* () {
            const decoded = yield* Schema.decodeUnknownEffect(ReleaseReservationInput)(input)
            yield* authorize(
              decoded.principal,
              decoded.tenantId,
              InventoryCapabilities.stockRelease,
            )
            const reservation = storedReservations.get(decoded.reservationId)
            if (reservation === undefined || reservation.tenantId !== decoded.tenantId) {
              return yield* Effect.fail(
                new StockReservationNotFound({
                  tenantId: decoded.tenantId,
                  reservationId: decoded.reservationId,
                }),
              )
            }
            if (reservation.status === "released") return reservation
            if (reservation.status !== "active") {
              return yield* Effect.fail(
                new StockReservationInvalidState({
                  tenantId: decoded.tenantId,
                  reservationId: decoded.reservationId,
                  operation: "release",
                  status: reservation.status,
                }),
              )
            }
            const balance = balances.get(
              `${decoded.tenantId}:${reservation.warehouseId}:${reservation.itemId}`,
            )!
            balance.reserved -= BigInt(reservation.quantity)
            const released = { ...reservation, status: "released" as const }
            storedReservations.set(released.id, released)
            return released
          }),
        fulfillReservation: (input) =>
          Effect.gen(function* () {
            const decoded = yield* Schema.decodeUnknownEffect(FulfillReservationInput)(input)
            yield* authorize(
              decoded.principal,
              decoded.tenantId,
              InventoryCapabilities.stockFulfill,
            )
            const reservation = storedReservations.get(decoded.reservationId)
            if (reservation === undefined || reservation.tenantId !== decoded.tenantId) {
              return yield* Effect.fail(
                new StockReservationNotFound({
                  tenantId: decoded.tenantId,
                  reservationId: decoded.reservationId,
                }),
              )
            }
            if (reservation.status === "fulfilled") return reservation
            if (reservation.status !== "active") {
              return yield* Effect.fail(
                new StockReservationInvalidState({
                  tenantId: decoded.tenantId,
                  reservationId: decoded.reservationId,
                  operation: "fulfill",
                  status: reservation.status,
                }),
              )
            }
            const balance = balances.get(
              `${decoded.tenantId}:${reservation.warehouseId}:${reservation.itemId}`,
            )!
            const quantity = BigInt(reservation.quantity)
            balance.onHand -= quantity
            balance.reserved -= quantity
            const fulfilled = { ...reservation, status: "fulfilled" as const }
            storedReservations.set(fulfilled.id, fulfilled)
            return fulfilled
          }),
        createTransfer: (input) =>
          Effect.gen(function* () {
            const decoded = yield* Schema.decodeUnknownEffect(CreateStockTransferInput)(input)
            yield* authorize(
              decoded.principal,
              decoded.tenantId,
              InventoryCapabilities.stockTransferCreate,
            )
            if (decoded.sourceWarehouseId === decoded.destinationWarehouseId) {
              return yield* Effect.fail(
                new StockTransferSameWarehouse({
                  tenantId: decoded.tenantId,
                  warehouseId: decoded.sourceWarehouseId,
                }),
              )
            }
            const itemIds = new Set<string>()
            for (const line of decoded.lines) {
              if (itemIds.has(line.itemId)) {
                return yield* Effect.fail(
                  new StockTransferDuplicateItem({
                    tenantId: decoded.tenantId,
                    itemId: line.itemId,
                  }),
                )
              }
              itemIds.add(line.itemId)
            }
            if (
              storedWarehouses.get(decoded.sourceWarehouseId)?.tenantId !== decoded.tenantId
            ) {
              return yield* Effect.fail(
                new StockTransferWarehouseNotFound({
                  tenantId: decoded.tenantId,
                  warehouseId: decoded.sourceWarehouseId,
                }),
              )
            }
            if (
              storedWarehouses.get(decoded.destinationWarehouseId)?.tenantId !== decoded.tenantId
            ) {
              return yield* Effect.fail(
                new StockTransferWarehouseNotFound({
                  tenantId: decoded.tenantId,
                  warehouseId: decoded.destinationWarehouseId,
                }),
              )
            }
            const sourceWarehouse = storedWarehouses.get(decoded.sourceWarehouseId)!
            const destinationWarehouse = storedWarehouses.get(decoded.destinationWarehouseId)!
            if (destinationWarehouse.legalEntityId !== sourceWarehouse.legalEntityId) {
              return yield* Effect.fail(
                new StockTransferDifferentLegalEntity({
                  tenantId: decoded.tenantId,
                  sourceWarehouseId: decoded.sourceWarehouseId,
                  destinationWarehouseId: decoded.destinationWarehouseId,
                }),
              )
            }
            const missingItem = decoded.lines.find((line) =>
              storedItems.get(line.itemId)?.tenantId !== decoded.tenantId
            )
            if (missingItem !== undefined) {
              return yield* Effect.fail(
                new StockTransferItemNotFound({
                  tenantId: decoded.tenantId,
                  itemId: missingItem.itemId,
                }),
              )
            }
            const transfer: StockTransfer = {
              id: nextId(),
              tenantId: decoded.tenantId,
              legalEntityId: sourceWarehouse.legalEntityId,
              sourceWarehouseId: decoded.sourceWarehouseId,
              destinationWarehouseId: decoded.destinationWarehouseId,
              status: "draft",
              confirmedAt: null,
              completedAt: null,
              lines: decoded.lines,
            }
            storedTransfers.set(transfer.id, transfer)
            return transfer
          }),
        confirmTransfer: (input) =>
          Effect.gen(function* () {
            const decoded = yield* Schema.decodeUnknownEffect(ConfirmStockTransferInput)(input)
            yield* authorize(
              decoded.principal,
              decoded.tenantId,
              InventoryCapabilities.stockTransferConfirm,
            )
            const transfer = storedTransfers.get(decoded.transferId)
            if (transfer === undefined || transfer.tenantId !== decoded.tenantId) {
              return yield* Effect.fail(
                new StockTransferNotFound({
                  tenantId: decoded.tenantId,
                  transferId: decoded.transferId,
                }),
              )
            }
            if (transfer.status !== "draft") return transfer
            for (const line of transfer.lines) {
              const balance = balances.get(
                `${decoded.tenantId}:${transfer.sourceWarehouseId}:${line.itemId}`,
              )
              if (
                balance === undefined ||
                balance.onHand - balance.reserved < BigInt(line.quantity)
              ) {
                return yield* Effect.fail(
                  new StockUnavailable({
                    tenantId: decoded.tenantId,
                    warehouseId: transfer.sourceWarehouseId,
                    itemId: line.itemId,
                    requested: line.quantity,
                  }),
                )
              }
            }
            for (const line of transfer.lines) {
              const balance = balances.get(
                `${decoded.tenantId}:${transfer.sourceWarehouseId}:${line.itemId}`,
              )!
              balance.onHand -= BigInt(line.quantity)
            }
            const confirmed: StockTransfer = {
              ...transfer,
              status: "confirmed",
              confirmedAt: now().toISOString(),
            }
            storedTransfers.set(confirmed.id, confirmed)
            return confirmed
          }),
        completeTransfer: (input) =>
          Effect.gen(function* () {
            const decoded = yield* Schema.decodeUnknownEffect(CompleteStockTransferInput)(input)
            yield* authorize(
              decoded.principal,
              decoded.tenantId,
              InventoryCapabilities.stockTransferComplete,
            )
            const transfer = storedTransfers.get(decoded.transferId)
            if (transfer === undefined || transfer.tenantId !== decoded.tenantId) {
              return yield* Effect.fail(
                new StockTransferNotFound({
                  tenantId: decoded.tenantId,
                  transferId: decoded.transferId,
                }),
              )
            }
            if (transfer.status === "completed") return transfer
            if (transfer.status !== "confirmed") {
              return yield* Effect.fail(
                new StockTransferInvalidState({
                  tenantId: decoded.tenantId,
                  transferId: decoded.transferId,
                  operation: "complete",
                  status: transfer.status,
                }),
              )
            }
            for (const line of transfer.lines) {
              const key = `${decoded.tenantId}:${transfer.destinationWarehouseId}:${line.itemId}`
              const balance = balances.get(key) ?? { onHand: 0n, reserved: 0n }
              balance.onHand += BigInt(line.quantity)
              balances.set(key, balance)
            }
            const completed: StockTransfer = {
              ...transfer,
              status: "completed",
              completedAt: now().toISOString(),
            }
            storedTransfers.set(completed.id, completed)
            return completed
          }),
      }
      return {
        createWarehouse: Effect.fn("InventoryStore.memory.createWarehouse")((input: unknown) =>
          service.createWarehouse(input)
        ),
        createItem: Effect.fn("InventoryStore.memory.createItem")((input: unknown) =>
          service.createItem(input)
        ),
        receiveStock: Effect.fn("InventoryStore.memory.receiveStock")((input: unknown) =>
          service.receiveStock(input)
        ),
        adjustStock: Effect.fn("InventoryStore.memory.adjustStock")((input: unknown) =>
          service.adjustStock(input)
        ),
        reserveStock: Effect.fn("InventoryStore.memory.reserveStock")((input: unknown) =>
          service.reserveStock(input)
        ),
        releaseReservation: Effect.fn("InventoryStore.memory.releaseReservation")((
          input: unknown,
        ) => service.releaseReservation(input)),
        fulfillReservation: Effect.fn("InventoryStore.memory.fulfillReservation")((
          input: unknown,
        ) => service.fulfillReservation(input)),
        createTransfer: Effect.fn("InventoryStore.memory.createTransfer")((input: unknown) =>
          service.createTransfer(input)
        ),
        confirmTransfer: Effect.fn("InventoryStore.memory.confirmTransfer")((input: unknown) =>
          service.confirmTransfer(input)
        ),
        completeTransfer: Effect.fn("InventoryStore.memory.completeTransfer")((input: unknown) =>
          service.completeTransfer(input)
        ),
      } satisfies InventoryService
    }),
  )
