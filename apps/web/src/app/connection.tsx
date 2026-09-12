import { createSignal, useContext } from "solid-js"
import { useNavigate } from "@solidjs/router"
import * as Schema from "effect/Schema"
import * as Result from "effect/Result"
import { Session } from "../shared/session.ts"
import { SessionContext } from "./session.ts"
import { Button, control, layout, surface } from "../ui/index.ts"

export function Connection() {
  const session = useContext(SessionContext)
  const navigate = useNavigate()
  const [invalid, setInvalid] = createSignal(false)
  let tenantInput: HTMLInputElement | undefined
  return (
    <section class={layout.stack} aria-labelledby="connection-heading">
      <h1 id="connection-heading">Connect a session</h1>
      <p>
        This development preview uses an existing session. Sign-in and tenant provisioning are not
        available here.
      </p>
      <form
        class={surface()}
        onSubmit={(event) => {
          event.preventDefault()
          const form = event.currentTarget
          const data = new FormData(form)
          const decoded = Schema.decodeUnknownResult(Session)({
            tenantId: data.get("tenant"),
            token: data.get("token"),
          })
          if (Result.isFailure(decoded)) {
            setInvalid(true)
            tenantInput?.focus()
            return
          }
          session.replace(decoded.success)
          form.reset()
          setInvalid(false)
          navigate("/user-accounts")
        }}
      >
        <div class={layout.stack}>
          <label for="tenant">Tenant ID</label>
          <input
            ref={(element) => tenantInput = element}
            class={control({ kind: "input" })}
            id="tenant"
            name="tenant"
            required
            maxlength="36"
            aria-invalid={invalid() ? "true" : "false"}
            aria-describedby="connection-help connection-error"
          />
          <label for="token">Session token</label>
          <input
            class={control({ kind: "input" })}
            id="token"
            name="token"
            type="password"
            required
            maxlength="4096"
            autocomplete="off"
            aria-invalid={invalid() ? "true" : "false"}
            aria-describedby="connection-help connection-error"
          />
          <p id="connection-help">
            Credentials stay in memory only. Disconnecting or reloading clears them. The server
            checks access for every request.
          </p>
          <p id="connection-error" role="alert">
            {invalid() ? "Enter a valid tenant UUID and a token without spaces." : ""}
          </p>
          <div>
            <Button variant="primary" type="submit">
              Connect
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}
