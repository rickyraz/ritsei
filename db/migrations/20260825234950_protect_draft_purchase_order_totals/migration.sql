-- owner: procurement
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: keep draft Procurement purchase-order totals aligned with mutable lines

CREATE OR REPLACE FUNCTION procurement.assert_draft_purchase_order_total_for(
  target_tenant_id uuid,
  target_order_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, procurement
AS $$
DECLARE
  order_status text;
  stored_total numeric;
  line_count bigint;
  derived_total numeric;
BEGIN
  SELECT status::text, total
  INTO order_status, stored_total
  FROM procurement.purchase_orders
  WHERE tenant_id = target_tenant_id
    AND id = target_order_id
  FOR UPDATE;

  IF NOT FOUND OR order_status <> 'draft' THEN
    RETURN;
  END IF;

  SELECT count(*), coalesce(sum(quantity::numeric * unit_price), 0)
  INTO line_count, derived_total
  FROM procurement.purchase_order_lines
  WHERE tenant_id = target_tenant_id
    AND purchase_order_id = target_order_id;

  IF line_count > 0 AND stored_total <> derived_total THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'purchase_order_draft_total_consistent',
      MESSAGE = 'draft purchase order total must match its lines';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION procurement.assert_draft_purchase_order_total()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, procurement
AS $$
BEGIN
  IF TG_TABLE_NAME = 'purchase_orders' THEN
    PERFORM procurement.assert_draft_purchase_order_total_for(NEW.tenant_id, NEW.id);
  ELSE
    IF TG_OP <> 'INSERT' THEN
      PERFORM procurement.assert_draft_purchase_order_total_for(OLD.tenant_id, OLD.purchase_order_id);
    END IF;
    IF TG_OP <> 'DELETE' THEN
      PERFORM procurement.assert_draft_purchase_order_total_for(NEW.tenant_id, NEW.purchase_order_id);
    END IF;
  END IF;

  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER purchase_order_draft_total_trigger
AFTER INSERT OR UPDATE ON procurement.purchase_orders
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION procurement.assert_draft_purchase_order_total();

CREATE CONSTRAINT TRIGGER purchase_order_line_draft_total_trigger
AFTER INSERT OR UPDATE OR DELETE ON procurement.purchase_order_lines
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION procurement.assert_draft_purchase_order_total();
