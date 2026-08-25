import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { Principal } from "../../auth/mod.ts"
import { AuthorizationDenied } from "../../authorization/mod.ts"
import {
  DatabaseFailure,
  FinancialMajorAmount,
  requireExactMajorToMinor,
} from "../../kernel/mod.ts"
import { EventEnvelope, EventIdempotencyConflict } from "../../messaging/mod.ts"
import { SalesOrderInvalidState, SalesOrderNotFound } from "../../sales/mod.ts"
import { FinancialVerificationEvidence } from "./financial-readiness.ts"
import * as AccountingErrors from "./errors.ts"

const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))
const Uuid = Schema.String.check(Schema.isUUID())
const NonNegativeInt = Schema.Int.check(
  Schema.isBetween({ minimum: 0, maximum: 0x7fffffff }),
)
const Money = FinancialMajorAmount
const CurrencyCode = Schema.String.check(Schema.isPattern(/^[A-Za-z]{3}$/))
const FinancialEngine = Schema.Literals(["postgresql", "tigerbeetle"])
const FinancialCutoverStatus = Schema.Literals([
  "postgresql",
  "preparing_tigerbeetle",
  "verification_pending",
  "approved",
  "activating",
  "tigerbeetle",
])
const Precision = Schema.Literal(2)
const FiscalYearStartMonth = Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 12 }))
const IsoDate = Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/))
const InstantString = EventEnvelope.fields.occurredAt

export const AccountingConfiguration = Schema.Struct({
  tenantId: Uuid,
  legalEntityId: Uuid,
  baseCurrency: CurrencyCode,
  precision: Precision,
  fiscalYearStartMonth: FiscalYearStartMonth,
  postingEnabled: Schema.Boolean,
  financialEngine: FinancialEngine,
})

export const Account = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  code: Schema.String,
  name: Schema.String,
  type: Schema.Literals(["asset", "liability", "equity", "revenue", "expense"]),
})

export const JournalLine = Schema.Struct({
  accountId: Uuid,
  debit: Money,
  credit: Money,
}).check(Schema.makeFilter(
  (line) => {
    const debit = requireExactMajorToMinor(line.debit, 2)
    const credit = requireExactMajorToMinor(line.credit, 2)
    return (debit > 0n && credit === 0n) || (credit > 0n && debit === 0n)
  },
  { expected: "exactly one journal line amount must be positive" },
))

export const JournalEntry = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  reference: NonEmptyString,
  status: Schema.Literals(["posted", "reversed"]),
  postedAt: InstantString,
  reversesEntryId: Schema.optional(Uuid),
  lines: Schema.Array(JournalLine),
}).check(Schema.makeFilter(
  (entry) =>
    entry.status === "reversed"
      ? entry.reversesEntryId !== undefined
      : entry.reversesEntryId === undefined,
  { expected: "journal reversal state consistent with its status" },
))

export const AccountingPeriod = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  legalEntityId: Uuid,
  startsOn: IsoDate,
  endsOn: IsoDate,
  status: Schema.Literals(["open", "closed"]),
}).check(Schema.makeFilter(
  (period) => period.startsOn <= period.endsOn,
  { expected: "accounting periods must end on or after they start" },
))

export const RevenuePostingProfile = Schema.Struct({
  tenantId: Uuid,
  legalEntityId: Uuid,
  receivableAccountId: Uuid,
  revenueAccountId: Uuid,
}).check(Schema.makeFilter(
  (profile) => profile.receivableAccountId !== profile.revenueAccountId,
  { expected: "revenue posting accounts must be distinct" },
))

export type AccountingConfiguration = Schema.Schema.Type<typeof AccountingConfiguration>
export type Account = Schema.Schema.Type<typeof Account>
export type JournalLine = Schema.Schema.Type<typeof JournalLine>
export type JournalEntry = Schema.Schema.Type<typeof JournalEntry>
export type AccountingPeriod = Schema.Schema.Type<typeof AccountingPeriod>
export type RevenuePostingProfile = Schema.Schema.Type<typeof RevenuePostingProfile>

const ScopedInput = { principal: Principal, tenantId: Schema.String }

export const FinancialCutoverControl = Schema.Struct({
  tenantId: Uuid,
  legalEntityId: Uuid,
  status: FinancialCutoverStatus,
  sourceEngine: Schema.Literal("postgresql"),
  targetEngine: Schema.Literal("tigerbeetle"),
  cutoverWatermark: Schema.NullOr(NonEmptyString),
  verificationHash: Schema.NullOr(NonEmptyString),
  openingBalanceVerified: Schema.Boolean,
  historicalBoundaryVerified: Schema.Boolean,
  reconciliationHealthy: Schema.Boolean,
  backupRecoveryVerified: Schema.Boolean,
  evidenceArtifactId: Schema.NullOr(Uuid),
  unresolvedAcceptedOperations: NonNegativeInt,
  approvedBy: Schema.NullOr(NonEmptyString),
  approvedAt: Schema.NullOr(InstantString),
  activatedBy: Schema.NullOr(NonEmptyString),
  activatedAt: Schema.NullOr(InstantString),
  lastError: Schema.NullOr(NonEmptyString),
}).check(Schema.makeFilter(
  (control) =>
    !["approved", "activating", "tigerbeetle"].includes(control.status) ||
    (
      control.openingBalanceVerified &&
      control.historicalBoundaryVerified &&
      control.reconciliationHealthy &&
      control.backupRecoveryVerified &&
      control.unresolvedAcceptedOperations === 0 &&
      control.cutoverWatermark !== null &&
      control.verificationHash !== null &&
      control.evidenceArtifactId !== null &&
      control.approvedBy !== null &&
      control.approvedAt !== null
    ),
  { expected: "cutover approval metadata consistent with status" },
)).check(Schema.makeFilter(
  (control) =>
    control.status !== "tigerbeetle" ||
    (control.activatedBy !== null && control.activatedAt !== null),
  { expected: "cutover activation metadata consistent with status" },
))
export type FinancialCutoverControl = Schema.Schema.Type<typeof FinancialCutoverControl>

export const FinancialVerificationArtifact = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  legalEntityId: Uuid,
  artifactHash: Schema.String.check(Schema.isPattern(/^[0-9a-f]{64}$/)),
  signatureAlgorithm: Schema.Literal("Ed25519"),
  signingKeyId: NonEmptyString,
  signature: Schema.String.check(Schema.isPattern(/^[A-Za-z0-9_-]+$/)),
  status: Schema.Literals(["verified", "rejected"]),
  evidence: FinancialVerificationEvidence,
  producerPrincipalId: NonEmptyString,
  createdAt: InstantString,
})
export type FinancialVerificationArtifact = Schema.Schema.Type<
  typeof FinancialVerificationArtifact
>

export const RecordFinancialVerificationArtifactInput = Schema.Struct({
  ...ScopedInput,
  evidence: FinancialVerificationEvidence,
})

export const PrepareTigerBeetleCutoverInput = Schema.Struct({
  ...ScopedInput,
  legalEntityId: Uuid,
})

export const ApproveTigerBeetleCutoverInput = Schema.Struct({
  ...ScopedInput,
  legalEntityId: Uuid,
  evidenceArtifactId: Uuid,
})

export const ActivateTigerBeetleCutoverInput = Schema.Struct({
  ...ScopedInput,
  legalEntityId: Uuid,
})

export const ConfigureLegalEntityInput = Schema.Struct({
  ...ScopedInput,
  legalEntityId: Schema.String,
  baseCurrency: CurrencyCode,
  precision: Precision,
  fiscalYearStartMonth: FiscalYearStartMonth,
  postingEnabled: Schema.Boolean,
  financialEngine: Schema.optionalKey(
    FinancialEngine.pipe(Schema.withDecodingDefaultKey(Effect.succeed("postgresql" as const))),
  ),
})

export const CreateAccountInput = Schema.Struct({
  ...ScopedInput,
  code: Schema.String,
  name: Schema.String,
  type: Account.fields.type,
})

export const PostJournalInput = Schema.Struct({
  ...ScopedInput,
  reference: NonEmptyString,
  lines: Schema.Array(JournalLine),
})

export const ConfigureRevenuePostingInput = Schema.Struct({
  ...ScopedInput,
  legalEntityId: Schema.String,
  receivableAccountId: Schema.String,
  revenueAccountId: Schema.String,
}).check(Schema.makeFilter(
  (profile) => profile.receivableAccountId !== profile.revenueAccountId,
  { expected: "revenue posting accounts must be distinct" },
))

export const OpenPeriodInput = Schema.Struct({
  ...ScopedInput,
  legalEntityId: Schema.String,
  startsOn: IsoDate,
  endsOn: IsoDate,
}).check(Schema.makeFilter(
  (period) => period.startsOn <= period.endsOn,
  { expected: "accounting periods must end on or after they start" },
))

export const ClosePeriodInput = Schema.Struct({
  ...ScopedInput,
  legalEntityId: Schema.String,
  periodId: Schema.String,
})

export const PostRevenueForOrderInput = Schema.Struct({
  ...ScopedInput,
  legalEntityId: Schema.String,
  orderId: Uuid,
  amount: Schema.optionalKey(Money),
  commandId: NonEmptyString,
  correlationId: NonEmptyString,
  causationId: Schema.optionalKey(Schema.NullOr(NonEmptyString)),
})

export const ReverseRevenueForOrderInput = Schema.Struct({
  ...ScopedInput,
  legalEntityId: Schema.String,
  orderId: Uuid,
})

type CommonFailure = AuthorizationDenied | DatabaseFailure | Schema.SchemaError

export interface AccountingService {
  readonly configureLegalEntity: (
    input: unknown,
  ) => Effect.Effect<
    AccountingConfiguration,
    | AccountingErrors.AccountingConfigurationAlreadyExists
    | AccountingErrors.AccountingLegalEntityNotFound
    | AccountingErrors.FinancialEngineCutoverBlocked
    | CommonFailure
  >
  readonly recordFinancialVerificationArtifact: (
    input: unknown,
  ) => Effect.Effect<
    FinancialVerificationArtifact,
    | AccountingErrors.FinancialVerificationArtifactInvalid
    | DatabaseFailure
    | AuthorizationDenied
    | Schema.SchemaError
  >
  readonly prepareTigerBeetleCutover: (
    input: unknown,
  ) => Effect.Effect<
    FinancialCutoverControl,
    | AccountingErrors.AccountingLegalEntityNotFound
    | AccountingErrors.FinancialEngineActivated
    | AccountingErrors.FinancialEngineCutoverBlocked
    | CommonFailure
  >
  readonly approveTigerBeetleCutover: (
    input: unknown,
  ) => Effect.Effect<
    FinancialCutoverControl,
    | AccountingErrors.AccountingLegalEntityNotFound
    | AccountingErrors.FinancialEngineActivated
    | AccountingErrors.FinancialEngineCutoverBlocked
    | AccountingErrors.FinancialVerificationArtifactInvalid
    | AccountingErrors.FinancialVerificationArtifactNotFound
    | CommonFailure
  >
  readonly activateTigerBeetleCutover: (
    input: unknown,
  ) => Effect.Effect<
    FinancialCutoverControl,
    | AccountingErrors.AccountingLegalEntityNotFound
    | AccountingErrors.FinancialEngineActivated
    | AccountingErrors.FinancialEngineCutoverBlocked
    | CommonFailure
  >
  readonly createAccount: (
    input: unknown,
  ) => Effect.Effect<Account, AccountingErrors.AccountAlreadyExists | CommonFailure>
  readonly configureRevenuePosting: (
    input: unknown,
  ) => Effect.Effect<
    RevenuePostingProfile,
    | AccountingErrors.AccountNotFound
    | AccountingErrors.InvalidRevenuePostingProfile
    | AccountingErrors.RevenuePostingProfileAlreadyExists
    | CommonFailure
  >
  readonly openPeriod: (
    input: unknown,
  ) => Effect.Effect<AccountingPeriod, AccountingErrors.AccountingPeriodOverlap | CommonFailure>
  readonly closePeriod: (
    input: unknown,
  ) => Effect.Effect<
    AccountingPeriod,
    | AccountingErrors.FinancialOperationsPending
    | AccountingErrors.AccountingPeriodNotFound
    | CommonFailure
  >
  readonly postRevenueForOrder: (
    input: unknown,
  ) => Effect.Effect<
    JournalEntry,
    | AccountingErrors.AccountingPeriodNotOpen
    | EventIdempotencyConflict
    | AccountingErrors.FinancialEngineActivated
    | AccountingErrors.JournalIdempotencyConflict
    | AccountingErrors.RevenuePostingProfileNotFound
    | SalesOrderInvalidState
    | SalesOrderNotFound
    | CommonFailure
  >
  readonly reverseRevenueForOrder: (
    input: unknown,
  ) => Effect.Effect<
    JournalEntry,
    | AccountingErrors.AccountingPeriodNotOpen
    | AccountingErrors.FinancialEngineActivated
    | AccountingErrors.JournalIdempotencyConflict
    | AccountingErrors.RevenueJournalNotFound
    | AccountingErrors.RevenuePostingProfileNotFound
    | CommonFailure
  >
  readonly postJournal: (
    input: unknown,
  ) => Effect.Effect<
    JournalEntry,
    | AccountingErrors.AccountNotFound
    | AccountingErrors.FinancialEngineActivated
    | AccountingErrors.JournalIdempotencyConflict
    | AccountingErrors.JournalReferenceAlreadyExists
    | AccountingErrors.InvalidJournalLine
    | AccountingErrors.UnbalancedJournal
    | CommonFailure
  >
}

export const AccountingService = Context.Service<AccountingService>(
  "RITSEI/AccountingService",
)
