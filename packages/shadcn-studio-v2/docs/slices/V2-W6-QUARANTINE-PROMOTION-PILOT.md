# V2-W6 — MCP quarantine promotion pilot

## Status

**Deferred** — no concrete MCP block selected for promotion (Wave V2 open question #3).

## Evidence

- Quarantine governance gates pass with empty baseline (`pnpm --filter @afenda/shadcn-studio-v2 test -- quarantine-governance`)
- Promotion checklist documented in [`src/components/quarantine/README.md`](../../src/components/quarantine/README.md)
- Machine baseline: [`inventory.baseline.json`](../../src/components/quarantine/inventory.baseline.json) (`files: []`)

## Next action

When ERP or Storybook requires a block not covered by existing L4 views or L1 primitives:

1. MCP/CLI install → `components/quarantine/` only
2. Append `inventory.baseline.json` entry with `decision: pending`
3. Complete Lane A-07 promotion checklist
4. Run `test:primitives`, `check:drift`, `quality`

## Wave sign-off note

W6 deferral does not block Wave V2 consumer-readiness slices W1–W5.
