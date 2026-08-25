-- owners: accounting
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: reject blank approval and activation metadata in financial cutover controls

ALTER TABLE "accounting"."financial_cutover_controls" DROP CONSTRAINT "financial_cutover_controls_approval_check", ADD CONSTRAINT "financial_cutover_controls_approval_check" CHECK (("status" not in ('approved', 'activating', 'tigerbeetle') or
        ("opening_balance_verified" and "historical_boundary_verified" and
         "reconciliation_healthy" and "backup_recovery_verified" and
         "unresolved_accepted_operations" = 0 and
         "cutover_watermark" is not null and "cutover_watermark" ~ '[^[:space:]]' and
         "verification_hash" is not null and "verification_hash" ~ '[^[:space:]]' and
         "evidence_artifact_id" is not null and
         "approved_by" is not null and "approved_by" ~ '[^[:space:]]' and
         "approved_at" is not null)));--> statement-breakpoint
ALTER TABLE "accounting"."financial_cutover_controls" DROP CONSTRAINT "financial_cutover_controls_activation_check", ADD CONSTRAINT "financial_cutover_controls_activation_check" CHECK (("status" <> 'tigerbeetle' or
        ("activated_by" is not null and "activated_by" ~ '[^[:space:]]' and
         "activated_at" is not null)));
