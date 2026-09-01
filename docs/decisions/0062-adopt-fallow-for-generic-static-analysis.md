# ADR-0062: Adopt Fallow for Generic Static Analysis

- Status: Accepted
- Date: 2026-08-30
- Amends: Architecture enforcement tooling only
- Compatible with: ADR-0015, ADR-0046, ADR-0048, ADR-0050, ADR-0061
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Architecture enforcement: [`../architecture/architecture-enforcement.md`](../architecture/architecture-enforcement.md)
> - Agent rules: [`../../AGENTS.md`](../../AGENTS.md)
> - Fallow configuration: [`../../.fallowrc.json`](../../.fallowrc.json)
> - Fallow static policy pack: [`../../tooling/fallow/rules/ritsei-static-policy.json`](../../tooling/fallow/rules/ritsei-static-policy.json)

## Context

RITSEI is developed as a Deno-first TypeScript monorepo with frequent coding-agent changes. The
repository needs repository-wide evidence for dead code, circular dependencies, duplicate logic,
complexity, and generic import boundaries. Maintaining separate custom implementations for those
checks duplicates a general static-analysis engine and makes agent cleanup less consistent.

RITSEI also has rules that are not generic graph analysis: PostgreSQL schema ownership, migration
headers, financial-ledger authority, authorization, Effect-specific contracts, public package
entrypoints, and workload-isolation claims. Those rules require RITSEI-owned semantics and must not
be delegated to a third-party analyzer.

## Decision

Adopt Fallow `3.20.0` as the repository's generic static-analysis engine. Keep the dependency exact
in the root `package.json`, resolve it through `deno install`, and expose it through Deno tasks.

Fallow owns:

- dead files, exports, types, dependencies, and circular dependencies;
- generic architecture zones and boundary coverage;
- duplication and complexity/health analysis; and
- the generic Effect-version, test-runner, and frontend dependency policies in the committed rule
  pack.

`fallow audit` is the changed-set gate in CI and autoresearch checks. It uses Fallow's `all` gate
against the committed per-analysis baselines: this avoids requiring the base revision to already
contain the newly introduced config and rule pack, while still failing on findings absent from the
baseline in changed files. Baselines are a temporary debt ledger and must not be regenerated on every
run or used to hide new findings. Full and focused Fallow commands remain available for agent-led
cleanup.

RITSEI retains:

- `check-ownership.ts` for schema, migration, and database ownership;
- `public-contract/check.ts` for the cross-package `mod.ts` entrypoint requirement;
- `call-graph/check.ts` for conservative public callable-surface validation;
- the remaining `ast-grep` private-re-export rule; and
- all domain, financial, authorization, Effect HTTP, migration, and workload-isolation checks.

Automatic fixes are advisory only. Agents must preview with `fallow fix --dry-run`, trace findings,
and review any change before applying it. No automatic cleanup is permitted as a substitute for
owner review in invariant-sensitive code.

## Alternatives Considered

### Keep all custom generic tooling

Rejected. It preserves overlapping implementations for cycles, boundaries, and static hygiene while
providing no duplication or health analysis for agent-generated code.

### Replace every architecture checker with Fallow

Rejected. Fallow cannot establish RITSEI's semantic ownership, financial authority, database
privilege, migration, or workload-isolation guarantees. Public package entrypoint and call-graph
checks also require repository-specific proof.

### Run only a full-repository Fallow gate

Rejected for adoption. Existing findings are useful cleanup work but should not prevent the first
integration from landing. The changed-set audit gate catches regressions while the baselines and
full-repository tasks support deliberate cleanup.

## Consequences

### Positive

- One deterministic tool covers generic graph analysis, duplication, health, and changed-set audit.
- Coding agents receive a repeatable cleanup workflow with structured JSON output and dry-run fixes.
- Generic boundaries are visible in `.fallowrc.json`, while RITSEI-specific authorities remain clear.
- CI and autoresearch use the same local, version-pinned scanner.

### Negative

- The repository carries temporary baseline files and an additional native dev dependency.
- Fallow's configuration must be maintained alongside the existing RITSEI-specific checks.
- Its generic boundaries do not replace the stronger public-entrypoint and schema-ownership rules.

### Risks

- A baseline can become permanent debt if cleanup work is not scheduled. Review baseline reduction as
  part of maintenance and never rewrite it automatically in CI.
- Fallow findings are evidence, not permission to delete domain or financial code. Incorrect
  suppressions or broad boundary allowances can hide drift.
- The exact native binary is platform-specific; the pinned npm package and lockfile are the supply
  chain boundary, and normal binary verification must remain enabled.

## Validation

The adoption is validated by:

```sh
deno task fallow
deno task fallow:boundaries
deno task fallow:audit
deno task boundary:lint
deno task check:affected
```

CI must fetch repository history before `fallow audit`, and autoresearch must invoke the same audit
through `.auto/checks.sh`. Baselines are regenerated only during an intentional cleanup review.

## Related Documents

- Fallow documentation: <https://fallow.tools/docs/>
- Fallow adoption workflow: <https://fallow.tools/docs/adoption/>
- Fallow architecture boundaries: <https://fallow.tools/docs/configuration/boundaries/>
- Fallow CI integration: <https://fallow.tools/docs/integrations/ci/>
- Fallow agent integration: <https://fallow.tools/docs/integrations/mcp/>
