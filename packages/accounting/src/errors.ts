import * as Schema from "effect/Schema"

const Uuid = Schema.String.check(Schema.isUUID())

export class AccountingConfigurationAlreadyExists
  extends Schema.TaggedError<AccountingConfigurationAlreadyExists>()(
    "AccountingConfigurationAlreadyExists",
    {
      tenantId: Schema.String,
      legalEntityId: Schema.String,
    },
  ) {}
export class FinancialEngineActivated
  extends Schema.TaggedError<FinancialEngineActivated>()("FinancialEngineActivated", {
    tenantId: Schema.String,
    legalEntityId: Schema.String,
  }) {}
export class FinancialEngineCutoverBlocked
  extends Schema.TaggedError<FinancialEngineCutoverBlocked>()(
    "FinancialEngineCutoverBlocked",
    {
      tenantId: Schema.String,
      legalEntityId: Schema.String,
      reason: Schema.Literals([
        "activation_gates_pending",
        "not_prepared",
        "verification_mismatch",
        "unresolved_operations",
        "ledger_not_configured",
        "account_provisioning_failed",
      ]),
    },
  ) {}

export class FinancialVerificationArtifactNotFound
  extends Schema.TaggedError<FinancialVerificationArtifactNotFound>()(
    "FinancialVerificationArtifactNotFound",
    { tenantId: Uuid, artifactId: Uuid },
  ) {}
export class FinancialVerificationArtifactInvalid
  extends Schema.TaggedError<FinancialVerificationArtifactInvalid>()(
    "FinancialVerificationArtifactInvalid",
    {
      tenantId: Uuid,
      legalEntityId: Uuid,
      reason: Schema.Literals(["scope_mismatch", "incomplete", "mismatch", "stale", "unsigned"]),
    },
  ) {}

export class AccountingLegalEntityNotFound
  extends Schema.TaggedError<AccountingLegalEntityNotFound>()(
    "AccountingLegalEntityNotFound",
    {
      tenantId: Schema.String,
      legalEntityId: Schema.String,
    },
  ) {}
export class AccountAlreadyExists
  extends Schema.TaggedError<AccountAlreadyExists>()("AccountAlreadyExists", {
    tenantId: Schema.String,
    code: Schema.String,
  }) {}
export class AccountNotFound extends Schema.TaggedError<AccountNotFound>()("AccountNotFound", {
  tenantId: Schema.String,
}) {}
export class JournalReferenceAlreadyExists
  extends Schema.TaggedError<JournalReferenceAlreadyExists>()(
    "JournalReferenceAlreadyExists",
    {
      tenantId: Schema.String,
      reference: Schema.String,
    },
  ) {}
export class JournalIdempotencyConflict
  extends Schema.TaggedError<JournalIdempotencyConflict>()("JournalIdempotencyConflict", {
    tenantId: Schema.String,
    reference: Schema.String,
  }) {}
export class InvalidJournalLine
  extends Schema.TaggedError<InvalidJournalLine>()("InvalidJournalLine", {
    index: Schema.Int,
  }) {}
export class UnbalancedJournal
  extends Schema.TaggedError<UnbalancedJournal>()("UnbalancedJournal", {
    debit: Schema.String,
    credit: Schema.String,
  }) {}
export class RevenuePostingProfileAlreadyExists
  extends Schema.TaggedError<RevenuePostingProfileAlreadyExists>()(
    "RevenuePostingProfileAlreadyExists",
    { tenantId: Schema.String, legalEntityId: Schema.String },
  ) {}
export class InvalidRevenuePostingProfile
  extends Schema.TaggedError<InvalidRevenuePostingProfile>()("InvalidRevenuePostingProfile", {
    tenantId: Schema.String,
    legalEntityId: Schema.String,
  }) {}
export class AccountingPeriodOverlap
  extends Schema.TaggedError<AccountingPeriodOverlap>()("AccountingPeriodOverlap", {
    tenantId: Schema.String,
    legalEntityId: Schema.String,
  }) {}
export class AccountingPeriodNotFound
  extends Schema.TaggedError<AccountingPeriodNotFound>()("AccountingPeriodNotFound", {
    tenantId: Schema.String,
    legalEntityId: Schema.String,
    periodId: Schema.String,
  }) {}
export class AccountingPeriodNotOpen
  extends Schema.TaggedError<AccountingPeriodNotOpen>()("AccountingPeriodNotOpen", {
    tenantId: Schema.String,
    legalEntityId: Schema.String,
  }) {}
export class FinancialOperationsPending
  extends Schema.TaggedError<FinancialOperationsPending>()("FinancialOperationsPending", {
    tenantId: Schema.String,
    legalEntityId: Schema.String,
    periodId: Schema.String,
  }) {}
export class RevenuePostingProfileNotFound
  extends Schema.TaggedError<RevenuePostingProfileNotFound>()(
    "RevenuePostingProfileNotFound",
    {
      tenantId: Schema.String,
      legalEntityId: Schema.String,
    },
  ) {}
export class RevenueJournalNotFound
  extends Schema.TaggedError<RevenueJournalNotFound>()("RevenueJournalNotFound", {
    tenantId: Schema.String,
    legalEntityId: Schema.String,
    orderId: Uuid,
  }) {}
