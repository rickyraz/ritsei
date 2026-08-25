-- owner: inventory
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: keep reserved stock equal to active reservation facts

CREATE OR REPLACE FUNCTION inventory.assert_reserved_balance_consistency()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, inventory
AS $$
DECLARE
  target_tenant_id uuid;
  target_warehouse_id uuid;
  target_item_id uuid;
  actual_reserved bigint;
  expected_reserved numeric;
BEGIN
  IF TG_TABLE_NAME = 'reservations' THEN
    target_tenant_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.tenant_id ELSE NEW.tenant_id END;
    target_warehouse_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.warehouse_id ELSE NEW.warehouse_id END;
    target_item_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.item_id ELSE NEW.item_id END;
  ELSE
    target_tenant_id := NEW.tenant_id;
    target_warehouse_id := NEW.warehouse_id;
    target_item_id := NEW.item_id;
  END IF;

  SELECT reserved
  INTO actual_reserved
  FROM inventory.stock_balances
  WHERE tenant_id = target_tenant_id
    AND warehouse_id = target_warehouse_id
    AND item_id = target_item_id
  FOR UPDATE;

  IF actual_reserved IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT coalesce(sum(quantity) FILTER (WHERE status = 'active'), 0)
  INTO expected_reserved
  FROM inventory.reservations
  WHERE tenant_id = target_tenant_id
    AND warehouse_id = target_warehouse_id
    AND item_id = target_item_id;

  IF actual_reserved::numeric <> expected_reserved THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'inventory_reservation_balance_consistency_check',
      MESSAGE = 'reserved stock must equal active reservation quantities';
  END IF;

  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER inventory_reservation_balance_consistency_trigger
AFTER INSERT OR UPDATE OR DELETE ON inventory.reservations
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION inventory.assert_reserved_balance_consistency();

CREATE CONSTRAINT TRIGGER inventory_stock_balance_reservation_consistency_trigger
AFTER INSERT OR UPDATE ON inventory.stock_balances
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION inventory.assert_reserved_balance_consistency();
