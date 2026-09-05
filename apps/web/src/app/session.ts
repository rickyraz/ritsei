import { createContext } from "solid-js"
import type { Session } from "../shared/session.ts"

// A new connection replaces the whole runtime/cache subtree, even for the same tenant.
export const SessionContext = createContext<{
  readonly current: () => Session | null
  readonly replace: (session: Session | null) => void
}>()
