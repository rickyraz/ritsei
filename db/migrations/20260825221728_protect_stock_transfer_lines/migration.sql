-- owner: inventory
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: freeze stock-transfer lines once confirmation has created source movement obligations

CREATE OR REPLACE FUNCTION inventory.protect_stock_transfer_line()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, inventory
AS $$
DECLARE
  transfer_status text;
BEGIN
  IF TG_OP <> 'INSERT' THEN
    SELECT status::text
    INTO transfer_status
    FROM inventory.stock_transfers
    WHERE tenant_id = OLD.tenant_id
      AND id = OLD.transfer_id
    FOR UPDATE;

    IF transfer_status IN ('confirmed', 'completed') THEN
      RAISE EXCEPTION USING
        ERRCODE = '23514',
        CONSTRAINT = 'inventory_stock_transfer_lines_immutable',
        MESSAGE = 'confirmed and completed stock-transfer lines are immutable';
    END IF;
  END IF;

  IF TG_OP <> 'DELETE' THEN
    SELECT status::text
    INTO transfer_status
    FROM inventory.stock_transfers
    WHERE tenant_id = NEW.tenant_id
      AND id = NEW.transfer_id
    FOR UPDATE;

    IF transfer_status IN ('confirmed', 'completed') THEN
      RAISE EXCEPTION USING
        ERRCODE = '23514',
        CONSTRAINT = 'inventory_stock_transfer_lines_immutable',
        MESSAGE = 'confirmed and completed stock-transfer lines are immutable';
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER inventory_stock_transfer_line_immutability_trigger
BEFORE INSERT OR UPDATE OR DELETE ON inventory.stock_transfer_lines
FOR EACH ROW EXECUTE FUNCTION inventory.protect_stock_transfer_line();
