-- owner: identity
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: enforce canonical user-account email normalization at the database boundary

ALTER TABLE "identity"."user_accounts" ADD CONSTRAINT "user_accounts_email_normalization_check" CHECK ("email" = lower(btrim("email")) and "email" ~ '[^[:space:]]');