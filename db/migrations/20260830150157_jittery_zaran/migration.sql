-- owner: accounting
-- reviewed: 2026-08-30
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: append-only provider-neutral financial staging evidence with read-time integrity verification

CREATE TABLE "accounting"."financial_staging_evidence" (
	"record_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"legal_entity_id" uuid NOT NULL,
	"gate_id" text NOT NULL,
	"cohort_id" text NOT NULL,
	"deployment_revision" text NOT NULL,
	"schema_version" smallint NOT NULL,
	"canonicalization_version" smallint NOT NULL,
	"evidence_hash" text NOT NULL,
	"evidence" jsonb NOT NULL,
	"operator_principal_id" text NOT NULL,
	"provider_identity_ref" text NOT NULL,
	"result" text NOT NULL,
	"mismatch_count" integer NOT NULL,
	"orphan_count" integer NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "financial_staging_evidence_pkey" PRIMARY KEY("tenant_id","record_id"),
	CONSTRAINT "financial_staging_evidence_gate_check" CHECK ("gate_id" ~ '[^[:space:]]'),
	CONSTRAINT "financial_staging_evidence_cohort_check" CHECK ("cohort_id" ~ '[^[:space:]]'),
	CONSTRAINT "financial_staging_evidence_deployment_check" CHECK ("deployment_revision" ~ '[^[:space:]]'),
	CONSTRAINT "financial_staging_evidence_schema_version_check" CHECK ("schema_version" > 0),
	CONSTRAINT "financial_staging_evidence_canonicalization_version_check" CHECK ("canonicalization_version" > 0),
	CONSTRAINT "financial_staging_evidence_hash_check" CHECK ("evidence_hash" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "financial_staging_evidence_operator_check" CHECK ("operator_principal_id" ~ '[^[:space:]]'),
	CONSTRAINT "financial_staging_evidence_provider_check" CHECK ("provider_identity_ref" ~ '[^[:space:]]'),
	CONSTRAINT "financial_staging_evidence_result_check" CHECK ("result" in ('pass', 'fail')),
	CONSTRAINT "financial_staging_evidence_count_check" CHECK ("mismatch_count" >= 0 and "orphan_count" >= 0 and ("result" <> 'pass' or ("mismatch_count" = 0 and "orphan_count" = 0))),
	CONSTRAINT "financial_staging_evidence_time_check" CHECK ("completed_at" >= "started_at")
);
--> statement-breakpoint
CREATE INDEX "financial_staging_evidence_gate_index" ON "accounting"."financial_staging_evidence" ("tenant_id","gate_id","created_at");--> statement-breakpoint
CREATE INDEX "financial_staging_evidence_cohort_index" ON "accounting"."financial_staging_evidence" ("tenant_id","cohort_id","created_at");--> statement-breakpoint
CREATE INDEX "financial_staging_evidence_deployment_index" ON "accounting"."financial_staging_evidence" ("tenant_id","deployment_revision","created_at");--> statement-breakpoint
ALTER TABLE "accounting"."financial_staging_evidence" ADD CONSTRAINT "financial_staging_evidence_tenant_fkey" FOREIGN KEY ("tenant_id") REFERENCES "auth"."tenants"("id");--> statement-breakpoint
ALTER TABLE "accounting"."financial_staging_evidence" ADD CONSTRAINT "financial_staging_evidence_legal_entity_fkey" FOREIGN KEY ("tenant_id","legal_entity_id") REFERENCES "party"."legal_entities"("tenant_id","id");--> statement-breakpoint
CREATE OR REPLACE FUNCTION "accounting"."reject_financial_staging_evidence_mutation"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'financial staging evidence is append-only'
    USING ERRCODE = '55000';
END;
$$;--> statement-breakpoint
CREATE TRIGGER "financial_staging_evidence_append_only"
BEFORE UPDATE OR DELETE OR TRUNCATE ON "accounting"."financial_staging_evidence"
FOR EACH STATEMENT EXECUTE FUNCTION "accounting"."reject_financial_staging_evidence_mutation"();