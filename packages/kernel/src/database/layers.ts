import * as Layer from "effect/Layer"
import type { Sql } from "postgres"

import { Database } from "./contract.ts"
import { makePostgresDatabase } from "./postgres.ts"

export const PostgresDatabaseLive = (client: Sql) =>
  Layer.succeed(Database, makePostgresDatabase(client))
