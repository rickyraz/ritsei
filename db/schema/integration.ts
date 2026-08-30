import { sql } from "drizzle-orm"
import {
  check,
  foreignKey,
  integer,
  jsonb,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"

import { tenants } from "./auth.ts"
import { createdAt, updatedAt, uuidv7 } from "./common.ts"

export const integrationSchema = pgSchema("integration")
export const externalReliabilityKind = integrationSchema.enum(
  "external_reliability_kind",
  ["action", "event"],
)
export const externalProviderStatus = integrationSchema.enum(
  "external_provider_status",
  ["pending", "accepted", "rejected", "unknown"],
)
export const externalDeliveryState = integrationSchema.enum(
  "external_delivery_state",
  ["accepted", "retry", "dead_letter"],
)

export const externalReliabilityRecords = integrationSchema.table("reliability_records", {
  id: uuidv7("id").default(sql`uuidv7()`).notNull(),
  tenantId: uuid("tenant_id").notNull(),
  replayKey: text("replay_key").notNull(),
  kind: externalReliabilityKind("kind").notNull(),
  connectorId: text("connector_id").notNull(),
  operationId: text("operation_id").notNull(),
  providerStatus: externalProviderStatus("provider_status").notNull(),
  state: externalDeliveryState("state").notNull(),
  attempts: integer("attempts").notNull(),
  maxAttempts: integer("max_attempts").notNull(),
  payload: jsonb("payload").notNull(),
  payloadBytes: integer("payload_bytes").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull(),
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
  correlationId: text("correlation_id").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  primaryKey({
    name: "external_reliability_records_pkey",
    columns: [table.tenantId, table.id],
  }),
  unique("external_reliability_records_replay_key").on(table.tenantId, table.replayKey),
  foreignKey({
    columns: [table.tenantId],
    foreignColumns: [tenants.id],
    name: "external_reliability_records_tenant_id_fkey",
  }).onDelete("cascade"),
  check("external_reliability_records_replay_key_check", sql`${table.replayKey} ~ '[^[:space:]]'`),
  check(
    "external_reliability_records_connector_id_check",
    sql`${table.connectorId} ~ '[^[:space:]]'`,
  ),
  check(
    "external_reliability_records_operation_id_check",
    sql`${table.operationId} ~ '[^[:space:]]'`,
  ),
  check("external_reliability_records_attempts_check", sql`${table.attempts} >= 0`),
  check("external_reliability_records_max_attempts_check", sql`${table.maxAttempts} > 0`),
  check("external_reliability_records_payload_bytes_check", sql`${table.payloadBytes} >= 0`),
  check(
    "external_reliability_records_correlation_id_check",
    sql`${table.correlationId} ~ '[^[:space:]]'`,
  ),
])
