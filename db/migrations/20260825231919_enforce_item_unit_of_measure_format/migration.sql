-- owner: inventory
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: align persisted Item unit-of-measure values with the public contract

ALTER TABLE "inventory"."items" DROP CONSTRAINT "items_unit_of_measure_check", ADD CONSTRAINT "items_unit_of_measure_check" CHECK ("unit_of_measure" <> '' and
      "unit_of_measure" = upper(trim("unit_of_measure")) and
      "unit_of_measure" ~ '^[A-Z][A-Z0-9_-]*$');