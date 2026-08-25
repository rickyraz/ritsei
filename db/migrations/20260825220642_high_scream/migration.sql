-- owner: procurement
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: align persisted receipt units with Inventory's public unit-of-measure contract

ALTER TABLE "procurement"."purchase_receipt_lines" DROP CONSTRAINT "purchase_receipt_lines_unit_of_measure_check", ADD CONSTRAINT "purchase_receipt_lines_unit_of_measure_check" CHECK ("unit_of_measure" <> '' and
      "unit_of_measure" = upper(trim("unit_of_measure")) and
      "unit_of_measure" ~ '^[A-Z][A-Z0-9_-]*$');