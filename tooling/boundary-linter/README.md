# Boundary linter

Fallow owns generic repository-wide graph checks: import zones, circular dependencies, dead code,
duplication, and complexity. Its policy pack also carries the generic Effect-version, test-runner,
and frontend dependency rules in `../../rule-packs/ritsei-static-policy.json`.

RITSEI-specific checks remain in this directory and the adjacent tooling:

- the remaining `ast-grep` rule protects public package entries from re-exporting private details;
- `check-ownership.ts` validates `db/ownership.toml`, migration headers, and schema ownership;
- `../public-contract/check.ts` requires cross-package imports to use `mod.ts`;
- `../call-graph/check.ts` validates the conservative public callable surface.

Install the CLI once:

```sh
cargo install ast-grep --locked
```

Run:

```sh
deno task boundary:test
deno task boundary:lint
```

The call-graph checker is deliberately conservative. It records direct calls to local functions and
callable names imported from another package's public `mod.ts`. It does not pretend to resolve
Effect dependency injection, callbacks, reflection, or other runtime-indirect calls.
