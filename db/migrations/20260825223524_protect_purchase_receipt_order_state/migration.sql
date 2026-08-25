-- owner: procurement
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: keep purchase receipts attached only to confirmed purchase orders

CREATE OR REPLACE FUNCTION procurement.assert_purchase_receipt_order_confirmed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, procurement
AS $$
DECLARE
  order_status text;
BEGIN
  SELECT status::text
  INTO order_status
  FROM procurement.purchase_orders
  WHERE tenant_id = NEW.tenant_id
    AND id = NEW.purchase_order_id
  FOR UPDATE;

  IF order_status IS NOT NULL AND order_status <> 'confirmed' THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'purchase_receipt_order_state_check',
      MESSAGE = 'purchase receipts require confirmed purchase orders';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER purchase_receipt_order_state_trigger
BEFORE INSERT OR UPDATE OF tenant_id, purchase_order_id ON procurement.purchase_receipts
FOR EACH ROW EXECUTE FUNCTION procurement.assert_purchase_receipt_order_confirmed();

CREATE OR REPLACE FUNCTION procurement.protect_purchase_order_receipts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, procurement
AS $$
BEGIN
  IF NEW.status::text = 'cancelled'
    AND OLD.status::text IS DISTINCT FROM NEW.status::text
    AND EXISTS (
      SELECT 1
      FROM procurement.purchase_receipts
      WHERE tenant_id = OLD.tenant_id
        AND purchase_order_id = OLD.id
    ) THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'purchase_order_receipt_state_check',
      MESSAGE = 'purchase orders with receipts cannot be cancelled';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER purchase_order_receipt_state_trigger
BEFORE UPDATE OF status ON procurement.purchase_orders
FOR EACH ROW EXECUTE FUNCTION procurement.protect_purchase_order_receipts();
