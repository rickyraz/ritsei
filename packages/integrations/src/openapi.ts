import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { ExternalActionNotAllowlisted, ExternalPayloadInvalid } from "./errors.ts"

const Uuid = Schema.String.check(Schema.isUUID())
const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))
const PositiveInt = Schema.Int.check(Schema.isGreaterThan(0))

export const OpenApiDocument = Schema.Struct({
  openapi: Schema.Literals(["3.2.0"]),
  info: Schema.Unknown,
  paths: Schema.Unknown,
})

export const OpenApiOperation = Schema.Struct({
  operationId: NonEmptyString,
  method: Schema.Literals(["get", "post", "put", "patch", "delete"]),
  path: NonEmptyString,
  hasAuthentication: Schema.Boolean,
  requiredScope: NonEmptyString,
  sideEffect: Schema.Boolean,
  idempotencyKeyRequired: Schema.Boolean,
})

export const OpenApiImportRequest = Schema.Struct({
  tenantId: Uuid,
  connectorId: NonEmptyString,
  document: OpenApiDocument,
  operation: OpenApiOperation,
  version: PositiveInt,
  allowlisted: Schema.Boolean,
})
export type OpenApiImportRequest = Schema.Schema.Type<typeof OpenApiImportRequest>

export type OpenApiOperationSelection = {
  readonly kind: "ExternalAction"
  readonly standard: "OpenAPI 3.2.0"
  readonly tenantId: string
  readonly connectorId: string
  readonly operationId: string
  readonly path: string
  readonly method: "get" | "post" | "put" | "patch" | "delete"
  readonly version: number
  readonly requiredScope: string
  readonly allowlisted: true
}

const invalid = (boundary: string, identifier: string) =>
  new ExternalPayloadInvalid({ boundary, identifier })

export const validateOpenApiImport = (
  input: unknown,
): Effect.Effect<
  OpenApiOperationSelection,
  ExternalActionNotAllowlisted | ExternalPayloadInvalid | Schema.SchemaError
> =>
  Effect.gen(function* () {
    const decoded = yield* Schema.decodeUnknownEffect(OpenApiImportRequest)(input)
    if (!decoded.allowlisted) {
      return yield* Effect.fail(
        new ExternalActionNotAllowlisted({
          tenantId: decoded.tenantId,
          actionId: `${decoded.connectorId}.${decoded.operation.operationId}`,
        }),
      )
    }
    if (!decoded.operation.hasAuthentication || !/\S/.test(decoded.operation.requiredScope)) {
      return yield* Effect.fail(
        invalid("integration.openapi.authentication", decoded.operation.operationId),
      )
    }
    if (decoded.operation.sideEffect && !decoded.operation.idempotencyKeyRequired) {
      return yield* Effect.fail(
        invalid("integration.openapi.idempotency", decoded.operation.operationId),
      )
    }
    return {
      kind: "ExternalAction" as const,
      standard: "OpenAPI 3.2.0" as const,
      tenantId: decoded.tenantId,
      connectorId: decoded.connectorId,
      operationId: decoded.operation.operationId,
      path: decoded.operation.path,
      method: decoded.operation.method,
      version: decoded.version,
      requiredScope: decoded.operation.requiredScope,
      allowlisted: true as const,
    }
  })
