-- owner: process
-- reviewed: 2026-08-30
-- generated-by: drizzle-kit 1.0.0-rc.4
CREATE TYPE "process"."process_operator_action" AS ENUM('retry', 'compensate', 'manual_recovery');--> statement-breakpoint
CREATE TABLE "process"."operator_controls" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"tenant_id" uuid NOT NULL,
	"instance_id" uuid NOT NULL,
	"action" "process"."process_operator_action" NOT NULL,
	"idempotency_key" text NOT NULL,
	"actor_principal_id" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "operator_controls_tenant_id_key" UNIQUE("tenant_id","idempotency_key"),
	CONSTRAINT "operator_controls_idempotency_key_check" CHECK ("idempotency_key" ~ '[^[:space:]]'),
	CONSTRAINT "operator_controls_actor_check" CHECK ("actor_principal_id" ~ '[^[:space:]]'),
	CONSTRAINT "operator_controls_reason_check" CHECK ("reason" ~ '[^[:space:]]')
);
--> statement-breakpoint
ALTER TABLE "process"."operator_controls" ADD CONSTRAINT "operator_controls_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "auth"."tenants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "process"."operator_controls" ADD CONSTRAINT "operator_controls_checkpoint_fkey" FOREIGN KEY ("tenant_id","instance_id") REFERENCES "process"."runtime_checkpoints"("tenant_id","id") ON DELETE CASCADE;