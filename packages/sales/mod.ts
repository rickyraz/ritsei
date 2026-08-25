export { SalesCapabilities } from "./src/capabilities.ts"
export {
  SalesConfirmOrderAction,
  SalesOrderConfirmedEvent,
  SalesOrderConfirmedEventPayload,
  SalesTypedActionCatalog,
  SalesTypedEventCatalog,
} from "./src/catalog.ts"
export {
  CancelConfirmedOrderInput,
  ConfirmOrderInput,
  CreateCustomerInput,
  CreateOrderInput,
  CreateQuotationInput,
  Customer,
  GetConfirmedOrderTotalInput,
  Quotation,
  SalesOrder,
  SalesOrderLine,
  SalesService,
} from "./src/contract.ts"
export {
  CustomerAlreadyExists,
  CustomerNotFound,
  QuotationNotFound,
  SalesOrderConfirmationIdempotencyConflict,
  SalesOrderInvalidState,
  SalesOrderNotFound,
} from "./src/errors.ts"
export { makeSalesService, makeSalesTestLayer } from "./src/layers.ts"
export type {
  Customer as CustomerType,
  Quotation as QuotationType,
  SalesOrder as SalesOrderType,
  SalesOrderLine as SalesOrderLineType,
  SalesService as SalesServiceShape,
} from "./src/contract.ts"
