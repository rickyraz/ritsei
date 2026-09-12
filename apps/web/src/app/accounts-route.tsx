import { useLocation } from "@solidjs/router"
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query"
import { createMemo, onCleanup, Show, untrack, useContext } from "solid-js"
import * as Layer from "effect/Layer"
import * as Result from "effect/Result"
import * as Schema from "effect/Schema"
import { Accounts } from "../features/identity/accounts.tsx"
import { BrowserConnection } from "../shared/api.ts"
import { createRuntime, RuntimeContext } from "../shared/solid-effect.ts"
import { ApiRuntime } from "../shared/runtime.ts"
import type { Session } from "../shared/session.ts"
import { SessionContext } from "./session.ts"

function ConnectedAccounts(props: { session: Session }) {
  // The keyed connection boundary remounts this owner; credentials are immutable within it.
  const session = untrack(() => props.session)
  const runtime = createRuntime(Layer.succeed(BrowserConnection, session))
  const lifetime = new AbortController()
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
        networkMode: "always",
      },
      mutations: { retry: false, networkMode: "always" },
    },
  })
  onCleanup(() => {
    lifetime.abort()
    void client.cancelQueries()
    client.clear()
  })
  return (
    <ApiRuntime
      value={{ runtime, lifetime: lifetime.signal, tenantId: session.tenantId }}
    >
      <RuntimeContext value={runtime}>
        <QueryClientProvider client={client}>
          <Accounts />
        </QueryClientProvider>
      </RuntimeContext>
    </ApiRuntime>
  )
}

const RouteInput = Schema.Struct({})

export default function AccountsRoute() {
  const session = useContext(SessionContext)
  const location = useLocation()
  const valid = createMemo(() =>
    Result.isSuccess(
      Schema.decodeUnknownResult(RouteInput)(
        Object.fromEntries(new URLSearchParams(location.search)),
        { onExcessProperty: "error" },
      ),
    )
  )
  return (
    <Show
      when={valid()}
      fallback={
        <section>
          <h1>Invalid route</h1>
          <p role="alert">This page does not accept URL parameters.</p>
          <a href="/user-accounts">Open user accounts</a>
        </section>
      }
    >
      <Show
        when={session.current()}
        keyed
        fallback={
          <section>
            <h1>User accounts</h1>
            <p>Connect a valid session to view accounts.</p>
            <a href="/">Connect a session</a>
          </section>
        }
      >
        {(session) => <ConnectedAccounts session={session} />}
      </Show>
    </Show>
  )
}
