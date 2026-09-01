export {
  AuthService,
  CreateTenantInput,
  IssueSessionInput,
  Principal,
  Session,
  Tenant,
} from "./src/contract.ts"
export type {
  AuthService as AuthServiceShape,
  IssuedSession,
  Principal as PrincipalType,
  Session as SessionType,
  Tenant as TenantType,
} from "./src/contract.ts"

export {
  InvalidSessionToken,
  SessionUserAccountDisabled,
  SessionUserAccountNotFound,
  TenantAlreadyExists,
} from "./src/errors.ts"

export { makeAuthService } from "./src/service.ts"
export { AuthLive, makeAuthTestLayer } from "./src/layers.ts"
