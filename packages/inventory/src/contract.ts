import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { Principal } from "../../auth/mod.ts"
import type { AuthorizationDenied } from "../../authorization/mod.ts"
import type { DatabaseFailure } from "../../kernel/mod.ts"
import type { EventIdempotencyConflict } from "../../messaging/mod.ts"
import type {
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
  WarehouseBranchNotFound,
  WarehouseLegalEntityNotFound,
} from "./errors.ts"

const Uuid = Schema.String.check(Schema.isUUID())
const Quantity = Schema.String.check(
  Schema.makeFilter(
    (value) => /^[1-9]\d*$/.test(value) && BigInt(value) <= 9_223_372_036_854_775_807n,
    { expected: "a positive PostgreSQL bigint quantity" },
  ),
)
const NonNegativeQuantity = Schema.String.check(
  Schema.makeFilter(
    (value) => /^(0|[1-9]\d*)$/.test(value) && BigInt(value) <= 9_223_372_036_854_775_807n,
    { expected: "a non-negative PostgreSQL bigint quantity" },
  ),
)
const SignedQuantity = Schema.String.check(
  Schema.makeFilter(
    (value) => {
      if (!/^-?[1-9]\d*$/.test(value)) return false
      const quantity = BigInt(value)
      return quantity >= -9_223_372_036_854_775_808n &&
        quantity <= 9_223_372_036_854_775_807n
    },
    { expected: "a non-zero PostgreSQL bigint quantity" },
  ),
)
const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))
export const UnitOfMeasure = Schema.String.check(Schema.isPattern(/^[A-Z][A-Z0-9_-]*$/))
const UnitOfMeasureInput = NonEmptyString
const DefaultUnitOfMeasure = UnitOfMeasureInput.pipe(
  Schema.withDecodingDefaultKey(Effect.succeed("EA")),
)

export const Warehouse = Schema.Struct({
  id: Schema.String,
  tenantId: Schema.String,
  legalEntityId: Schema.String,
  primaryBranchId: Schema.NullOr(Schema.String),
  name: Schema.String,
})
export const Item = Schema.Struct({
  id: Schema.String,
  tenantId: Schema.String,
  sku: Schema.String,
  name: Schema.String,
  unitOfMeasure: UnitOfMeasure,
})
export const StockBalance = Schema.Struct({
  tenantId: Uuid,
  warehouseId: Uuid,
  itemId: Uuid,
  onHand: NonNegativeQuantity,
  reserved: NonNegativeQuantity,
  unitOfMeasure: UnitOfMeasure,
})
export const StockCorrection = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  warehouseId: Uuid,
  itemId: Uuid,
  adjustment: SignedQuantity,
  unitOfMeasure: UnitOfMeasure,
  reason: NonEmptyString,
  idempotencyKey: NonEmptyString,
})
export const StockReservationStatus = Schema.Literals(["active", "released", "fulfilled"])
export const StockReservation = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  warehouseId: Uuid,
  itemId: Uuid,
  quantity: Quantity,
  idempotencyKey: Schema.NullOr(Schema.String),
  status: StockReservationStatus,
})
export const StockTransferStatus = Schema.Literals(["draft", "confirmed", "completed"])
export const StockTransferLine = Schema.Struct({
  itemId: Schema.String,
  quantity: Quantity,
})
export const StockTransfer = Schema.Struct({
  id: Schema.String,
  tenantId: Schema.String,
  legalEntityId: Schema.String,
  sourceWarehouseId: Schema.String,
  destinationWarehouseId: Schema.String,
  status: StockTransferStatus,
  confirmedAt: Schema.NullOr(Schema.String),
  completedAt: Schema.NullOr(Schema.String),
  lines: Schema.Array(StockTransferLine),
})

export type Warehouse = Schema.Schema.Type<typeof Warehouse>
export type Item = Schema.Schema.Type<typeof Item>
export type StockBalance = Schema.Schema.Type<typeof StockBalance>
export type StockCorrection = Schema.Schema.Type<typeof StockCorrection>
export type StockReservation = Schema.Schema.Type<typeof StockReservation>
export type StockTransferStatus = Schema.Schema.Type<typeof StockTransferStatus>
export type StockTransferLine = Schema.Schema.Type<typeof StockTransferLine>
export type StockTransfer = Schema.Schema.Type<typeof StockTransfer>

const ScopedInput = { principal: Principal, tenantId: Schema.String }
export const CreateWarehouseInput = Schema.Struct({
  ...ScopedInput,
  legalEntityId: Schema.String,
  primaryBranchId: Schema.optionalKey(Schema.String),
  name: Schema.String,
})
export const CreateItemInput = Schema.Struct({
  ...ScopedInput,
  sku: Schema.String,
  name: Schema.String,
  unitOfMeasure: DefaultUnitOfMeasure,
})
export const ReceiveStockInput = Schema.Struct({
  ...ScopedInput,
  warehouseId: Schema.String,
  itemId: Schema.String,
  quantity: Quantity,
  legalEntityId: Schema.optionalKey(Schema.String.check(Schema.isUUID())),
  referenceId: Schema.optionalKey(Schema.String.check(Schema.isUUID())),
})
export const AdjustStockInput = Schema.Struct({
  ...ScopedInput,
  warehouseId: Schema.String,
  itemId: Schema.String,
  adjustment: SignedQuantity,
  unitOfMeasure: UnitOfMeasureInput,
  reason: NonEmptyString,
  commandId: NonEmptyString,
  correlationId: NonEmptyString,
  causationId: Schema.optionalKey(Schema.NullOr(NonEmptyString)),
  idempotencyKey: NonEmptyString,
})
export const ReserveStockInput = Schema.Struct({
  ...ScopedInput,
  warehouseId: Schema.String,
  itemId: Schema.String,
  quantity: Quantity,
  legalEntityId: Schema.optionalKey(Schema.String),
  idempotencyKey: Schema.optionalKey(Schema.String.check(Schema.isPattern(/\S/))),
})
export const ReleaseReservationInput = Schema.Struct({
  ...ScopedInput,
  reservationId: Schema.String,
})
export const FulfillReservationInput = ReleaseReservationInput
export const CreateStockTransferInput = Schema.Struct({
  ...ScopedInput,
  sourceWarehouseId: Schema.String,
  destinationWarehouseId: Schema.String,
  lines: Schema.Array(StockTransferLine).check(Schema.isMinLength(1)),
})
export const ConfirmStockTransferInput = Schema.Struct({
  ...ScopedInput,
  transferId: Schema.String,
})
export const CompleteStockTransferInput = ConfirmStockTransferInput

type CommonFailure = AuthorizationDenied | DatabaseFailure | Schema.SchemaError

export interface InventoryService {
  readonly createWarehouse: (
    input: unknown,
  ) => Effect.Effect<
    Warehouse,
    WarehouseAlreadyExists | WarehouseBranchNotFound | WarehouseLegalEntityNotFound | CommonFailure
  >
  readonly createItem: (input: unknown) => Effect.Effect<Item, ItemAlreadyExists | CommonFailure>
  readonly receiveStock: (
    input: unknown,
  ) => Effect.Effect<
    StockBalance,
    InventoryReferenceNotFound | InventoryWarehouseLegalEntityMismatch | CommonFailure
  >
  readonly adjustStock: (
    input: unknown,
  ) => Effect.Effect<
    StockCorrection,
    | InventoryReferenceNotFound
    | InventoryUnitOfMeasureMismatch
    | StockCorrectionIdempotencyConflict
    | StockUnavailable
    | EventIdempotencyConflict
    | CommonFailure
  >
  readonly reserveStock: (
    input: unknown,
  ) => Effect.Effect<
    StockReservation,
    | StockReservationIdempotencyConflict
    | StockReservationLegalEntityMismatch
    | StockUnavailable
    | CommonFailure
  >
  readonly releaseReservation: (
    input: unknown,
  ) => Effect.Effect<
    StockReservation,
    StockReservationInvalidState | StockReservationNotFound | StockUnavailable | CommonFailure
  >
  readonly fulfillReservation: (
    input: unknown,
  ) => Effect.Effect<
    StockReservation,
    StockReservationInvalidState | StockReservationNotFound | StockUnavailable | CommonFailure
  >
  readonly createTransfer: (
    input: unknown,
  ) => Effect.Effect<
    StockTransfer,
    | StockTransferDifferentLegalEntity
    | StockTransferDuplicateItem
    | StockTransferItemNotFound
    | StockTransferSameWarehouse
    | StockTransferWarehouseNotFound
    | CommonFailure
  >
  readonly confirmTransfer: (
    input: unknown,
  ) => Effect.Effect<
    StockTransfer,
    | StockUnavailable
    | StockTransferNotFound
    | CommonFailure
  >
  readonly completeTransfer: (
    input: unknown,
  ) => Effect.Effect<
    StockTransfer,
    | StockTransferInvalidState
    | StockTransferNotFound
    | CommonFailure
  >
}

export const InventoryService = Context.Service<InventoryService>("RITSEI/InventoryService")
