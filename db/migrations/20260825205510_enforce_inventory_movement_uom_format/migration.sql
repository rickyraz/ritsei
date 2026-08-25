-- owners: inventory
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: enforce the public unit-of-measure format on persisted correction movements

ALTER TABLE "inventory"."movements" DROP CONSTRAINT "movements_correction_metadata_check", ADD CONSTRAINT "movements_correction_metadata_check" CHECK (("idempotency_key" is null and "unit_of_measure" is null and "reason" is null) or
      ("idempotency_key" is not null and "unit_of_measure" is not null and
        "unit_of_measure" ~ '^[A-Z][A-Z0-9_-]*$' and "reason" is not null and
        "reason" <> '' and "kind" in ('receipt', 'issue')));
