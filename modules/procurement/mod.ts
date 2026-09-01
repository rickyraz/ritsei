export { ProcurementCapabilities } from "./src/capabilities.ts"
export {
  ProcurementConfirmPurchaseOrderAction,
  ProcurementTypedActionCatalog,
  ProcurementTypedEventCatalog,
} from "./src/catalog.ts"
export {
  ProcurementPurchaseOrderConfirmedEvent,
  PurchaseOrderConfirmedEventPayload,
} from "./src/events.ts"

export {
  CancelPurchaseOrderInput,
  ConfirmPurchaseOrderInput,
  CreatePurchaseOrderInput,
  CreateSupplierAccountInput,
  GetPurchaseOrderInput,
  GoodsReceipt,
  GoodsReceiptLine,
  ProcurementService,
  PurchaseOrder,
  PurchaseOrderLine,
  PurchaseOrderLineSnapshot,
  PurchaseReceiptLineInput,
  ReceivePurchaseOrderInput,
  SupplierAccount,
} from "./src/contract.ts"
export type {
  GoodsReceipt as GoodsReceiptType,
  GoodsReceiptLine as GoodsReceiptLineType,
  ProcurementService as ProcurementServiceShape,
  PurchaseOrder as PurchaseOrderType,
  PurchaseOrderLine as PurchaseOrderLineType,
  PurchaseOrderLineSnapshot as PurchaseOrderLineSnapshotType,
  PurchaseReceiptLineInput as PurchaseReceiptLineInputType,
  ReceivePurchaseOrder as ReceivePurchaseOrderType,
  SupplierAccount as SupplierAccountType,
} from "./src/contract.ts"
export {
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
} from "./src/errors.ts"
export type {
  PurchaseOrderConfirmedEventPayload as PurchaseOrderConfirmedEventPayloadType,
} from "./src/events.ts"
export { makeProcurementService, makeProcurementTestLayer, ProcurementLive } from "./src/layers.ts"
