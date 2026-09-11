#!/usr/bin/env bash
set -euo pipefail

deno task check >/tmp/ritsei-autoresearch-check.log 2>&1 || {
  tail -80 /tmp/ritsei-autoresearch-check.log
  exit 1
}
