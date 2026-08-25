import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Redacted from "effect/Redacted"
import * as HttpApiBuilder from "effect/unstable/httpapi/HttpApiBuilder"

import { AuthService } from "../../packages/auth/mod.ts"
import {
  AuthorizationCapabilities,
  AuthorizationService,
} from "../../packages/authorization/mod.ts"
import { IdentityCapabilities, UserAccountService } from "../../packages/identity/mod.ts"
import { DatabaseFailure } from "../../packages/kernel/mod.ts"
import { PartyService } from "../../packages/party/mod.ts"
import { SalesService } from "../../packages/sales/mod.ts"
import { InventoryService } from "../../packages/inventory/mod.ts"
import { AccountingService, FinancialOperationService } from "../../packages/accounting/mod.ts"
import { ProcessService } from "../../packages/process/mod.ts"
import { ProcurementService } from "../../packages/procurement/mod.ts"
import {
  ApiConflict,
  ApiForbidden,
  ApiNotFound,
  ApiServiceUnavailable,
  ApiUnauthorized,
  BearerAuth,
  CurrentPrincipal,
  RitseiApi,
} from "./api.ts"

type ApiErrorKind =
  | "forbidden"
  | "not_found"
  | "conflict"
  | "invalid_request"
  | "service_unavailable"

// Closed-world transport policy for routes compiled into RitseiApi. Plugin, connector,
// and Process Studio failures are normalized by their own versioned contribution boundary.
const coreApiErrorPolicy = {
  AccountAlreadyExists: "conflict",
  AccountNotFound: "not_found",
  AccountingConfigurationAlreadyExists: "conflict",
  AccountingLegalEntityNotFound: "not_found",
  AccountingPeriodNotFound: "not_found",
  AccountingPeriodNotOpen: "conflict",
  AccountingPeriodOverlap: "conflict",
  AuthorizationDenied: "forbidden",
  BranchAlreadyExists: "conflict",
  CapabilityAlreadyGranted: "conflict",
  CustomerAlreadyExists: "conflict",
  CustomerNotFound: "not_found",
  DatabaseFailure: "service_unavailable",
  EventIdempotencyConflict: "conflict",
  ExternalIdentifierAlreadyAssigned: "conflict",
  FinancialCurrencyMismatch: "conflict",
  IdentityAuthorizationDenied: "forbidden",
  FinancialEngineActivated: "conflict",
  FinancialEngineCutoverBlocked: "conflict",
  FinancialLedgerNotActivated: "conflict",
  FinancialLedgerNotConfigured: "service_unavailable",
  FinancialOperationConflict: "conflict",
  FinancialOperationInjectedFailure: "conflict",
  FinancialOperationNotFound: "not_found",
  FinancialOperationReconciliationConflict: "conflict",
  FinancialOperationsPending: "conflict",
  FinancialProjectionRebuildBlocked: "conflict",
  FinancialReconciliationCheckpointConflict: "conflict",
  FinancialReconciliationCheckpointEvidenceInvalid: "conflict",
  FinancialRevenueAmountMismatch: "conflict",
  FinancialReversalAlreadyExists: "conflict",
  FinancialReversalSourceNotFound: "not_found",
  FinancialReversalSourceNotPosted: "conflict",
  FinancialReversalSourceNotReady: "conflict",
  FinancialReversalSourceRequired: "conflict",
  FinancialSalesNotConfigured: "service_unavailable",
  FinancialVerificationArtifactInvalid: "conflict",
  FinancialVerificationArtifactNotFound: "not_found",
  FinancialVerificationKeyGenerationFailure: "conflict",
  FinancialVerificationKeyNotFound: "not_found",
  FinancialVerificationSigningFailure: "conflict",
  FinancialVerificationVerificationFailure: "conflict",
  InvalidJournalLine: "conflict",
  InvalidRevenuePostingProfile: "conflict",
  InventoryReferenceNotFound: "not_found",
  InventoryUnitOfMeasureMismatch: "conflict",
  InventoryWarehouseLegalEntityMismatch: "conflict",
  ItemAlreadyExists: "conflict",
  JournalIdempotencyConflict: "conflict",
  JournalReferenceAlreadyExists: "conflict",
  LegalEntityAlreadyExists: "conflict",
  LegalEntityNotFound: "not_found",
  OrderConfirmationCorrupt: "conflict",
  OrderConfirmationNotFound: "not_found",
  OrganizationRequired: "conflict",
  PartyNotFound: "not_found",
  PartyRelationshipAlreadyExists: "conflict",
  PartyRelationshipRoleNotAssigned: "conflict",
  PartyRepresentationAlreadyExists: "conflict",
  PartyRepresentationNotFound: "not_found",
  PartyRepresentationUserAccountNotFound: "not_found",
  PartyRoleAlreadyAssigned: "conflict",
  QuotationCustomerMismatch: "conflict",
  QuotationNotFound: "not_found",
  PurchaseOrderConfirmationIdempotencyConflict: "conflict",
  PurchaseOrderHasReceipts: "conflict",
  PurchaseOrderInvalidState: "conflict",
  PurchaseOrderNotFound: "not_found",
  PurchaseReceiptIdempotencyConflict: "conflict",
  PurchaseReceiptInventoryReferenceNotFound: "not_found",
  PurchaseReceiptLineDuplicate: "conflict",
  PurchaseReceiptLineNotFound: "not_found",
  PurchaseReceiptQuantityExceeded: "conflict",
  PurchaseReceiptWarehouseLegalEntityMismatch: "conflict",
  SupplierAccountAlreadyExists: "conflict",
  SupplierAccountNotFound: "not_found",
  SupplierRelationshipNotEligible: "conflict",
  RevenueJournalNotFound: "not_found",
  RevenuePostingProfileAlreadyExists: "conflict",
  RevenuePostingProfileNotFound: "not_found",
  SalesOrderConfirmationIdempotencyConflict: "conflict",
  SalesOrderInvalidState: "conflict",
  SalesOrderNotFound: "not_found",
  SchemaError: "invalid_request",
  StockCorrectionIdempotencyConflict: "conflict",
  StockReservationIdempotencyConflict: "conflict",
  StockReservationInvalidState: "conflict",
  StockReservationLegalEntityMismatch: "conflict",
  StockReservationNotFound: "not_found",
  StockTransferDifferentLegalEntity: "conflict",
  StockTransferDuplicateItem: "conflict",
  StockTransferInvalidState: "conflict",
  StockTransferItemNotFound: "not_found",
  StockTransferNotFound: "not_found",
  StockTransferSameWarehouse: "conflict",
  StockTransferWarehouseNotFound: "not_found",
  StockUnavailable: "conflict",
  TenantMembershipAlreadyExists: "conflict",
  TenantMembershipNotActive: "conflict",
  TenantMembershipNotFound: "not_found",
  TenantMembershipUserAccountNotFound: "not_found",
  TigerBeetleConfigurationFailure: "conflict",
  UnbalancedJournal: "conflict",
  UserAccountAlreadyExists: "conflict",
  UserAccountNotFound: "not_found",
  WarehouseAlreadyExists: "conflict",
  WarehouseBranchNotFound: "not_found",
  WarehouseLegalEntityNotFound: "not_found",
  WorkflowAlreadyCompleted: "conflict",
  WorkflowAlreadyInProgress: "conflict",
  WorkflowIdempotencyConflict: "conflict",
  WorkflowManualRecoveryRequired: "conflict",
  WorkflowOutcomeUnknown: "service_unavailable",
  WorkflowResultCorrupt: "conflict",
  WorkflowRunNotFound: "not_found",
} as const satisfies Record<string, ApiErrorKind>

export type CoreApiFailure = {
  readonly _tag: keyof typeof coreApiErrorPolicy
}

export const toCoreApiError = (error: CoreApiFailure) => {
  const tag = error._tag
  switch (coreApiErrorPolicy[tag]) {
    case "forbidden":
      return new ApiForbidden({ code: "forbidden" })
    case "not_found":
      return new ApiNotFound({ code: tag })
    case "invalid_request":
      return new ApiConflict({ code: "invalid_request" })
    case "service_unavailable":
      return new ApiServiceUnavailable({ code: "service_unavailable" })
    case "conflict":
      return new ApiConflict({ code: tag })
  }
}

const coreApiEffect = <A, E extends CoreApiFailure, R>(effect: Effect.Effect<A, E, R>) =>
  effect.pipe(Effect.mapError(toCoreApiError))

export const BearerAuthLive = Layer.effect(
  BearerAuth,
  Effect.gen(function* () {
    const auth = yield* AuthService
    return {
      bearer: (effect, options) =>
        Effect.provideServiceEffect(
          effect,
          CurrentPrincipal,
          auth.authenticate(Redacted.value(options.credential)).pipe(
            Effect.mapError((error) =>
              error instanceof DatabaseFailure
                ? new ApiServiceUnavailable({ code: "service_unavailable" })
                : new ApiUnauthorized({ code: "unauthorized" })
            ),
          ),
        ),
    }
  }),
)

export const HealthHandlers = HttpApiBuilder.group(
  RitseiApi,
  "Health",
  (handlers) => handlers.handle("health", () => Effect.succeed({ status: "ok" as const })),
)

export const UserAccountHandlers = HttpApiBuilder.group(
  RitseiApi,
  "UserAccounts",
  (handlers) =>
    Effect.gen(function* () {
      const authorization = yield* AuthorizationService
      const userAccounts = yield* UserAccountService
      return handlers
        .handle(
          "create",
          Effect.fn("Http.UserAccounts.create")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(Effect.gen(function* () {
              const userAccount = yield* userAccounts.createForTenant({
                principal,
                tenantId: headers["x-tenant-id"],
                ...payload,
              })
              yield* authorization.addMember({
                userAccountId: userAccount.id,
                tenantId: headers["x-tenant-id"],
              })
              return userAccount
            }))
          }),
        )
        .handle(
          "list",
          Effect.fn("Http.UserAccounts.list")(function* ({ headers }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(Effect.gen(function* () {
              yield* authorization.authorize({
                principal,
                tenantId: headers["x-tenant-id"],
                capability: IdentityCapabilities.userAccountRead,
              })
              const members = yield* authorization.listMembers(headers["x-tenant-id"])
              return yield* userAccounts.getByIds(members.map((member) => member.userAccountId))
            }))
          }),
        )
        .handle(
          "get",
          Effect.fn("Http.UserAccounts.get")(function* ({ headers, params }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(Effect.gen(function* () {
              yield* authorization.authorize({
                principal,
                tenantId: headers["x-tenant-id"],
                capability: IdentityCapabilities.userAccountRead,
              })
              yield* authorization.getMember({
                userAccountId: params.id,
                tenantId: headers["x-tenant-id"],
              })
              return yield* userAccounts.getById(params.id)
            }))
          }),
        )
        .handle(
          "update",
          Effect.fn("Http.UserAccounts.update")(function* ({ headers, params, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(Effect.gen(function* () {
              yield* authorization.authorize({
                principal,
                tenantId: headers["x-tenant-id"],
                capability: IdentityCapabilities.userAccountUpdate,
              })
              yield* authorization.getMember({
                userAccountId: params.id,
                tenantId: headers["x-tenant-id"],
              })
              return yield* userAccounts.update({ id: params.id, email: payload.email })
            }))
          }),
        )
    }),
)

export const PartyHandlers = HttpApiBuilder.group(
  RitseiApi,
  "Parties",
  (handlers) =>
    Effect.gen(function* () {
      const party = yield* PartyService
      return handlers
        .handle(
          "create",
          Effect.fn("Http.Parties.create")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              party.create({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "assignRole",
          Effect.fn("Http.Parties.assignRole")(function* ({ headers, params, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(party.assignRole({
              principal,
              tenantId: headers["x-tenant-id"],
              partyId: params.id,
              role: payload.role,
            }))
          }),
        )
        .handle(
          "attachIdentifier",
          Effect.fn("Http.Parties.attachIdentifier")(function* ({ headers, params, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(party.attachIdentifier({
              principal,
              tenantId: headers["x-tenant-id"],
              partyId: params.id,
              ...payload,
            }))
          }),
        )
        .handle(
          "createRelationship",
          Effect.fn("Http.Parties.createRelationship")(function* ({ headers, params, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(party.createRelationship({
              principal,
              tenantId: headers["x-tenant-id"],
              partyId: params.id,
              ...payload,
            }))
          }),
        )
    }),
)

export const AuthorizationHandlers = HttpApiBuilder.group(
  RitseiApi,
  "Authorization",
  (handlers) =>
    Effect.gen(function* () {
      const authorization = yield* AuthorizationService
      const authorize = (
        principal: typeof CurrentPrincipal.Service,
        tenantId: string,
        capability: string,
      ) => authorization.authorize({ principal, tenantId, capability })
      return handlers
        .handle(
          "addMember",
          Effect.fn("Http.Authorization.addMember")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(Effect.gen(function* () {
              yield* authorize(
                principal,
                headers["x-tenant-id"],
                AuthorizationCapabilities.tenantMembershipAdd,
              )
              return yield* authorization.addMember({
                userAccountId: payload.userAccountId,
                tenantId: headers["x-tenant-id"],
              })
            }))
          }),
        )
        .handle(
          "listMembers",
          Effect.fn("Http.Authorization.listMembers")(function* ({ headers }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(Effect.gen(function* () {
              yield* authorize(
                principal,
                headers["x-tenant-id"],
                AuthorizationCapabilities.tenantMembershipRead,
              )
              return yield* authorization.listMembers(headers["x-tenant-id"])
            }))
          }),
        )
        .handle(
          "suspendMember",
          Effect.fn("Http.Authorization.suspendMember")(function* ({ headers, params }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(Effect.gen(function* () {
              yield* authorize(
                principal,
                headers["x-tenant-id"],
                AuthorizationCapabilities.tenantMembershipSuspend,
              )
              return yield* authorization.suspendMember({
                userAccountId: params.userAccountId,
                tenantId: headers["x-tenant-id"],
              })
            }))
          }),
        )
        .handle(
          "activateMember",
          Effect.fn("Http.Authorization.activateMember")(function* ({ headers, params }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(Effect.gen(function* () {
              yield* authorize(
                principal,
                headers["x-tenant-id"],
                AuthorizationCapabilities.tenantMembershipActivate,
              )
              return yield* authorization.activateMember({
                userAccountId: params.userAccountId,
                tenantId: headers["x-tenant-id"],
              })
            }))
          }),
        )
        .handle(
          "removeMember",
          Effect.fn("Http.Authorization.removeMember")(function* ({ headers, params }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(Effect.gen(function* () {
              yield* authorize(
                principal,
                headers["x-tenant-id"],
                AuthorizationCapabilities.tenantMembershipRemove,
              )
              return yield* authorization.removeMember({
                userAccountId: params.userAccountId,
                tenantId: headers["x-tenant-id"],
              })
            }))
          }),
        )
        .handle(
          "grant",
          Effect.fn("Http.Authorization.grant")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(Effect.gen(function* () {
              yield* authorize(
                principal,
                headers["x-tenant-id"],
                AuthorizationCapabilities.capabilityGrant,
              )
              return yield* authorization.grant({
                userAccountId: payload.userAccountId,
                tenantId: headers["x-tenant-id"],
                capability: payload.capability,
              })
            }))
          }),
        )
    }),
)

export const SalesHandlers = HttpApiBuilder.group(
  RitseiApi,
  "Sales",
  (handlers) =>
    Effect.gen(function* () {
      const sales = yield* SalesService
      return handlers
        .handle(
          "createCustomer",
          Effect.fn("Http.Sales.createCustomer")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              sales.createCustomer({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "createQuotation",
          Effect.fn("Http.Sales.createQuotation")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              sales.createQuotation({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "createOrder",
          Effect.fn("Http.Sales.createOrder")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              sales.createOrder({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
    }),
)

export const InventoryHandlers = HttpApiBuilder.group(
  RitseiApi,
  "Inventory",
  (handlers) =>
    Effect.gen(function* () {
      const inventory = yield* InventoryService
      return handlers
        .handle(
          "createWarehouse",
          Effect.fn("Http.Inventory.createWarehouse")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              inventory.createWarehouse({
                principal,
                tenantId: headers["x-tenant-id"],
                ...payload,
              }),
            )
          }),
        )
        .handle(
          "createItem",
          Effect.fn("Http.Inventory.createItem")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              inventory.createItem({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "receiveStock",
          Effect.fn("Http.Inventory.receiveStock")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              inventory.receiveStock({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "reserveStock",
          Effect.fn("Http.Inventory.reserveStock")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              inventory.reserveStock({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "createTransfer",
          Effect.fn("Http.Inventory.createTransfer")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              inventory.createTransfer({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "confirmTransfer",
          Effect.fn("Http.Inventory.confirmTransfer")(function* ({ headers, params }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              inventory.confirmTransfer({
                principal,
                tenantId: headers["x-tenant-id"],
                transferId: params.id,
              }),
            )
          }),
        )
        .handle(
          "completeTransfer",
          Effect.fn("Http.Inventory.completeTransfer")(function* ({ headers, params }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              inventory.completeTransfer({
                principal,
                tenantId: headers["x-tenant-id"],
                transferId: params.id,
              }),
            )
          }),
        )
    }),
)

export const ProcurementHandlers = HttpApiBuilder.group(
  RitseiApi,
  "Procurement",
  (handlers) =>
    Effect.gen(function* () {
      const procurement = yield* ProcurementService
      return handlers
        .handle(
          "createSupplierAccount",
          Effect.fn("Http.Procurement.createSupplierAccount")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(procurement.createSupplierAccount({
              principal,
              tenantId: headers["x-tenant-id"],
              ...payload,
            }))
          }),
        )
        .handle(
          "createPurchaseOrder",
          Effect.fn("Http.Procurement.createPurchaseOrder")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(procurement.createPurchaseOrder({
              principal,
              tenantId: headers["x-tenant-id"],
              ...payload,
            }))
          }),
        )
        .handle(
          "getPurchaseOrder",
          Effect.fn("Http.Procurement.getPurchaseOrder")(function* ({ headers, params }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(procurement.getPurchaseOrder({
              principal,
              tenantId: headers["x-tenant-id"],
              purchaseOrderId: params.id,
            }))
          }),
        )
        .handle(
          "confirmPurchaseOrder",
          Effect.fn("Http.Procurement.confirmPurchaseOrder")(
            function* ({ headers, params, payload }) {
              const principal = yield* CurrentPrincipal
              return yield* coreApiEffect(procurement.confirmPurchaseOrder({
                principal,
                tenantId: headers["x-tenant-id"],
                purchaseOrderId: params.id,
                ...payload,
              }))
            },
          ),
        )
        .handle(
          "cancelPurchaseOrder",
          Effect.fn("Http.Procurement.cancelPurchaseOrder")(function* ({ headers, params }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(procurement.cancelPurchaseOrder({
              principal,
              tenantId: headers["x-tenant-id"],
              purchaseOrderId: params.id,
            }))
          }),
        )
        .handle(
          "receivePurchaseOrder",
          Effect.fn("Http.Procurement.receivePurchaseOrder")(
            function* ({ headers, params, payload }) {
              const principal = yield* CurrentPrincipal
              return yield* coreApiEffect(procurement.receivePurchaseOrder({
                principal,
                tenantId: headers["x-tenant-id"],
                purchaseOrderId: params.id,
                ...payload,
              }))
            },
          ),
        )
    }),
)

export const ProcessHandlers = HttpApiBuilder.group(
  RitseiApi,
  "Process",
  (handlers) =>
    Effect.gen(function* () {
      const process = yield* ProcessService
      return handlers
        .handle(
          "confirmOrder",
          Effect.fn("Http.Process.confirmOrder")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              process.confirmOrder({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "cancelOrder",
          Effect.fn("Http.Process.cancelOrder")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              process.cancelOrder({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "fulfillOrder",
          Effect.fn("Http.Process.fulfillOrder")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              process.fulfillOrder({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "recoverOrder",
          Effect.fn("Http.Process.recoverOrder")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              process.recoverOrder({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "manualRecovery",
          Effect.fn("Http.Process.manualRecovery")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              process.markManualRecovery({
                principal,
                tenantId: headers["x-tenant-id"],
                ...payload,
              }),
            )
          }),
        )
    }),
)

export const AccountingHandlers = HttpApiBuilder.group(
  RitseiApi,
  "Accounting",
  (handlers) =>
    Effect.gen(function* () {
      const accounting = yield* AccountingService
      const financialOperations = yield* FinancialOperationService
      return handlers
        .handle(
          "prepareTigerBeetleCutover",
          Effect.fn("Http.Accounting.prepareTigerBeetleCutover")(function* ({ headers, params }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              accounting.prepareTigerBeetleCutover({
                principal,
                tenantId: headers["x-tenant-id"],
                legalEntityId: params.id,
              }),
            )
          }),
        )
        .handle(
          "recordFinancialVerificationArtifact",
          Effect.fn("Http.Accounting.recordFinancialVerificationArtifact")(
            function* ({ headers, payload }) {
              const principal = yield* CurrentPrincipal
              return yield* coreApiEffect(
                accounting.recordFinancialVerificationArtifact({
                  principal,
                  tenantId: headers["x-tenant-id"],
                  evidence: payload,
                }),
              )
            },
          ),
        )
        .handle(
          "approveTigerBeetleCutover",
          Effect.fn("Http.Accounting.approveTigerBeetleCutover")(
            function* ({ headers, params, payload }) {
              const principal = yield* CurrentPrincipal
              return yield* coreApiEffect(
                accounting.approveTigerBeetleCutover({
                  principal,
                  tenantId: headers["x-tenant-id"],
                  legalEntityId: params.id,
                  ...payload,
                }),
              )
            },
          ),
        )
        .handle(
          "activateTigerBeetleCutover",
          Effect.fn("Http.Accounting.activateTigerBeetleCutover")(function* ({ headers, params }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              accounting.activateTigerBeetleCutover({
                principal,
                tenantId: headers["x-tenant-id"],
                legalEntityId: params.id,
              }),
            )
          }),
        )
        .handle(
          "configureLegalEntity",
          Effect.fn("Http.Accounting.configureLegalEntity")(
            function* ({ headers, params, payload }) {
              const principal = yield* CurrentPrincipal
              return yield* coreApiEffect(
                accounting.configureLegalEntity({
                  principal,
                  tenantId: headers["x-tenant-id"],
                  legalEntityId: params.id,
                  ...payload,
                }),
              )
            },
          ),
        )
        .handle(
          "createAccount",
          Effect.fn("Http.Accounting.createAccount")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              accounting.createAccount({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "postJournal",
          Effect.fn("Http.Accounting.postJournal")(function* ({ headers, payload }) {
            const principal = yield* CurrentPrincipal
            return yield* coreApiEffect(
              accounting.postJournal({ principal, tenantId: headers["x-tenant-id"], ...payload }),
            )
          }),
        )
        .handle(
          "rebuildFinancialProjections",
          Effect.fn("Http.Accounting.rebuildFinancialProjections")(
            function* ({ headers, payload }) {
              const principal = yield* CurrentPrincipal
              return yield* coreApiEffect(
                financialOperations.rebuildFinancialProjections({
                  principal,
                  tenantId: headers["x-tenant-id"],
                  ...payload,
                }),
              )
            },
          ),
        )
        .handle(
          "reconcileFinancialCheckpoint",
          Effect.fn("Http.Accounting.reconcileFinancialCheckpoint")(
            function* ({ headers, payload }) {
              const principal = yield* CurrentPrincipal
              return yield* coreApiEffect(
                financialOperations.reconcileFinancialCheckpoint({
                  principal,
                  tenantId: headers["x-tenant-id"],
                  ...payload,
                }),
              )
            },
          ),
        )
        .handle(
          "createFinancialJournalIntent",
          Effect.fn("Http.Accounting.createFinancialJournalIntent")(
            function* ({ headers, payload }) {
              const principal = yield* CurrentPrincipal
              return yield* coreApiEffect(
                financialOperations.createJournalIntent({
                  principal,
                  tenantId: headers["x-tenant-id"],
                  ...payload,
                }),
              )
            },
          ),
        )
        .handle(
          "createFinancialRevenueIntent",
          Effect.fn("Http.Accounting.createFinancialRevenueIntent")(
            function* ({ headers, payload }) {
              const principal = yield* CurrentPrincipal
              return yield* coreApiEffect(
                financialOperations.createRevenueIntent({
                  principal,
                  tenantId: headers["x-tenant-id"],
                  ...payload,
                }),
              )
            },
          ),
        )
        .handle(
          "createFinancialReversalIntent",
          Effect.fn("Http.Accounting.createFinancialReversalIntent")(
            function* ({ headers, payload }) {
              const principal = yield* CurrentPrincipal
              return yield* coreApiEffect(
                financialOperations.createReversalIntent({
                  principal,
                  tenantId: headers["x-tenant-id"],
                  ...payload,
                }),
              )
            },
          ),
        )
    }),
)
export const ApiHandlers = Layer.mergeAll(
  HealthHandlers,
  UserAccountHandlers,
  PartyHandlers,
  AuthorizationHandlers,
  SalesHandlers,
  InventoryHandlers,
  ProcurementHandlers,
  AccountingHandlers,
  ProcessHandlers,
)
