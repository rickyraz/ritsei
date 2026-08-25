-- owners: identity
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: keep user-account status and disabled-at metadata coherent

ALTER TABLE "identity"."user_accounts" ADD CONSTRAINT "user_accounts_status_disabled_at_check" CHECK (("status" = 'active' and "disabled_at" is null) or
        ("status" = 'disabled' and "disabled_at" is not null));
