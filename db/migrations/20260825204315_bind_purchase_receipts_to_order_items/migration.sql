-- owners: procurement
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: bind receipt lines to the item on their purchase-order line

ALTER TABLE "procurement"."purchase_receipt_lines" RENAME CONSTRAINT "purchase_receipt_lines_tenant_order_line_fkey" TO "purchase_receipt_lines_tenant_order_line_item_fkey";--> statement-breakpoint
ALTER TABLE "procurement"."purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_tenant_order_id_item_id_key" UNIQUE("tenant_id","purchase_order_id","id","item_id");--> statement-breakpoint
ALTER TABLE "procurement"."purchase_receipt_lines" DROP CONSTRAINT "purchase_receipt_lines_tenant_order_line_item_fkey", ADD CONSTRAINT "purchase_receipt_lines_tenant_order_line_item_fkey" FOREIGN KEY ("tenant_id","purchase_order_id","purchase_order_line_id","item_id") REFERENCES "procurement"."purchase_order_lines"("tenant_id","purchase_order_id","id","item_id");
