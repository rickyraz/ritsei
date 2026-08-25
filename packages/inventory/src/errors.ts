import * as Schema from "effect/Schema"

import { StockReservationStatus, StockTransferStatus, UnitOfMeasure } from "./contract.ts"

const TrimmedNonEmptyString = Schema.String.check(Schema.makeFilter(
  (value) => /\S/.test(value) && value === value.trim(),
  { expected: "a trimmed nonblank string" },
))

export class InventoryReferenceNotFound
  extends Schema.TaggedError<InventoryReferenceNotFound>()("InventoryReferenceNotFound", {
    tenantId: Schema.String,
    warehouseId: Schema.String,
    itemId: Schema.String,
  }) {}
export class WarehouseAlreadyExists
  extends Schema.TaggedError<WarehouseAlreadyExists>()("WarehouseAlreadyExists", {
    tenantId: Schema.String,
    name: Schema.String,
  }) {}
export class WarehouseLegalEntityNotFound
  extends Schema.TaggedError<WarehouseLegalEntityNotFound>()("WarehouseLegalEntityNotFound", {
    tenantId: Schema.String,
    legalEntityId: Schema.String,
  }) {}
export class InventoryWarehouseLegalEntityMismatch
  extends Schema.TaggedError<InventoryWarehouseLegalEntityMismatch>()(
    "InventoryWarehouseLegalEntityMismatch",
    {
      tenantId: Schema.String,
      warehouseId: Schema.String,
      legalEntityId: Schema.String,
    },
  ) {}
export class WarehouseBranchNotFound
  extends Schema.TaggedError<WarehouseBranchNotFound>()("WarehouseBranchNotFound", {
    tenantId: Schema.String,
    legalEntityId: Schema.String,
    branchId: Schema.String,
  }) {}
export class ItemAlreadyExists
  extends Schema.TaggedError<ItemAlreadyExists>()("ItemAlreadyExists", {
    tenantId: Schema.String,
    sku: Schema.String,
  }) {}
export class StockUnavailable extends Schema.TaggedError<StockUnavailable>()("StockUnavailable", {
  tenantId: Schema.String,
  warehouseId: Schema.String,
  itemId: Schema.String,
  requested: Schema.String,
}) {}
export class InventoryUnitOfMeasureMismatch
  extends Schema.TaggedError<InventoryUnitOfMeasureMismatch>()(
    "InventoryUnitOfMeasureMismatch",
    {
      tenantId: Schema.String,
      itemId: Schema.String,
      expected: UnitOfMeasure,
      actual: UnitOfMeasure,
    },
  ) {}
export class StockCorrectionIdempotencyConflict
  extends Schema.TaggedError<StockCorrectionIdempotencyConflict>()(
    "StockCorrectionIdempotencyConflict",
    {
      tenantId: Schema.String,
      idempotencyKey: TrimmedNonEmptyString,
    },
  ) {}
export class StockReservationIdempotencyConflict
  extends Schema.TaggedError<StockReservationIdempotencyConflict>()(
    "StockReservationIdempotencyConflict",
    {
      tenantId: Schema.String,
      idempotencyKey: TrimmedNonEmptyString,
    },
  ) {}
export class StockReservationLegalEntityMismatch
  extends Schema.TaggedError<StockReservationLegalEntityMismatch>()(
    "StockReservationLegalEntityMismatch",
    {
      tenantId: Schema.String,
      warehouseId: Schema.String,
      legalEntityId: Schema.String,
    },
  ) {}
export class StockReservationNotFound
  extends Schema.TaggedError<StockReservationNotFound>()("StockReservationNotFound", {
    tenantId: Schema.String,
    reservationId: Schema.String,
  }) {}
export class StockReservationInvalidState
  extends Schema.TaggedError<StockReservationInvalidState>()(
    "StockReservationInvalidState",
    {
      tenantId: Schema.String,
      reservationId: Schema.String,
      operation: Schema.Literals(["release", "fulfill"]),
      status: StockReservationStatus,
    },
  ) {}
export class StockTransferNotFound
  extends Schema.TaggedError<StockTransferNotFound>()("StockTransferNotFound", {
    tenantId: Schema.String,
    transferId: Schema.String,
  }) {}
export class StockTransferInvalidState
  extends Schema.TaggedError<StockTransferInvalidState>()("StockTransferInvalidState", {
    tenantId: Schema.String,
    transferId: Schema.String,
    operation: Schema.Literals(["confirm", "complete"]),
    status: StockTransferStatus,
  }) {}
export class StockTransferSameWarehouse
  extends Schema.TaggedError<StockTransferSameWarehouse>()("StockTransferSameWarehouse", {
    tenantId: Schema.String,
    warehouseId: Schema.String,
  }) {}
export class StockTransferDifferentLegalEntity
  extends Schema.TaggedError<StockTransferDifferentLegalEntity>()(
    "StockTransferDifferentLegalEntity",
    {
      tenantId: Schema.String,
      sourceWarehouseId: Schema.String,
      destinationWarehouseId: Schema.String,
    },
  ) {}
export class StockTransferDuplicateItem
  extends Schema.TaggedError<StockTransferDuplicateItem>()("StockTransferDuplicateItem", {
    tenantId: Schema.String,
    itemId: Schema.String,
  }) {}
export class StockTransferWarehouseNotFound
  extends Schema.TaggedError<StockTransferWarehouseNotFound>()(
    "StockTransferWarehouseNotFound",
    { tenantId: Schema.String, warehouseId: Schema.String },
  ) {}
export class StockTransferItemNotFound
  extends Schema.TaggedError<StockTransferItemNotFound>()("StockTransferItemNotFound", {
    tenantId: Schema.String,
    itemId: Schema.String,
  }) {}
