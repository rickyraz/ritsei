-- owner: procurement
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: bind every purchase receipt to a tenant-owned inventory warehouse

ALTER TABLE "procurement"."purchase_receipts" ADD CONSTRAINT "purchase_receipts_tenant_warehouse_fkey" FOREIGN KEY ("tenant_id","warehouse_id") REFERENCES "inventory"."warehouses"("tenant_id","id");