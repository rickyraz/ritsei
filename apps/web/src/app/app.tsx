import { createRouter } from "@solidjs/router"
import { createSignal, Errored, lazy, Loading, Show } from "solid-js"
import type { Session } from "../shared/session.ts"
import { Button, ConfirmDialog, layout } from "../ui/index.ts"
import { Connection } from "./connection.tsx"
import { SessionContext } from "./session.ts"

const AccountsRoute = lazy(() => import("./accounts-route.tsx"))

const Router = createRouter({
  preloadLinks: false,
  routes: [
    { path: "/", component: Connection },
    { path: "/user-accounts", component: AccountsRoute },
    {
      path: "*missing",
      component: () => (
        <section>
          <h1>Page not found</h1>
          <a href="/">Return to connection</a>
        </section>
      ),
    },
  ],
})

export function App() {
  const [session, replace] = createSignal<Session | null>(null)
  const [dark, setDark] = createSignal(false)
  return (
    <SessionContext value={{ current: session, replace }}>
      <div data-theme={dark() ? "dark" : "light"} class={layout.page}>
        <a class={layout.skip} href="#main">Skip to content</a>
        <header class={layout.header}>
          <a href="/" aria-label="RITSEI home" class={layout.wordmark}>
            RITSEI
          </a>
          <nav aria-label="Primary" class={layout.row}>
            <a href="/">Connection</a>
            <a href="/user-accounts">User accounts</a>
          </nav>
          <div class={layout.row}>
            <Button
              type="button"
              aria-pressed={dark() ? "true" : "false"}
              onClick={() => setDark(!dark())}
            >
              Dark theme
            </Button>
            <Show when={session()}>
              <ConfirmDialog
                triggerLabel="Disconnect"
                title="Disconnect this session?"
                description="Your in-memory session credentials will be cleared."
                confirmLabel="Disconnect"
                onConfirm={() => replace(null)}
              />
            </Show>
          </div>
        </header>
        <div class={layout.notice}>
          Development preview · Production readiness gates remain open
        </div>
        <main id="main" tabindex="-1" class={layout.main}>
          <Errored
            fallback={
              <p role="alert">
                This page could not load. Reload the browser to try again.
              </p>
            }
          >
            <Loading fallback={<p role="status">Loading page…</p>}>
              <Router />
            </Loading>
          </Errored>
        </main>
        <footer class={layout.footer}>
          RITSEI · Identity workspace · Backend authorization remains authoritative
        </footer>
      </div>
    </SessionContext>
  )
}
