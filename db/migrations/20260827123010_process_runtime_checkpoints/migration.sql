-- owner: process
-- reviewed: 2026-08-27
-- generated-by: drizzle-kit 1.0.0-rc.4
CREATE TYPE "process"."process_runtime_environment" AS ENUM('DEV', 'TEST', 'PROD');--> statement-breakpoint
CREATE TYPE "process"."process_runtime_failure_kind" AS ENUM('business_failure', 'technical_retry', 'unknown_external_outcome', 'compensation_failure');--> statement-breakpoint
CREATE TYPE "process"."process_runtime_status" AS ENUM('running', 'waiting', 'completed', 'failed', 'manual_recovery');--> statement-breakpoint
CREATE TABLE "process"."runtime_checkpoints" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"tenant_id" uuid NOT NULL,
	"process_definition_id" uuid NOT NULL,
	"process_definition_version" integer NOT NULL,
	"catalog_version" integer NOT NULL,
	"environment" "process"."process_runtime_environment" NOT NULL,
	"status" "process"."process_runtime_status" NOT NULL,
	"failure_kind" "process"."process_runtime_failure_kind",
	"current_node_id" text NOT NULL,
	"revision" bigint DEFAULT 0 NOT NULL,
	"state" jsonb NOT NULL,
	"correlation_id" text NOT NULL,
	"execution_principal" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "runtime_checkpoints_tenant_id_id_key" UNIQUE("tenant_id","id"),
	CONSTRAINT "runtime_checkpoints_definition_version_check" CHECK ("process_definition_version" > 0),
	CONSTRAINT "runtime_checkpoints_catalog_version_check" CHECK ("catalog_version" > 0),
	CONSTRAINT "runtime_checkpoints_revision_check" CHECK ("revision" >= 0),
	CONSTRAINT "runtime_checkpoints_node_check" CHECK ("current_node_id" ~ '[^[:space:]]'),
	CONSTRAINT "runtime_checkpoints_correlation_check" CHECK ("correlation_id" ~ '[^[:space:]]'),
	CONSTRAINT "runtime_checkpoints_principal_check" CHECK ("execution_principal" ~ '[^[:space:]]')
);
--> statement-breakpoint
ALTER TABLE "process"."runtime_checkpoints" ADD CONSTRAINT "runtime_checkpoints_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "auth"."tenants"("id") ON DELETE CASCADE;