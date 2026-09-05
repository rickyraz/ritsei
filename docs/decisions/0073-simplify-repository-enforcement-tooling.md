# ADR-0073: Simplify Repository Enforcement Tooling

- Status: Accepted
- Date: 2026-09-05
- Supersedes: ADR-0062 (custom-checker selection only)

> **Related documents**
>
> - Architecture enforcement: [`../architecture/architecture-enforcement.md`](../architecture/architecture-enforcement.md)
> - Fallow configuration: [`../../.fallowrc.json`](../../.fallowrc.json)
> - ast-grep configuration: [`../../sgconfig.yml`](../../sgconfig.yml)
>
## Context

The repository had several overlapping source scanners for dependency direction, public package
imports, AI boundaries, call graphs, capabilities, Effect composition, and UUID usage. Several used
regular expressions or source markers where the TypeScript compiler, Fallow, ast-grep, or executable
owner tests already provided stronger evidence.

The result was a large `tooling/` surface with duplicated import parsing and weak positive claims.
A smaller enforcement surface is easier to review, faster to understand, and less likely to drift.

## Decision

Keep the enforcement stack to four owners:

1. **Fallow** owns generic graph, dependency direction, cycles, dead code, duplication, health, and
   generic policy rules.
2. **ast-grep** owns syntax-level prohibitions and rule tests, including private re-exports and
   accidental `crypto.randomUUID()` use.
3. `tooling/architecture.ts` owns only path-sensitive public-package, frontend, and AI/provider
   boundaries. It parses TypeScript imports once and uses the TypeScript AST for direct mutation
   detection.
4. `tooling/schema-ownership.ts` owns the database ownership registry, migration headers, and
   schema-import ownership rules.

Remove the custom static call graph, capability source scanner, Effect marker scanner, UUID text
scanner, and separate public-contract, dependency-direction, and AI-boundary entrypoints. Capability
catalog behavior remains covered by the authorization contract tests; Effect behavior remains covered
by type checking and owner-domain/API tests. Roadmap and financial readiness tooling remains because
it evaluates explicit operational evidence rather than generic source shape.

Merge the financial readiness evaluator and its CLI into `tooling/financial-gate.ts`. Keep roadmap
measurement separate because it owns a different evidence model.

## Consequences

- `deno task boundary:lint` has one generic analyzer, one syntax analyzer, and two focused RITSEI
  checks instead of a chain of overlapping scanners.
- Cross-package public-entry and frontend/AI boundary failures remain fail-closed.
- Direct call-graph resolution is intentionally no longer claimed; Effect dependency injection and
  runtime behavior belong to executable tests and explicit traces.
- Adding a new static rule requires first deciding whether it belongs to Fallow, ast-grep, the
  architecture boundary checker, or an owner test.

## Validation

```sh
deno task boundary:test
deno task architecture:check
deno task boundary:lint
deno task test tests/architecture/architecture-boundaries.test.ts tests/architecture/repository-tooling.test.ts
```
