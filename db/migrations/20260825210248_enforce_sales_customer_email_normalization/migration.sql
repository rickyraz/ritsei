-- owners: sales
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: enforce the public customer email normalization invariant at the database boundary

ALTER TABLE "sales"."customers" ADD CONSTRAINT "customers_email_normalization_check" CHECK ("email" = lower(btrim("email")) and "email" ~ '[^[:space:]]');
