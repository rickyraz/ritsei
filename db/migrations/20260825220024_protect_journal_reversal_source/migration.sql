-- owner: accounting
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: prevent journal reversals from referencing non-posted source journals

CREATE OR REPLACE FUNCTION accounting.enforce_journal_reversal_source()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, accounting
AS $$
DECLARE
  source_status text;
BEGIN
  IF NEW.status::text = 'reversed'
    AND NEW.reverses_entry_id IS NOT NULL
    AND NEW.reverses_entry_id <> NEW.id THEN
    SELECT status::text
    INTO source_status
    FROM accounting.journal_entries
    WHERE tenant_id = NEW.tenant_id
      AND id = NEW.reverses_entry_id
    FOR UPDATE;

    IF source_status IS DISTINCT FROM 'posted' THEN
      RAISE EXCEPTION USING
        ERRCODE = '23514',
        CONSTRAINT = 'journal_entries_reversal_source_check',
        MESSAGE = 'journal reversals require a posted source journal';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER accounting_journal_reversal_source_trigger
BEFORE INSERT OR UPDATE ON accounting.journal_entries
FOR EACH ROW EXECUTE FUNCTION accounting.enforce_journal_reversal_source();
