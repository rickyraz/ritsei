import type { DatabaseFailure } from "../../kernel/mod.ts"
import type { UserAccount, UserAccountAuthenticationState } from "./contract.ts"
import type { UserAccountAlreadyExists, UserAccountNotFound } from "./errors.ts"

export type UserAccountStoreError =
  | UserAccountAlreadyExists
  | UserAccountNotFound
  | DatabaseFailure

export interface UserAccountStore {
  readonly create: (
    email: string,
  ) => import("effect/Effect").Effect<UserAccount, UserAccountAlreadyExists | DatabaseFailure>
  readonly getById: (
    id: string,
  ) => import("effect/Effect").Effect<UserAccount, UserAccountNotFound | DatabaseFailure>
  readonly getByIds: (
    ids: readonly string[],
  ) => import("effect/Effect").Effect<readonly UserAccount[], DatabaseFailure>
  readonly getAuthenticationState: (
    id: string,
  ) => import("effect/Effect").Effect<
    UserAccountAuthenticationState,
    UserAccountNotFound | DatabaseFailure
  >
  readonly list: () => import("effect/Effect").Effect<readonly UserAccount[], DatabaseFailure>
  readonly update: (
    id: string,
    email: string,
  ) => import("effect/Effect").Effect<
    UserAccount,
    UserAccountAlreadyExists | UserAccountNotFound | DatabaseFailure
  >
  readonly disable: (
    id: string,
  ) => import("effect/Effect").Effect<UserAccount, UserAccountNotFound | DatabaseFailure>
  readonly enable: (
    id: string,
  ) => import("effect/Effect").Effect<UserAccount, UserAccountNotFound | DatabaseFailure>
  readonly remove: (
    id: string,
  ) => import("effect/Effect").Effect<void, UserAccountNotFound | DatabaseFailure>
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase()
