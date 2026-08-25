-- owner: inventory
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: require completed stock transfers to publish destination receipt movements

CREATE OR REPLACE FUNCTION inventory.assert_completed_transfer_receipts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, inventory
AS $$
DECLARE
  line record;
  expected_line_count bigint;
  receipt_count bigint;
  matching_receipts bigint;
BEGIN
  IF NEW.status::text <> 'completed' THEN
    RETURN NULL;
  END IF;

  SELECT count(*)
  INTO expected_line_count
  FROM inventory.stock_transfer_lines
  WHERE tenant_id = NEW.tenant_id
    AND transfer_id = NEW.id;

  SELECT count(*)
  INTO receipt_count
  FROM inventory.movements
  WHERE tenant_id = NEW.tenant_id
    AND reference_id = NEW.id
    AND kind = 'receipt';

  IF receipt_count <> expected_line_count THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'inventory_completed_transfer_receipts_check',
      MESSAGE = 'completed stock transfers require one receipt movement per line';
  END IF;

  FOR line IN
    SELECT item_id, quantity
    FROM inventory.stock_transfer_lines
    WHERE tenant_id = NEW.tenant_id
      AND transfer_id = NEW.id
  LOOP
    SELECT count(*)
    INTO matching_receipts
    FROM inventory.movements
    WHERE tenant_id = NEW.tenant_id
      AND reference_id = NEW.id
      AND warehouse_id = NEW.destination_warehouse_id
      AND item_id = line.item_id
      AND kind = 'receipt'
      AND quantity = line.quantity;

    IF matching_receipts <> 1 THEN
      RAISE EXCEPTION USING
        ERRCODE = '23514',
        CONSTRAINT = 'inventory_completed_transfer_receipts_check',
        MESSAGE = 'completed stock transfer receipt movement does not match its line';
    END IF;
  END LOOP;

  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER inventory_completed_transfer_receipts_trigger
AFTER UPDATE OF status ON inventory.stock_transfers
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION inventory.assert_completed_transfer_receipts();
