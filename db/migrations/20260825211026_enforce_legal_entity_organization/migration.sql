-- owner: party
-- reviewed: 2026-08-25
-- generated-by: drizzle-kit 1.0.0-rc.4 --custom
-- rationale: enforce that legal entities reference organization parties

CREATE OR REPLACE FUNCTION party.enforce_legal_entity_organization()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, party
AS $$
DECLARE
  referenced_kind party.party_kind;
BEGIN
  SELECT kind
  INTO referenced_kind
  FROM party.parties
  WHERE tenant_id = NEW.tenant_id
    AND id = NEW.organization_party_id;

  IF referenced_kind IS DISTINCT FROM 'organization'::party.party_kind THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'legal_entities_organization_party_kind_check',
      MESSAGE = 'legal entities require organization parties';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION party.prevent_legal_entity_party_kind_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, party
AS $$
BEGIN
  IF OLD.kind = 'organization'::party.party_kind
    AND NEW.kind <> 'organization'::party.party_kind
    AND EXISTS (
      SELECT 1
      FROM party.legal_entities
      WHERE tenant_id = OLD.tenant_id
        AND organization_party_id = OLD.id
    ) THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'legal_entities_organization_party_kind_check',
      MESSAGE = 'legal entities require organization parties';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER legal_entities_organization_party_kind_trigger
BEFORE INSERT OR UPDATE OF tenant_id, organization_party_id ON party.legal_entities
FOR EACH ROW EXECUTE FUNCTION party.enforce_legal_entity_organization();

CREATE TRIGGER parties_legal_entity_kind_trigger
BEFORE UPDATE OF kind ON party.parties
FOR EACH ROW EXECUTE FUNCTION party.prevent_legal_entity_party_kind_change();
