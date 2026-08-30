-- owner: integration
-- reviewed: 2026-08-30
-- generated-by: drizzle-kit 1.0.0-rc.4

CREATE SCHEMA "integration";
--> statement-breakpoint
CREATE TYPE "integration"."external_delivery_state" AS ENUM('accepted', 'retry', 'dead_letter');--> statement-breakpoint
CREATE TYPE "integration"."external_provider_status" AS ENUM('pending', 'accepted', 'rejected', 'unknown');--> statement-breakpoint
CREATE TYPE "integration"."external_reliability_kind" AS ENUM('action', 'event');--> statement-breakpoint
CREATE TABLE "integration"."reliability_records" (
	"id" uuid DEFAULT uuidv7(),
	"tenant_id" uuid,
	"replay_key" text NOT NULL,
	"kind" "integration"."external_reliability_kind" NOT NULL,
	"connector_id" text NOT NULL,
	"operation_id" text NOT NULL,
	"provider_status" "integration"."external_provider_status" NOT NULL,
	"state" "integration"."external_delivery_state" NOT NULL,
	"attempts" integer NOT NULL,
	"max_attempts" integer NOT NULL,
	"payload" jsonb NOT NULL,
	"payload_bytes" integer NOT NULL,
	"sent_at" timestamp with time zone NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"correlation_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "external_reliability_records_pkey" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "external_reliability_records_replay_key" UNIQUE("tenant_id","replay_key"),
	CONSTRAINT "external_reliability_records_replay_key_check" CHECK ("replay_key" ~ '[^[:space:]]'),
	CONSTRAINT "external_reliability_records_connector_id_check" CHECK ("connector_id" ~ '[^[:space:]]'),
	CONSTRAINT "external_reliability_records_operation_id_check" CHECK ("operation_id" ~ '[^[:space:]]'),
	CONSTRAINT "external_reliability_records_attempts_check" CHECK ("attempts" >= 0),
	CONSTRAINT "external_reliability_records_max_attempts_check" CHECK ("max_attempts" > 0),
	CONSTRAINT "external_reliability_records_payload_bytes_check" CHECK ("payload_bytes" >= 0),
	CONSTRAINT "external_reliability_records_correlation_id_check" CHECK ("correlation_id" ~ '[^[:space:]]')
);
--> statement-breakpoint
ALTER TABLE "integration"."reliability_records" ADD CONSTRAINT "external_reliability_records_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "auth"."tenants"("id") ON DELETE CASCADE;