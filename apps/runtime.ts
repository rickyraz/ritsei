import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import type { Sql } from "postgres"

import {
  AccountingService,
  FinancialLedgerPort,
  FinancialOperationServiceLive,
  makeAccountingService,
  makePostgresqlFinancialLedgerLayer,
} from "../packages/accounting/mod.ts"
import { AuthService, makeAuthService } from "../packages/auth/mod.ts"
import {
  AuthorizationDenied,
  AuthorizationService,
  makeAuthorizationService,
} from "../packages/authorization/mod.ts"
import {
  IdentityAccountAuthorizer,
  IdentityAuthorizationDenied,
  IdentityCapabilities,
  IdentityEventPublisherLive,
  makeUserAccountService,
  UserAccountService,
} from "../packages/identity/mod.ts"
import {
  DurableJobEnqueuer,
  makeTigerBeetleFinancialLedger,
  PostgresDatabaseLive,
  WebCryptoLive,
} from "../packages/kernel/mod.ts"
import { makeMessagingService, MessagingService } from "../packages/messaging/mod.ts"
import { makePartyService, PartyEventPublisherLive, PartyService } from "../packages/party/mod.ts"
import { makeSalesService, SalesService } from "../packages/sales/mod.ts"
import { InventoryService, makeInventoryService } from "../packages/inventory/mod.ts"
import { ProcurementLive } from "../packages/procurement/mod.ts"
import {
  makeProcessJobEnqueuer,
  makeProcessService,
  ProcessService,
} from "../packages/process/mod.ts"
import type { FinancialVerificationSignerService } from "../packages/kernel/mod.ts"
import type { RitseiRuntimeConfiguration } from "./runtime-config.ts"

export const makeFinancialLedgerLayer = (
  database: ReturnType<typeof PostgresDatabaseLive>,
  configuration: RitseiRuntimeConfiguration,
) => {
  if (configuration.financialAuthority === "postgresql") {
    return makePostgresqlFinancialLedgerLayer.pipe(Layer.provide(database))
  }
  return Layer.effect(
    FinancialLedgerPort,
    makeTigerBeetleFinancialLedger(configuration.tigerBeetle),
  )
}

export const serviceLayers = (
  client: Sql,
  configuration: RitseiRuntimeConfiguration,
  financialSigner?: Layer.Layer<FinancialVerificationSignerService>,
) => {
  const DatabaseLive = PostgresDatabaseLive(client)
  const PlatformCore = DatabaseLive
  const PlatformLive = Layer.mergeAll(PlatformCore, WebCryptoLive)
  const financialLedger = makeFinancialLedgerLayer(DatabaseLive, configuration)

  const AuthorizationLive = Layer.effect(AuthorizationService, makeAuthorizationService).pipe(
    Layer.provide(DatabaseLive),
  )

  const BusinessRequirements = Layer.mergeAll(PlatformCore, AuthorizationLive)

  const MessagingLive = Layer.effect(MessagingService, makeMessagingService).pipe(
    Layer.provide(DatabaseLive),
  )

  const IdentityAccountAuthorizerLive = Layer.effect(
    IdentityAccountAuthorizer,
    Effect.gen(function* () {
      const authorization = yield* AuthorizationService
      return {
        authorize: (input: {
          readonly principal: { readonly userAccountId: string; readonly sessionId: string }
          readonly tenantId: string
        }) =>
          authorization.authorize({
            principal: input.principal,
            tenantId: input.tenantId,
            capability: IdentityCapabilities.userAccountCreate,
          }).pipe(
            Effect.mapError((error) =>
              error instanceof AuthorizationDenied
                ? new IdentityAuthorizationDenied({
                  tenantId: error.tenantId,
                  capability: error.capability,
                })
                : error
            ),
          ),
      }
    }),
  ).pipe(Layer.provide(AuthorizationLive))

  const IdentityLive = Layer.effect(UserAccountService, makeUserAccountService).pipe(
    Layer.provide(Layer.mergeAll(
      DatabaseLive,
      IdentityAccountAuthorizerLive,
      IdentityEventPublisherLive.pipe(Layer.provide(MessagingLive)),
    )),
  )

  const AuthLive = Layer.effect(AuthService, makeAuthService).pipe(
    Layer.provide(Layer.mergeAll(PlatformLive, IdentityLive)),
  )

  const PartyLive = Layer.effect(PartyService, makePartyService).pipe(
    Layer.provide(Layer.merge(
      BusinessRequirements,
      PartyEventPublisherLive.pipe(Layer.provide(MessagingLive)),
    )),
  )

  const SalesLive = Layer.effect(SalesService, makeSalesService).pipe(
    Layer.provide(Layer.merge(BusinessRequirements, MessagingLive)),
  )

  const InventoryLive = Layer.effect(InventoryService, makeInventoryService).pipe(
    Layer.provide(Layer.merge(BusinessRequirements, MessagingLive)),
  )

  const AccountingRequirements = financialSigner === undefined
    ? Layer.mergeAll(BusinessRequirements, MessagingLive, SalesLive, financialLedger)
    : Layer.mergeAll(
      BusinessRequirements,
      MessagingLive,
      SalesLive,
      financialLedger,
      financialSigner,
    )
  const AccountingLive = Layer.effect(AccountingService, makeAccountingService).pipe(
    Layer.provide(AccountingRequirements),
  )

  const ProcessJobEnqueuerLive = Layer.effect(
    DurableJobEnqueuer,
    makeProcessJobEnqueuer,
  ).pipe(Layer.provide(DatabaseLive))

  const FinancialOperationsLive = FinancialOperationServiceLive.pipe(
    Layer.provide(Layer.mergeAll(
      BusinessRequirements,
      MessagingLive,
      SalesLive,
      ProcessJobEnqueuerLive,
      financialLedger,
    )),
  )

  const ProcessLive = Layer.effect(ProcessService, makeProcessService).pipe(
    Layer.provide(
      Layer.mergeAll(BusinessRequirements, SalesLive, InventoryLive, AccountingLive, MessagingLive),
    ),
  )

  const ProcurementLiveWithRequirements = ProcurementLive.pipe(
    Layer.provide(
      Layer.mergeAll(BusinessRequirements, PartyLive, InventoryLive, MessagingLive),
    ),
  )

  const ApplicationLive = Layer.mergeAll(
    IdentityLive,
    AuthLive,
    AuthorizationLive,
    PartyLive,
    SalesLive,
    InventoryLive,
    AccountingLive,
    FinancialOperationsLive,
    ProcessJobEnqueuerLive,
    MessagingLive,
    ProcessLive,
    ProcurementLiveWithRequirements,
  )

  return ApplicationLive
}

export const makeApplicationLive = serviceLayers
