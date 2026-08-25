#!/bin/bash
set -euo pipefail
rtk deno run --allow-read --allow-run tooling/domain-maturity/measure.ts
