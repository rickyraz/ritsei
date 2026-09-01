-- owner: party
-- reviewed: 2026-09-01
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: enforce the non-reflexive related-party projection invariant at the view boundary

CREATE OR REPLACE VIEW "party"."related_party_paths" AS
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
WHERE graph_path."active"
  AND graph_path."source_party_id" <> graph_path."target_party_id";
