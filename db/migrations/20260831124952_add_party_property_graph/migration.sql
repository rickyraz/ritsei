-- owner: party
-- reviewed: 2026-08-31
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: expose a bounded SQL/PGQ read projection over authoritative Party relationships

CREATE VIEW "party"."legal_entity_organization_edges" AS
SELECT
  "tenant_id",
  "id" AS "legal_entity_id",
  "organization_party_id"
FROM "party"."legal_entities";

CREATE PROPERTY GRAPH "party"."party_relationship_graph"
  VERTEX TABLES (
    "party"."parties" AS party
      KEY ("tenant_id", "id")
      LABEL party PROPERTIES ("tenant_id", "id", "name"),
    "party"."legal_entities" AS legal_entity
      KEY ("tenant_id", "id")
      LABEL legal_entity PROPERTIES ("tenant_id", "id", "organization_party_id")
  )
  EDGE TABLES (
    "party"."party_relationships"
      KEY ("tenant_id", "id")
      SOURCE KEY ("tenant_id", "party_id")
        REFERENCES party ("tenant_id", "id")
      DESTINATION KEY ("tenant_id", "legal_entity_id")
        REFERENCES legal_entity ("tenant_id", "id")
      LABEL relationship PROPERTIES ("id", "tenant_id", "kind", "active"),
    "party"."legal_entity_organization_edges" AS ownership
      KEY ("tenant_id", "legal_entity_id")
      SOURCE KEY ("tenant_id", "legal_entity_id")
        REFERENCES legal_entity ("tenant_id", "id")
      DESTINATION KEY ("tenant_id", "organization_party_id")
        REFERENCES party ("tenant_id", "id")
      LABEL legal_entity_owner PROPERTIES (
        "tenant_id", "legal_entity_id", "organization_party_id"
      )
  );

CREATE VIEW "party"."related_party_paths" AS
SELECT
  graph_path."tenant_id",
  graph_path."source_party_id",
  graph_path."target_party_id",
  graph_path."legal_entity_id",
  graph_path."relationship_id",
  graph_path."relationship_kind",
  2::integer AS "depth"
FROM GRAPH_TABLE (
  "party"."party_relationship_graph"
  MATCH (source IS party)-[relationship IS relationship]->(entity IS legal_entity)
    -[ownership IS legal_entity_owner]->(target IS party)
  COLUMNS (
    source."tenant_id" AS "tenant_id",
    source."id" AS "source_party_id",
    relationship."id" AS "relationship_id",
    relationship."kind" AS "relationship_kind",
    relationship."active" AS "active",
    entity."id" AS "legal_entity_id",
    target."id" AS "target_party_id"
  )
) AS graph_path
WHERE graph_path."active";
