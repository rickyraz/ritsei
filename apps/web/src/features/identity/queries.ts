import { useMutation, useQueryClient } from "@tanstack/solid-query"
import type { UserAccount } from "../../shared/contracts/generated/identity.ts"
import { type RequestFailure } from "../../shared/api.ts"
import { createServerQuery, serverQueryKey } from "../../shared/server-query.ts"
import { type ApiScope, runRequest } from "../../shared/runtime.ts"
import { listAccounts, updateAccount } from "./service.ts"

const accountsKey = ["identity", "accounts"] as const

export function createAccountsQuery(scope: ApiScope) {
  return createServerQuery<readonly UserAccount[], RequestFailure>({
    tenantId: scope.tenantId,
    key: accountsKey,
    cache: "collection",
    load: ({ signal }) => runRequest(scope, listAccounts(), signal),
  })
}

export function createAccountEmailMutation(scope: ApiScope) {
  const client = useQueryClient()
  return useMutation<
    UserAccount,
    RequestFailure,
    { id: string; email: string }
  >(() => ({
    mutationFn: (input) => runRequest(scope, updateAccount(input)),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: serverQueryKey(scope.tenantId, accountsKey) }),
  }))
}
