-- owner: integration
-- reviewed: 2026-08-30
-- generated-by: drizzle-kit 1.0.0-rc.4

CREATE TYPE "integration"."external_connector_status" AS ENUM('draft', 'reviewed', 'active', 'retired');--> statement-breakpoint
CREATE TYPE "integration"."external_governance_action" AS ENUM('registered', 'reviewed', 'activated', 'retired', 'delivery_control');--> statement-breakpoint
CREATE TABLE "integration"."connector_governance" (
	"id" uuid DEFAULT uuidv7(),
	"tenant_id" uuid,
	"connector_id" text NOT NULL,
	"version" integer NOT NULL,
	"status" "integration"."external_connector_status" NOT NULL,
	"owner" text NOT NULL,
	"minimum_version" integer NOT NULL,
	"maximum_version" integer NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"retired_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "external_connector_governance_pkey" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "external_connector_governance_identity" UNIQUE("tenant_id","connector_id","version"),
	CONSTRAINT "external_connector_governance_connector_id_check" CHECK ("connector_id" ~ '[^[:space:]]'),
	CONSTRAINT "external_connector_governance_owner_check" CHECK ("owner" ~ '[^[:space:]]'),
	CONSTRAINT "external_connector_governance_version_check" CHECK ("version" > 0),
	CONSTRAINT "external_connector_governance_minimum_version_check" CHECK ("minimum_version" > 0),
	CONSTRAINT "external_connector_governance_maximum_version_check" CHECK ("maximum_version" > 0),
	CONSTRAINT "external_connector_governance_compatibility_check" CHECK ("minimum_version" <= "maximum_version")
);
--> statement-breakpoint
CREATE TABLE "integration"."governance_audit" (
	"id" uuid DEFAULT uuidv7(),
	"tenant_id" uuid,
	"connector_id" text NOT NULL,
	"connector_version" integer NOT NULL,
	"action" "integration"."external_governance_action" NOT NULL,
	"actor" text NOT NULL,
	"operation_id" text,
	"idempotency_key" text NOT NULL,
	"reason" text NOT NULL,
	"retention_until" timestamp with time zone NOT NULL,
	"details" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "external_governance_audit_pkey" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "external_governance_audit_idempotency_key" UNIQUE("tenant_id","idempotency_key"),
	CONSTRAINT "external_governance_audit_connector_id_check" CHECK ("connector_id" ~ '[^[:space:]]'),
	CONSTRAINT "external_governance_audit_actor_check" CHECK ("actor" ~ '[^[:space:]]'),
	CONSTRAINT "external_governance_audit_idempotency_key_check" CHECK ("idempotency_key" ~ '[^[:space:]]'),
	CONSTRAINT "external_governance_audit_reason_check" CHECK ("reason" ~ '[^[:space:]]'),
	CONSTRAINT "external_governance_audit_version_check" CHECK ("connector_version" > 0)
);
--> statement-breakpoint
ALTER TABLE "integration"."connector_governance" ADD CONSTRAINT "external_connector_governance_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "auth"."tenants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "integration"."governance_audit" ADD CONSTRAINT "external_governance_audit_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "auth"."tenants"("id") ON DELETE CASCADE;