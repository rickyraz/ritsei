# Fallow tooling

This directory keeps Fallow-specific repository artifacts together without mixing their roles:

- `baselines/` contains generated dead-code, health, and duplication baselines;
- `rules/` contains reviewed static-analysis policy packs.

The Fallow configuration remains at the repository root in `.fallowrc.json` so Fallow can discover
it automatically.
