-- owners: process, accounting
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: add scoped monotonic lease generations and owner-side financial-operation fencing

CREATE TABLE "process"."job_fence_scopes" (
	"tenant_id" uuid,
	"fence_scope" text,
	"generation" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "job_fence_scopes_pkey" PRIMARY KEY("tenant_id","fence_scope"),
	CONSTRAINT "job_fence_scopes_scope_check" CHECK ("fence_scope" ~ '[^[:space:]]'),
	CONSTRAINT "job_fence_scopes_generation_check" CHECK ("generation" >= 0)
);
--> statement-breakpoint
ALTER TABLE "accounting"."financial_operations" ADD COLUMN "accepted_fence_generation" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "process"."jobs" ADD COLUMN "fence_scope" text DEFAULT 'job:' || uuidv7() NOT NULL;--> statement-breakpoint
ALTER TABLE "process"."jobs" ADD COLUMN "lease_generation" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "process"."job_fence_scopes" ADD CONSTRAINT "job_fence_scopes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "auth"."tenants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "accounting"."financial_operations" ADD CONSTRAINT "financial_operations_accepted_fence_generation_check" CHECK ("accepted_fence_generation" >= 0);--> statement-breakpoint
ALTER TABLE "process"."jobs" ADD CONSTRAINT "process_jobs_fence_scope_check" CHECK ("fence_scope" ~ '[^[:space:]]');--> statement-breakpoint
ALTER TABLE "process"."jobs" ADD CONSTRAINT "process_jobs_lease_generation_check" CHECK ("lease_generation" >= 0);