-- owners: sales
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: bind sales orders to the customer owning their quotation

ALTER TABLE "sales"."quotations" ADD CONSTRAINT "quotations_tenant_id_id_customer_id_key" UNIQUE("tenant_id","id","customer_id");--> statement-breakpoint
ALTER TABLE "sales"."orders" ADD CONSTRAINT "orders_tenant_quotation_customer_fkey" FOREIGN KEY ("tenant_id","quotation_id","customer_id") REFERENCES "sales"."quotations"("tenant_id","id","customer_id");
