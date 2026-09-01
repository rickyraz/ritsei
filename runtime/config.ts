import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { FinancialLedgerAuthority } from "../modules/accounting/mod.ts"
import type { TigerBeetleFinancialLedgerConfig } from "../platform/mod.ts"

export const DeploymentProfile = Schema.Literals([
  "entry",
  "standard",
  "scale",
  "enterprise",
])
export type DeploymentProfile = Schema.Schema.Type<typeof DeploymentProfile>

export const FinancialAuthority = FinancialLedgerAuthority
export type FinancialAuthority = Schema.Schema.Type<typeof FinancialAuthority>

export type PostgresReadYourWritesRuntimeConfiguration = {
  readonly replicaUrl: string
  readonly placementId: string
  readonly secret: string
  readonly maxWaitMs: number
  readonly tokenTtlMs: number
}

export type RitseiRuntimeConfiguration = Readonly<
  & {
    readonly deploymentProfile: DeploymentProfile
    readonly postgresReadYourWrites?: PostgresReadYourWritesRuntimeConfiguration
  }
  & (
    | {
      readonly financialAuthority: "postgresql"
      readonly tigerBeetle?: undefined
    }
    | {
      readonly financialAuthority: "tigerbeetle"
      readonly tigerBeetle: TigerBeetleFinancialLedgerConfig
    }
  )
>

export class RuntimeConfigurationFailure extends Schema.TaggedError<RuntimeConfigurationFailure>()(
  "RuntimeConfigurationFailure",
  {
    reason: Schema.Literals([
      "invalid_configuration",
      "missing_tigerbeetle_configuration",
      "invalid_tigerbeetle_configuration",
      "missing_postgres_read_your_writes_configuration",
      "invalid_postgres_read_your_writes_configuration",
    ]),
  },
) {}

export interface RuntimeEnvironment {
  readonly get: (name: string) => string | undefined
}

const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))
const RawRuntimeConfiguration = Schema.Struct({
  deploymentProfile: DeploymentProfile,
  financialAuthority: FinancialAuthority,
  postgresReadYourWrites: Schema.optionalKey(Schema.Struct({
    replicaUrl: NonEmptyString,
    placementId: NonEmptyString,
    secret: NonEmptyString,
    maxWaitMs: NonEmptyString,
    tokenTtlMs: NonEmptyString,
  })),
  tigerBeetle: Schema.optionalKey(Schema.Struct({
    clusterId: NonEmptyString,
    replicaAddresses: Schema.Array(NonEmptyString).check(Schema.isMinLength(1)),
    ledger: NonEmptyString,
    code: NonEmptyString,
    currency: NonEmptyString,
  })),
})

type RawRuntimeConfiguration = Schema.Schema.Type<typeof RawRuntimeConfiguration>

const invalid = (reason: RuntimeConfigurationFailure["reason"]) =>
  new RuntimeConfigurationFailure({ reason })

const parseSafeInteger = (value: string) => {
  if (!/^\d+$/.test(value)) return undefined
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : undefined
}

const parsePostgresReadYourWritesConfiguration = (
  raw: RawRuntimeConfiguration["postgresReadYourWrites"],
): Effect.Effect<PostgresReadYourWritesRuntimeConfiguration, RuntimeConfigurationFailure> => {
  if (raw === undefined) {
    return Effect.fail(invalid("missing_postgres_read_your_writes_configuration"))
  }
  const maxWaitMs = parseSafeInteger(raw.maxWaitMs)
  const tokenTtlMs = parseSafeInteger(raw.tokenTtlMs)
  if (
    raw.replicaUrl.trim().length === 0 || raw.placementId.trim().length === 0 ||
    new TextEncoder().encode(raw.secret).length < 32 || maxWaitMs === undefined ||
    maxWaitMs < 1 || maxWaitMs > 30_000 || tokenTtlMs === undefined || tokenTtlMs < 1 ||
    tokenTtlMs > 3_600_000
  ) {
    return Effect.fail(invalid("invalid_postgres_read_your_writes_configuration"))
  }
  return Effect.succeed({
    replicaUrl: raw.replicaUrl,
    placementId: raw.placementId,
    secret: raw.secret,
    maxWaitMs,
    tokenTtlMs,
  })
}

const parseTigerBeetleConfiguration = (
  raw: RawRuntimeConfiguration["tigerBeetle"],
): Effect.Effect<TigerBeetleFinancialLedgerConfig, RuntimeConfigurationFailure> => {
  if (raw === undefined) return Effect.fail(invalid("missing_tigerbeetle_configuration"))
  if (!/^\d+$/.test(raw.clusterId)) return Effect.fail(invalid("invalid_tigerbeetle_configuration"))
  const clusterId = BigInt(raw.clusterId)
  const ledger = parseSafeInteger(raw.ledger)
  const code = parseSafeInteger(raw.code)
  const currency = raw.currency.toUpperCase()
  if (
    clusterId < 0n || clusterId > (1n << 128n) - 1n || ledger === undefined || ledger < 1 ||
    ledger > 0xffff_ffff || code === undefined || code < 1 || code > 0xffff_ffff ||
    !/^[A-Z]{3}$/.test(currency)
  ) {
    return Effect.fail(invalid("invalid_tigerbeetle_configuration"))
  }
  return Effect.succeed({
    clusterId,
    replicaAddresses: raw.replicaAddresses,
    ledger,
    code,
    currency,
  })
}

const readPostgresReadYourWritesValues = (
  environment: RuntimeEnvironment,
): Pick<RawRuntimeConfiguration, "postgresReadYourWrites"> => {
  if (environment.get("RITSEI_POSTGRES_RYW_ENABLED") !== "true") return {}
  const replicaUrl = environment.get("POSTGRES_REPLICA_URL")
  const placementId = environment.get("RITSEI_POSTGRES_PLACEMENT_ID")
  const secret = environment.get("RITSEI_POSTGRES_CONSISTENCY_SECRET")
  if (replicaUrl === undefined || placementId === undefined || secret === undefined) return {}
  return {
    postgresReadYourWrites: {
      replicaUrl,
      placementId,
      secret,
      maxWaitMs: environment.get("RITSEI_POSTGRES_RYW_MAX_WAIT_MS") ?? "1000",
      tokenTtlMs: environment.get("RITSEI_POSTGRES_CONSISTENCY_TTL_MS") ?? "300000",
    },
  }
}

const readTigerBeetleValues = (
  environment: RuntimeEnvironment,
  financialAuthority: string,
): Pick<RawRuntimeConfiguration, "tigerBeetle"> => {
  if (financialAuthority !== "tigerbeetle") return {}
  const clusterId = environment.get("TIGERBEETLE_CLUSTER_ID")
  const replicaAddresses = environment.get("TIGERBEETLE_REPLICA_ADDRESSES")
    ?.split(",").map((address) => address.trim()).filter((address) => address.length > 0)
  const ledger = environment.get("TIGERBEETLE_LEDGER")
  const code = environment.get("TIGERBEETLE_CODE")
  const currency = environment.get("TIGERBEETLE_CURRENCY")
  if (
    clusterId === undefined || replicaAddresses === undefined || ledger === undefined ||
    code === undefined || currency === undefined
  ) return {}
  return {
    tigerBeetle: { clusterId, replicaAddresses, ledger, code, currency },
  }
}

export const parseRuntimeConfiguration = (environment: RuntimeEnvironment) =>
  Effect.gen(function* () {
    const financialAuthority = environment.get("RITSEI_FINANCIAL_AUTHORITY") ?? "postgresql"
    const raw = {
      deploymentProfile: environment.get("RITSEI_DEPLOYMENT_PROFILE") ?? "entry",
      financialAuthority,
      ...readPostgresReadYourWritesValues(environment),
      ...readTigerBeetleValues(environment, financialAuthority),
    }
    const decoded = yield* Schema.decodeUnknownEffect(RawRuntimeConfiguration)(raw).pipe(
      Effect.mapError(() => invalid("invalid_configuration")),
    )
    const postgresReadYourWrites = environment.get("RITSEI_POSTGRES_RYW_ENABLED") === "true"
      ? yield* parsePostgresReadYourWritesConfiguration(decoded.postgresReadYourWrites)
      : undefined
    if (decoded.financialAuthority === "postgresql") {
      return {
        deploymentProfile: decoded.deploymentProfile,
        financialAuthority: "postgresql" as const,
        tigerBeetle: undefined,
        ...(postgresReadYourWrites === undefined ? {} : { postgresReadYourWrites }),
      } satisfies RitseiRuntimeConfiguration
    }
    const tigerBeetle = yield* parseTigerBeetleConfiguration(decoded.tigerBeetle)
    return {
      deploymentProfile: decoded.deploymentProfile,
      financialAuthority: "tigerbeetle" as const,
      tigerBeetle,
      ...(postgresReadYourWrites === undefined ? {} : { postgresReadYourWrites }),
    } satisfies RitseiRuntimeConfiguration
  })

export const readRuntimeConfiguration = (
  environment: RuntimeEnvironment = Deno.env,
) => parseRuntimeConfiguration(environment)
