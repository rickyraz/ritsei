-- owner: inventory
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: keep reservation facts aligned with the stock balance they reserve

CREATE OR REPLACE FUNCTION inventory.protect_reservation_identity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, inventory
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'inventory_reservation_identity_immutable',
      MESSAGE = 'reservation facts are immutable';
  END IF;

  IF OLD.id IS DISTINCT FROM NEW.id
    OR OLD.tenant_id IS DISTINCT FROM NEW.tenant_id
    OR OLD.warehouse_id IS DISTINCT FROM NEW.warehouse_id
    OR OLD.item_id IS DISTINCT FROM NEW.item_id
    OR OLD.quantity IS DISTINCT FROM NEW.quantity
    OR OLD.idempotency_key IS DISTINCT FROM NEW.idempotency_key
    OR OLD.created_at IS DISTINCT FROM NEW.created_at THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'inventory_reservation_identity_immutable',
      MESSAGE = 'reservation facts are immutable';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER inventory_reservation_identity_immutable_trigger
BEFORE UPDATE OR DELETE ON inventory.reservations
FOR EACH ROW EXECUTE FUNCTION inventory.protect_reservation_identity();
