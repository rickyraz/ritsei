-- owner: inventory
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: preserve append-only Inventory movement history

CREATE OR REPLACE FUNCTION inventory.protect_movement_history()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, inventory
AS $$
BEGIN
  RAISE EXCEPTION USING
    ERRCODE = '23514',
    CONSTRAINT = 'inventory_movements_immutable',
    MESSAGE = 'inventory movements are append-only';
END;
$$;

CREATE TRIGGER inventory_movement_immutability_trigger
BEFORE UPDATE OR DELETE ON inventory.movements
FOR EACH ROW EXECUTE FUNCTION inventory.protect_movement_history();
