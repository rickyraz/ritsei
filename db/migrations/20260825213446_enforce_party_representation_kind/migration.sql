-- owners: party
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: enforce the nonblank party-representation kind invariant at persistence

ALTER TABLE "party"."party_representations" ADD CONSTRAINT "party_representations_kind_check" CHECK ("kind" ~ '[^[:space:]]');
