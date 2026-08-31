import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { Principal } from "../../auth/mod.ts"
import { AuthorizationDenied } from "../../authorization/mod.ts"
import { InventoryService, UnitOfMeasure } from "../../inventory/mod.ts"
import {
  DatabaseFailure,
  FinancialMajorAmount,
  ReplicaConsistencyFailure,
  requireExactMajorToMinor,
} from "../../kernel/mod.ts"
import { EventIdempotencyConflict } from "../../messaging/mod.ts"
import {
  PurchaseOrderConfirmationIdempotencyConflict,
  PurchaseOrderHasReceipts,
  PurchaseOrderInvalidState,
  PurchaseOrderNotFound,
  PurchaseReceiptIdempotencyConflict,
  PurchaseReceiptInventoryReferenceNotFound,
  PurchaseReceiptLineDuplicate,
  PurchaseReceiptLineNotFound,
  PurchaseReceiptQuantityExceeded,
  PurchaseReceiptWarehouseLegalEntityMismatch,
  SupplierAccountAlreadyExists,
  SupplierAccountNotFound,
  SupplierRelationshipNotEligible,
} from "./errors.ts"

const Uuid = Schema.String.check(Schema.isUUID())
const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))
const TrimmedNonEmptyString = Schema.String.check(Schema.makeFilter(
  (value) => /\S/.test(value) && value === value.trim(),
  { expected: "a trimmed nonblank string" },
))
const IsoTimestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/
const InstantString = Schema.String.check(
  Schema.isPattern(IsoTimestamp),
  Schema.makeFilter((value) => !Number.isNaN(new Date(value).getTime()), {
    expected: "an ISO 8601 timestamp with a timezone",
  }),
)
const Quantity = Schema.String.check(
  Schema.makeFilter(
    (value) => /^[1-9]\d*$/.test(value) && BigInt(value) <= 9_223_372_036_854_775_807n,
    { expected: "a positive PostgreSQL bigint quantity" },
  ),
)

export const SupplierAccount = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  supplierRelationshipId: Uuid,
  partyId: Uuid,
  legalEntityId: Uuid,
})

export const PurchaseOrderLine = Schema.Struct({
  itemId: Uuid,
  quantity: Quantity,
  unitPrice: FinancialMajorAmount,
})

export const PurchaseOrderLineSnapshot = Schema.Struct({
  id: Uuid,
  itemId: Uuid,
  quantity: Quantity,
  unitPrice: FinancialMajorAmount,
})

export const PurchaseOrder = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  supplierAccountId: Uuid,
  status: Schema.Literals(["draft", "confirmed", "cancelled"]),
  confirmedAt: Schema.NullOr(InstantString),
  total: FinancialMajorAmount,
  lines: Schema.Array(PurchaseOrderLineSnapshot).check(Schema.isMinLength(1)),
}).check(Schema.makeFilter(
  (order) =>
    (order.status === "draft" && order.confirmedAt === null) ||
    (order.status !== "draft" && order.confirmedAt !== null),
  { expected: "purchase order confirmation metadata consistent with status" },
)).check(Schema.makeFilter(
  (order) => {
    const lineTotal = order.lines.reduce(
      (total, line) => total + requireExactMajorToMinor(line.unitPrice, 2) * BigInt(line.quantity),
      0n,
    )
    return lineTotal === requireExactMajorToMinor(order.total, 2)
  },
  { expected: "purchase order total must equal its line totals" },
)).check(Schema.makeFilter(
  (order) => new Set(order.lines.map((line) => line.id)).size === order.lines.length,
  { expected: "purchase order line identities must be unique" },
))

export type SupplierAccount = Schema.Schema.Type<typeof SupplierAccount>
export type PurchaseOrderLine = Schema.Schema.Type<typeof PurchaseOrderLine>
export type PurchaseOrderLineSnapshot = Schema.Schema.Type<typeof PurchaseOrderLineSnapshot>
export type PurchaseOrder = Schema.Schema.Type<typeof PurchaseOrder>

export const CreateSupplierAccountInput = Schema.Struct({
  principal: Principal,
  tenantId: Uuid,
  supplierRelationshipId: Uuid,
})

export const CreatePurchaseOrderInput = Schema.Struct({
  principal: Principal,
  tenantId: Uuid,
  supplierAccountId: Uuid,
  lines: Schema.Array(PurchaseOrderLine).check(Schema.isMinLength(1)),
})

export const ConfirmPurchaseOrderInput = Schema.Struct({
  principal: Principal,
  tenantId: Uuid,
  purchaseOrderId: Uuid,
  idempotencyKey: NonEmptyString,
})

export const GetPurchaseOrderInput = Schema.Struct({
  principal: Principal,
  tenantId: Uuid,
  purchaseOrderId: Uuid,
})

export const CancelPurchaseOrderInput = Schema.Struct({
  principal: Principal,
  tenantId: Uuid,
  purchaseOrderId: Uuid,
})

export const PurchaseReceiptLineInput = Schema.Struct({
  purchaseOrderLineId: Uuid,
  quantity: Quantity,
})

export const ReceivePurchaseOrderInput = Schema.Struct({
  principal: Principal,
  tenantId: Uuid,
  purchaseOrderId: Uuid,
  warehouseId: Uuid,
  idempotencyKey: NonEmptyString,
  lines: Schema.Array(PurchaseReceiptLineInput).check(Schema.isMinLength(1)).check(
    Schema.makeFilter(
      (lines) => new Set(lines.map((line) => line.purchaseOrderLineId)).size === lines.length,
      { expected: "purchase receipt lines must reference unique purchase-order lines" },
    ),
  ),
})

export const GoodsReceiptLine = Schema.Struct({
  id: Uuid,
  purchaseOrderLineId: Uuid,
  itemId: Uuid,
  quantity: Quantity,
  unitOfMeasure: UnitOfMeasure,
})

export const GoodsReceipt = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  purchaseOrderId: Uuid,
  warehouseId: Uuid,
  idempotencyKey: TrimmedNonEmptyString,
  receivedAt: InstantString,
  lines: Schema.Array(GoodsReceiptLine).check(Schema.isMinLength(1)),
}).check(Schema.makeFilter(
  (receipt) =>
    new Set(receipt.lines.map((line) => line.purchaseOrderLineId)).size === receipt.lines.length,
  { expected: "goods receipt lines must reference unique purchase-order lines" },
)).check(Schema.makeFilter(
  (receipt) => new Set(receipt.lines.map((line) => line.id)).size === receipt.lines.length,
  { expected: "goods receipt line identities must be unique" },
))

export type PurchaseReceiptLineInput = Schema.Schema.Type<typeof PurchaseReceiptLineInput>
export type ReceivePurchaseOrder = Schema.Schema.Type<typeof ReceivePurchaseOrderInput>
export type GoodsReceiptLine = Schema.Schema.Type<typeof GoodsReceiptLine>
export type GoodsReceipt = Schema.Schema.Type<typeof GoodsReceipt>

export type CommonFailure =
  | AuthorizationDenied
  | DatabaseFailure
  | EventIdempotencyConflict
  | Schema.SchemaError

export interface ProcurementService {
  readonly createSupplierAccount: (
    input: unknown,
  ) => Effect.Effect<
    SupplierAccount,
    SupplierAccountAlreadyExists | SupplierRelationshipNotEligible | CommonFailure
  >
  readonly createPurchaseOrder: (
    input: unknown,
  ) => Effect.Effect<PurchaseOrder, SupplierAccountNotFound | CommonFailure>
  readonly getPurchaseOrder: (
    input: unknown,
  ) => Effect.Effect<
    PurchaseOrder,
    PurchaseOrderNotFound | ReplicaConsistencyFailure | CommonFailure
  >
  readonly confirmPurchaseOrder: (
    input: unknown,
  ) => Effect.Effect<
    PurchaseOrder,
    | PurchaseOrderConfirmationIdempotencyConflict
    | PurchaseOrderInvalidState
    | PurchaseOrderNotFound
    | CommonFailure
  >
  readonly cancelPurchaseOrder: (
    input: unknown,
  ) => Effect.Effect<
    PurchaseOrder,
    PurchaseOrderHasReceipts | PurchaseOrderInvalidState | PurchaseOrderNotFound | CommonFailure
  >
  readonly receivePurchaseOrder: (
    input: unknown,
  ) => Effect.Effect<
    GoodsReceipt,
    | PurchaseOrderInvalidState
    | PurchaseOrderNotFound
    | PurchaseReceiptIdempotencyConflict
    | PurchaseReceiptLineDuplicate
    | PurchaseReceiptLineNotFound
    | PurchaseReceiptQuantityExceeded
    | PurchaseReceiptInventoryReferenceNotFound
    | PurchaseReceiptWarehouseLegalEntityMismatch
    | SupplierAccountNotFound
    | SupplierRelationshipNotEligible
    | CommonFailure,
    InventoryService
  >
}

export const ProcurementService = Context.Service<ProcurementService>("RITSEI/ProcurementService")
