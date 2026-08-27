#!/bin/bash
set -euo pipefail
rtk deno run --allow-read --allow-run tooling/roadmap-completion/measure.ts
