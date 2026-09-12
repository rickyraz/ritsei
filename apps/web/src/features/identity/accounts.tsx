import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query"
import { createSignal, Errored, For, Loading, onSettled, Show, untrack, useContext } from "solid-js"
import type { UserAccount } from "../../shared/contracts/generated/identity.ts"
import { ApiRuntime, runRequest } from "../../shared/runtime.ts"
import { failureMessage, RequestFailure } from "../../shared/api.ts"
import { layout } from "../../ui/foundations/layout.ts"
import { control } from "../../ui/recipes/control.ts"
import { surface } from "../../ui/recipes/surface.ts"
import { listAccounts, updateAccount } from "./service.ts"

function EmailEditor(
  props: {
    account: UserAccount
    close: () => void
    reload: () => Promise<unknown>
  },
) {
  const scope = useContext(ApiRuntime)
  const client = useQueryClient()
  const initialEmail = untrack(() => props.account.email)
  let emailInput: HTMLInputElement | undefined
  const [invalid, setInvalid] = createSignal(false)
  const mutation = useMutation<
    UserAccount,
    RequestFailure,
    { id: string; email: string }
  >(() => ({
    mutationFn: (input) => runRequest(scope, updateAccount(input)),
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: ["identity", scope.tenantId, "accounts"],
      }),
  }))
  onSettled(() => emailInput?.focus())
  return (
    <section class={surface()} aria-labelledby="edit-heading">
      <form
        class={layout.stack}
        onSubmit={(event) => {
          event.preventDefault()
          if (
            mutation.isPending || mutation.error?.kind === "unknown-outcome"
          ) return
          const email = new FormData(event.currentTarget).get("email")
          if (typeof email !== "string" || !/\S/.test(email)) {
            setInvalid(true)
            emailInput?.focus()
            return
          }
          setInvalid(false)
          void mutation.mutate({ id: props.account.id, email })
        }}
      >
        <h2 id="edit-heading">Edit account email</h2>
        <p>
          This changes the global account, including its use in other tenants. The server checks
          your permission again when you save.
        </p>
        <label for="account-email">Email</label>
        <input
          ref={(element) => {
            emailInput = element
          }}
          id="account-email"
          name="email"
          type="text"
          inputmode="email"
          autocomplete="off"
          class={control({ kind: "input" })}
          value={initialEmail}
          required
          disabled={mutation.isPending}
          aria-invalid={invalid() || mutation.error?.kind === "validation" ? "true" : "false"}
          aria-describedby="email-error edit-help"
        />
        <p id="edit-help">
          A nonblank value is required. Account changes are never retried automatically.
        </p>
        <p id="email-error" role="alert">
          {invalid()
            ? "Enter a nonblank email before saving."
            : mutation.isError
            ? failureMessage(mutation.error)
            : ""}
        </p>
        <p role="status">
          {mutation.isPending
            ? "Saving email…"
            : mutation.isSuccess
            ? "Email saved. The account list has been refreshed."
            : ""}
        </p>
        <div class={layout.row}>
          <button
            class={control({ kind: "action" })}
            type="submit"
            disabled={mutation.isPending ||
              mutation.error?.kind === "unknown-outcome"}
          >
            Save email
          </button>
          <button
            class={control()}
            type="button"
            disabled={mutation.isPending}
            onClick={props.close}
          >
            Close editor
          </button>
          <Show when={mutation.error?.kind === "unknown-outcome"}>
            <button
              class={control()}
              type="button"
              onClick={() => {
                void props.reload().then(props.close)
              }}
            >
              Reload before retrying
            </button>
          </Show>
        </div>
      </form>
    </section>
  )
}

export function Accounts() {
  const scope = useContext(ApiRuntime)
  const query = useQuery<readonly UserAccount[], RequestFailure>(() => ({
    queryKey: ["identity", scope.tenantId, "accounts"],
    queryFn: ({ signal }) => runRequest(scope, listAccounts(), signal),
    throwOnError: true,
  }))
  const [editing, setEditing] = createSignal<string | null>(null)
  let trigger: HTMLButtonElement | undefined
  const close = () => {
    setEditing(null)
    trigger?.focus()
  }
  return (
    <section class={layout.stack} aria-labelledby="accounts-heading">
      <div class={layout.row}>
        <h1 id="accounts-heading">User accounts</h1>
        <button
          class={control()}
          type="button"
          onClick={() => {
            close()
            void query.refetch()
          }}
        >
          Reload accounts
        </button>
      </div>
      <p>
        Accounts linked to the connected tenant. Email and status belong to the global identity.
      </p>
      <Errored
        fallback={(error, reset) => (
          <div class={surface()}>
            <p role="alert">{failureMessage(error())}</p>
            <button
              class={control()}
              type="button"
              onClick={() => {
                void query.refetch().then(() => reset())
              }}
            >
              Try loading again
            </button>
          </div>
        )}
      >
        <Loading
          fallback={<p role="status" aria-busy="true">Loading user accounts…</p>}
        >
          <Show
            when={query.data.length > 0}
            fallback={<p role="status">No user accounts are linked to this tenant.</p>}
          >
            <div class={layout.scroll}>
              <table>
                <caption>
                  Tenant membership accounts · maximum 200 records in this preview
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Email</th>
                    <th scope="col">Account status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={query.data}>
                    {(account) => (
                      <tr>
                        <td>{account.email}</td>
                        <td>
                          {account.status === "active" ? "Active" : "Disabled"}
                        </td>
                        <td>
                          <button
                            class={control()}
                            type="button"
                            aria-label={`Edit email for ${account.email}`}
                            onClick={(event) => {
                              trigger = event.currentTarget
                              setEditing(account.id)
                            }}
                          >
                            Edit email
                          </button>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
            <Show
              when={query.data.find((account) => account.id === editing())}
              keyed
            >
              {(account) => (
                <EmailEditor
                  account={account}
                  close={close}
                  reload={() => query.refetch()}
                />
              )}
            </Show>
          </Show>
        </Loading>
      </Errored>
    </section>
  )
}
