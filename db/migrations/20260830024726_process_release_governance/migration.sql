-- owner: process
-- reviewed: 2026-08-30
-- generated-by: drizzle-kit 1.0.0-rc.4
CREATE TYPE "process"."process_release_audit_event" AS ENUM('approval', 'release', 'deployment');--> statement-breakpoint
CREATE TABLE "process"."deployments" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"tenant_id" uuid NOT NULL,
	"release_id" uuid NOT NULL,
	"environment" "process"."process_runtime_environment" NOT NULL,
	"deployed_by" text NOT NULL,
	"promotion_reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "process_deployments_tenant_release_environment_key" UNIQUE("tenant_id","release_id","environment"),
	CONSTRAINT "process_deployments_deployed_by_check" CHECK ("deployed_by" ~ '[^[:space:]]'),
	CONSTRAINT "process_deployments_reason_check" CHECK ("promotion_reason" ~ '[^[:space:]]')
);
--> statement-breakpoint
CREATE TABLE "process"."release_audits" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"tenant_id" uuid NOT NULL,
	"release_id" uuid NOT NULL,
	"event" "process"."process_release_audit_event" NOT NULL,
	"actor_principal_id" text NOT NULL,
	"environment" "process"."process_runtime_environment",
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "process_release_audits_actor_check" CHECK ("actor_principal_id" ~ '[^[:space:]]'),
	CONSTRAINT "process_release_audits_reason_check" CHECK ("reason" ~ '[^[:space:]]')
);
--> statement-breakpoint
CREATE TABLE "process"."releases" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"tenant_id" uuid NOT NULL,
	"definition_id" uuid NOT NULL,
	"definition_version" integer NOT NULL,
	"catalog_version" integer NOT NULL,
	"checksum" text NOT NULL,
	"references" jsonb NOT NULL,
	"approved_by" text NOT NULL,
	"approval_reason" text NOT NULL,
	"released_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "process_releases_tenant_id_id_key" UNIQUE("tenant_id","id"),
	CONSTRAINT "process_releases_tenant_definition_key" UNIQUE("tenant_id","definition_id","definition_version"),
	CONSTRAINT "process_releases_definition_version_check" CHECK ("definition_version" > 0),
	CONSTRAINT "process_releases_catalog_version_check" CHECK ("catalog_version" > 0),
	CONSTRAINT "process_releases_checksum_check" CHECK ("checksum" ~ '[^[:space:]]'),
	CONSTRAINT "process_releases_approved_by_check" CHECK ("approved_by" ~ '[^[:space:]]'),
	CONSTRAINT "process_releases_approval_reason_check" CHECK ("approval_reason" ~ '[^[:space:]]'),
	CONSTRAINT "process_releases_released_by_check" CHECK ("released_by" ~ '[^[:space:]]')
);
--> statement-breakpoint
ALTER TABLE "process"."deployments" ADD CONSTRAINT "process_deployments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "auth"."tenants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "process"."deployments" ADD CONSTRAINT "process_deployments_release_fkey" FOREIGN KEY ("tenant_id","release_id") REFERENCES "process"."releases"("tenant_id","id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "process"."release_audits" ADD CONSTRAINT "process_release_audits_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "auth"."tenants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "process"."release_audits" ADD CONSTRAINT "process_release_audits_release_fkey" FOREIGN KEY ("tenant_id","release_id") REFERENCES "process"."releases"("tenant_id","id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "process"."releases" ADD CONSTRAINT "process_releases_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "auth"."tenants"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE OR REPLACE FUNCTION "process"."reject_release_mutation"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'process release artifacts are immutable' USING ERRCODE = '55000';
END;
$$;--> statement-breakpoint
CREATE TRIGGER "process_releases_immutable" BEFORE UPDATE OR DELETE ON "process"."releases"
FOR EACH ROW EXECUTE FUNCTION "process"."reject_release_mutation"();--> statement-breakpoint
CREATE TRIGGER "process_deployments_immutable" BEFORE UPDATE OR DELETE ON "process"."deployments"
FOR EACH ROW EXECUTE FUNCTION "process"."reject_release_mutation"();--> statement-breakpoint
CREATE TRIGGER "process_release_audits_immutable" BEFORE UPDATE OR DELETE ON "process"."release_audits"
FOR EACH ROW EXECUTE FUNCTION "process"."reject_release_mutation"();