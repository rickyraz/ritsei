-- owners: accounting
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: prevent a journal entry from reversing itself

ALTER TABLE "accounting"."journal_entries" DROP CONSTRAINT "journal_entries_reversal_state_check", ADD CONSTRAINT "journal_entries_reversal_state_check" CHECK ((("status" in ('draft', 'posted') and "reverses_entry_id" is null) or
      ("status" = 'reversed' and "reverses_entry_id" is not null)) and
      ("reverses_entry_id" is null or "reverses_entry_id" <> "id"));
