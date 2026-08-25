-- owner: inventory
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: keep on-hand stock aligned with receipt and issue movement history

CREATE OR REPLACE FUNCTION inventory.assert_on_hand_consistency()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, inventory
AS $$
DECLARE
  target_tenant_id uuid;
  target_warehouse_id uuid;
  target_item_id uuid;
  actual_on_hand bigint;
  expected_on_hand numeric;
BEGIN
  target_tenant_id := NEW.tenant_id;
  target_warehouse_id := NEW.warehouse_id;
  target_item_id := NEW.item_id;

  SELECT on_hand
  INTO actual_on_hand
  FROM inventory.stock_balances
  WHERE tenant_id = target_tenant_id
    AND warehouse_id = target_warehouse_id
    AND item_id = target_item_id
  FOR UPDATE;

  IF actual_on_hand IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT coalesce(sum(quantity) FILTER (WHERE kind IN ('receipt', 'issue')), 0)
  INTO expected_on_hand
  FROM inventory.movements
  WHERE tenant_id = target_tenant_id
    AND warehouse_id = target_warehouse_id
    AND item_id = target_item_id;

  IF actual_on_hand::numeric <> expected_on_hand THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'inventory_on_hand_movement_consistency_check',
      MESSAGE = 'on-hand stock must equal receipt and issue movement totals';
  END IF;

  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER inventory_movement_on_hand_consistency_trigger
AFTER INSERT ON inventory.movements
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION inventory.assert_on_hand_consistency();

CREATE CONSTRAINT TRIGGER inventory_stock_balance_on_hand_consistency_trigger
AFTER INSERT OR UPDATE ON inventory.stock_balances
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION inventory.assert_on_hand_consistency();
