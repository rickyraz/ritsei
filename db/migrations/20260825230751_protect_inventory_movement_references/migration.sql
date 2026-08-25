-- owner: inventory
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: bind reservation lifecycle movements to their reservation facts

CREATE OR REPLACE FUNCTION inventory.assert_movement_reservation_reference()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, inventory
AS $$
DECLARE
  reservation_quantity bigint;
  reservation_warehouse_id uuid;
  reservation_item_id uuid;
  reservation_status text;
BEGIN
  IF NEW.kind::text IN ('reservation', 'release') THEN
    IF NEW.reference_id IS NULL THEN
      RAISE EXCEPTION USING
        ERRCODE = '23514',
        CONSTRAINT = 'inventory_movement_reservation_reference_check',
        MESSAGE = 'reservation movements require a reservation reference';
    END IF;

    SELECT quantity, warehouse_id, item_id, status::text
    INTO reservation_quantity, reservation_warehouse_id, reservation_item_id, reservation_status
    FROM inventory.reservations
    WHERE tenant_id = NEW.tenant_id
      AND id = NEW.reference_id
    FOR SHARE;

    IF NOT FOUND
      OR reservation_warehouse_id IS DISTINCT FROM NEW.warehouse_id
      OR reservation_item_id IS DISTINCT FROM NEW.item_id
      OR (NEW.kind::text = 'reservation'
        AND (reservation_status <> 'active' OR NEW.quantity <> reservation_quantity))
      OR (NEW.kind::text = 'release'
        AND (reservation_status <> 'released' OR NEW.quantity <> -reservation_quantity)) THEN
      RAISE EXCEPTION USING
        ERRCODE = '23514',
        CONSTRAINT = 'inventory_movement_reservation_reference_check',
        MESSAGE = 'reservation movement does not match its reservation';
    END IF;
  ELSIF NEW.kind::text = 'issue' AND NEW.reference_id IS NOT NULL THEN
    SELECT quantity, warehouse_id, item_id, status::text
    INTO reservation_quantity, reservation_warehouse_id, reservation_item_id, reservation_status
    FROM inventory.reservations
    WHERE tenant_id = NEW.tenant_id
      AND id = NEW.reference_id
    FOR SHARE;

    IF FOUND AND (
      reservation_warehouse_id IS DISTINCT FROM NEW.warehouse_id
      OR reservation_item_id IS DISTINCT FROM NEW.item_id
      OR reservation_status <> 'fulfilled'
      OR NEW.quantity <> -reservation_quantity
    ) THEN
      RAISE EXCEPTION USING
        ERRCODE = '23514',
        CONSTRAINT = 'inventory_movement_reservation_reference_check',
        MESSAGE = 'reservation issue movement does not match its fulfilled reservation';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER inventory_movement_reservation_reference_trigger
BEFORE INSERT ON inventory.movements
FOR EACH ROW EXECUTE FUNCTION inventory.assert_movement_reservation_reference();
