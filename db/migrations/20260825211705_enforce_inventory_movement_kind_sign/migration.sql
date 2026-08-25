-- owners: inventory
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4
-- rationale: keep persisted inventory movement quantities consistent with movement kind

ALTER TABLE "inventory"."movements" ADD CONSTRAINT "movements_kind_quantity_sign_check" CHECK (("kind" in ('receipt', 'reservation') and "quantity" > 0) or
      ("kind" in ('issue', 'release') and "quantity" < 0));
