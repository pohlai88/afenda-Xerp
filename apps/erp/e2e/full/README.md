# ERP full E2E matrix (P2 — manual / nightly)

Non-smoke Playwright specs run in the **`chromium-full`** project (`grepInvert: /@smoke/`).

## Status

**Deferred (ARCH-TEST-001 P2).** Not part of PR CI. Requires separate ARCH/FDR approval before:

- Nightly scheduled runs
- Multi-browser matrix (firefox/webkit)
- `--shard` parallel CI jobs
- Visual screenshot regression

## Local full run

```bash
pnpm db:bootstrap:local && pnpm auth:bootstrap:dev
pnpm --filter @afenda/erp test:e2e --project chromium-full
```

## Trigger criteria for P2 implementation

1. Smoke suite exceeds ~30 tests **or** full suite runtime exceeds 10 minutes on CI.
2. Separate FDR approved for nightly matrix + blob merge-reports job.
3. Sharding uses existing `blob` reporter in [`playwright.config.mts`](../../playwright.config.mts).

## Manual workflow

Use [`.github/workflows/e2e-nightly.yml`](../../../../.github/workflows/e2e-nightly.yml) (`workflow_dispatch`) for on-demand full matrix validation.
