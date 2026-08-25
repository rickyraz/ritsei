import * as Layer from "effect/Layer"

import { AccountingService, makeAccountingService, makeAccountingTestLayer } from "./service.ts"
import {
  FinancialOperationService,
  FinancialOperationServiceLive,
  makeFinancialOperationService,
} from "./financial-operations.ts"

/** Named production composition for the Accounting control-plane service. */
export const AccountingLive = Layer.effect(AccountingService, makeAccountingService)

/** Named production composition for financial operation submission/reconciliation. */
export const FinancialOperationsLive = FinancialOperationServiceLive

export const AccountingPostgresLive = AccountingLive
export const FinancialOperationsPostgresLive = FinancialOperationsLive

export const makeAccountingTestLive = makeAccountingTestLayer

export const makeFinancialOperationsTestLive = () =>
  Layer.effect(FinancialOperationService, makeFinancialOperationService)

export { makeAccountingService, makeAccountingTestLayer }
export { FinancialOperationServiceLive }
