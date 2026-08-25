/** Compatibility facade; PostgreSQL remains the existing ledger implementation. */
export {
  makePostgresqlFinancialLedger,
  makePostgresqlFinancialLedgerLayer,
} from "./postgresql-ledger.ts"
