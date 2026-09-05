import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { ApiError } from "./contracts/generated/identity.ts"
import type { Session } from "./session.ts"

export class BrowserConnection extends Context.Service<BrowserConnection, Session>()(
  "RITSEI/BrowserConnection",
) {}
export class RequestFailure extends Schema.TaggedError<RequestFailure>()("FrontendRequestFailure", {
  kind: Schema.Literals([
    "validation",
    "unauthorized",
    "forbidden",
    "not-found",
    "conflict",
    "unavailable",
    "network",
    "invalid-response",
    "unknown-outcome",
  ]),
}) {}

export const failureMessage = (error: unknown): string => {
  if (!(error instanceof RequestFailure)) {
    return "The request could not be completed. Reload the page to try again."
  }
  switch (error.kind) {
    case "validation":
      return "Enter a nonblank email before saving."
    case "unauthorized":
      return "Your session is no longer valid. Disconnect and connect a valid session."
    case "forbidden":
      return "You do not have permission to perform this action."
    case "not-found":
      return "This account is not available in the selected tenant. Reload the accounts."
    case "conflict":
      return "The update conflicts with an existing account or invalid input. Review the email and try again."
    case "unavailable":
      return "The service is unavailable. Reload the accounts before trying again."
    case "network":
      return "The service could not be reached. Check your connection and reload the accounts."
    case "invalid-response":
      return "The server returned an invalid or oversized response. No account data was accepted."
    case "unknown-outcome":
      return "The server may have saved this change. Reload the accounts and check the email before trying again."
  }
}

// The existing list endpoint has no pagination. Refuse oversized payloads instead of silently
// truncating or pretending a client-side rendering window bounds the backend query.
const maxResponseBytes = 131_072
const readBounded = async (response: Response): Promise<string> => {
  const reader = response.body?.getReader()
  if (!reader) throw new RequestFailure({ kind: "invalid-response" })
  const decoder = new TextDecoder()
  let bytes = 0
  let text = ""
  try {
    for (;;) {
      const next = await reader.read()
      if (next.done) return text + decoder.decode()
      bytes += next.value.byteLength
      if (bytes > maxResponseBytes) {
        throw new RequestFailure({ kind: "invalid-response" })
      }
      text += decoder.decode(next.value, { stream: true })
    }
  } finally {
    await reader.cancel()
    reader.releaseLock()
  }
}

export const requestJson = Effect.fn("Frontend.requestJson")(function* (
  path: string,
  method: "GET" | "PATCH" = "GET",
  payload?: unknown,
) {
  const connection = yield* BrowserConnection
  const response = yield* Effect.tryPromise({
    try: async (signal) => {
      const response = await fetch(`/api${path}`, {
        method,
        headers: {
          "Authorization": `Bearer ${connection.token}`,
          "x-tenant-id": connection.tenantId,
          "Content-Type": "application/json",
        },
        ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
      })
      return { status: response.status, body: await readBounded(response) }
    },
    catch: (cause) =>
      cause instanceof RequestFailure ? cause : new RequestFailure({
        kind: method === "PATCH" ? "unknown-outcome" : "network",
      }),
  })
  if (response.status >= 200 && response.status < 300) return response.body
  const error = yield* Schema.decodeUnknownEffect(
    Schema.fromJsonString(ApiError),
  )(response.body).pipe(
    Effect.mapError(() =>
      new RequestFailure({
        kind: method === "PATCH" ? "unknown-outcome" : "invalid-response",
      })
    ),
  )
  const kinds = {
    ApiUnauthorized: [401, "unauthorized"],
    ApiForbidden: [403, "forbidden"],
    ApiNotFound: [404, "not-found"],
    ApiConflict: [409, "conflict"],
    ApiServiceUnavailable: [503, "unavailable"],
  } as const
  const [status, kind] = kinds[error._tag]
  return yield* Effect.fail(
    new RequestFailure({
      kind: status === response.status ? kind : "invalid-response",
    }),
  )
})
