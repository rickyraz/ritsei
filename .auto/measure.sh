#!/bin/bash
set -euo pipefail
rtk deno run --allow-read tooling/domain-maturity/measure.ts
