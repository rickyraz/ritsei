-- owner: procurement
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: preserve goods-receipt facts after Inventory stock receipt publication

CREATE OR REPLACE FUNCTION procurement.protect_purchase_receipt_facts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, procurement
AS $$
BEGIN
  RAISE EXCEPTION USING
    ERRCODE = '23514',
    CONSTRAINT = 'purchase_receipt_facts_immutable',
    MESSAGE = 'purchase receipt facts are immutable';
END;
$$;

CREATE TRIGGER purchase_receipt_immutability_trigger
BEFORE UPDATE OR DELETE ON procurement.purchase_receipts
FOR EACH ROW EXECUTE FUNCTION procurement.protect_purchase_receipt_facts();

CREATE TRIGGER purchase_receipt_line_immutability_trigger
BEFORE UPDATE OR DELETE ON procurement.purchase_receipt_lines
FOR EACH ROW EXECUTE FUNCTION procurement.protect_purchase_receipt_facts();
