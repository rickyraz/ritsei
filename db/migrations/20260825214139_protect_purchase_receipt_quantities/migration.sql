-- owner: procurement
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: prevent goods receipts from exceeding ordered quantities at the database boundary

CREATE OR REPLACE FUNCTION procurement.assert_purchase_receipt_quantity(
  target_tenant_id uuid,
  target_order_line_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, procurement
AS $$
DECLARE
  ordered_quantity numeric;
  received_quantity numeric;
BEGIN
  SELECT quantity::numeric
  INTO ordered_quantity
  FROM procurement.purchase_order_lines
  WHERE tenant_id = target_tenant_id
    AND id = target_order_line_id
  FOR UPDATE;

  IF ordered_quantity IS NULL THEN
    RETURN;
  END IF;

  SELECT coalesce(sum(quantity::numeric), 0)
  INTO received_quantity
  FROM procurement.purchase_receipt_lines
  WHERE tenant_id = target_tenant_id
    AND purchase_order_line_id = target_order_line_id;

  IF received_quantity > ordered_quantity THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'purchase_receipt_lines_ordered_quantity_check',
      MESSAGE = 'received quantity cannot exceed ordered quantity';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION procurement.assert_purchase_receipt_quantities()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, procurement
AS $$
BEGIN
  IF TG_OP <> 'INSERT' THEN
    PERFORM procurement.assert_purchase_receipt_quantity(
      OLD.tenant_id,
      OLD.purchase_order_line_id
    );
  END IF;

  IF TG_OP <> 'DELETE' THEN
    PERFORM procurement.assert_purchase_receipt_quantity(
      NEW.tenant_id,
      NEW.purchase_order_line_id
    );
  END IF;

  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER purchase_receipt_line_quantity_trigger
AFTER INSERT OR UPDATE OR DELETE ON procurement.purchase_receipt_lines
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION procurement.assert_purchase_receipt_quantities();

CREATE CONSTRAINT TRIGGER purchase_order_line_receipt_quantity_trigger
AFTER UPDATE OR DELETE ON procurement.purchase_order_lines
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION procurement.assert_purchase_receipt_quantities();
