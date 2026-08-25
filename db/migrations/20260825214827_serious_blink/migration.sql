-- owner: party
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: enforce canonical external identifier normalization at the database boundary

ALTER TABLE "party"."party_identifiers" ADD CONSTRAINT "party_identifiers_provider_check" CHECK ("provider" <> '' and "provider" = upper(trim("provider")));--> statement-breakpoint
ALTER TABLE "party"."party_identifiers" ADD CONSTRAINT "party_identifiers_scheme_check" CHECK ("scheme" <> '' and "scheme" = upper(trim("scheme")));--> statement-breakpoint
ALTER TABLE "party"."party_identifiers" ADD CONSTRAINT "party_identifiers_scope_check" CHECK ("scope" <> '' and "scope" = trim("scope"));--> statement-breakpoint
ALTER TABLE "party"."party_identifiers" ADD CONSTRAINT "party_identifiers_value_check" CHECK ("value" <> '' and "value" = trim("value"));