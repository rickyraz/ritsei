import * as Layer from "effect/Layer"

import {
  FinancialLedgerPort,
  makePostgresqlFinancialLedgerLayer,
} from "../../packages/accounting/mod.ts"
import { makeTigerBeetleFinancialLedger, PostgresDatabaseLive } from "../../packages/kernel/mod.ts"
import type { RitseiRuntimeConfiguration } from "../runtime-config.ts"

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
