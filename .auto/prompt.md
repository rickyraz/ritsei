# Autoresearch: complete the registered roadmap in dependency order

## Objective
Implement the smallest real, repository-native slices needed to advance the registered RITSEI roadmap. Treat docs/roadmap/README.md, each registered subroadmap, accepted ADRs, architecture documents, executable registry requirements, and tests as the source of truth. Close gates only with real implementation and executable/operational evidence; never edit evidence to claim work that was not performed. Respect dependency order and stop at explicit decision or production-approval holds.

## Metrics
- **Primary**: remaining_roadmap_exit_gates (unitless, lower is better) — the number of unmet dependencies of roadmap.global-exit reported by deno task roadmap:measure.
- **Secondary**: registered_gates_remaining, roadmap_exit_gates_completed, level3_capabilities, financial_activation_gates_remaining, process_studio_mechanical_gates_remaining, integration_surface_gates_remaining, postgres19_capability_gates_remaining, workload_gates_remaining, frontend_gates_remaining, production_gates_remaining.

## How to Run
`./.auto/measure.sh` — outputs the live roadmap evaluator output and structured METRIC lines.

## Files in Scope
- `tooling/roadmap-completion/` — executable gate registry, measurement, and report parsing.
- `docs/roadmap/` — sequencing and gate evidence only; update when accepted decisions add actionable roadmap work.
- `docs/decisions/` and `docs/architecture/` — read-only source of truth unless a new ADR or correction is explicitly required.
- `foundation/`, `modules/`, `platform/`, `runtime/`, `apps/web/`, `tests/`, `db/`, `tooling/`, and `deploy/` — the smallest implementation, tests, migrations, and evidence required by an unblocked gate.
- `.auto/` — experiment prompt, measurement, checks, and ideas.

## Off Limits
- Do not weaken or bypass registry checks, tests, typing, authorization, constraints, transactions, audit, or failure translation.
- Do not claim PostgreSQL 19 production GA, TigerBeetle activation, provider activation, deployment-profile approval, or other manual/operational approval without actual owner-approved evidence.
- Do not activate proposed ADRs, optional providers, PgQue, pg_durable, WorkloadCells, shuffle sharding, vgpu, TypeGPU, or Boneyard production paths merely to reduce the metric.
- Do not add speculative domains, generic evaluators, policy engines, registries, generators, or dependencies.
- Do not touch vendored sources or rewrite accepted ADR history.

## Constraints
- Work strictly in dependency order; fix measurement correctness before trusting gate counts.
- Follow AGENTS.md, accepted ADRs, architecture ownership, and repository-native skills.
- All TypeScript tests use `@effect/vitest`; use Effect-native test execution rules.
- Use existing commands and `deno task check:affected`; full validation is required before handoff.
- Every meaningful change needs a focused regression check. Keep commits small and use the repository Conventional Commit standard.
- Never overfit or cheat: the measurement command must run unchanged against the real source tree and open gates must remain open when evidence is unavailable.

## What's Been Tried
- Baseline setup is in progress on branch `autoresearch/roadmap-gates-2026-09-11`.
- Static inspection found the registry currently references missing workload and production artifacts despite the roadmap prose describing them as future work.
- A baseline run must first verify the reported `2/58` result and isolate the targeted-test JSON report parsing before implementing downstream gates.
- A read-only ADR review found possible roadmap additions for provider-neutral identity/AuthZ evidence, frontend ADRs 0072/0075/0076/0077/0078/0080, Procurement receipt proof, PgQue/P3 details, Communication Platform future work, and source/derived non-interference. Add only the smallest accepted-decision roadmap coverage, and do not register future work without an owner and executable evidence.
