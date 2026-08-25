-- owner: procurement
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: bind receipt lines to the purchase order owned by their receipt header

ALTER TABLE "procurement"."purchase_receipts" ADD CONSTRAINT "purchase_receipts_tenant_id_id_order_key" UNIQUE("tenant_id","id","purchase_order_id");--> statement-breakpoint
ALTER TABLE "procurement"."purchase_receipt_lines" ADD CONSTRAINT "purchase_receipt_lines_tenant_receipt_order_fkey" FOREIGN KEY ("tenant_id","receipt_id","purchase_order_id") REFERENCES "procurement"."purchase_receipts"("tenant_id","id","purchase_order_id");