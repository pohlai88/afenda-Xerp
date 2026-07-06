# shadcn-studio-v2 quarantine

Landing zone for raw shadcn/studio MCP or CLI output **before** promotion to
`components/ui/`. Quarantine is **not** public API.

Authority: [LANE-A-07](../../../docs/slices/LANE-A-07-QUARANTINE-PROMOTION-GOVERNANCE.md) ·
[PRIMITIVE-API-CONSISTENCY.md](../../../docs/PRIMITIVE-API-CONSISTENCY.md)

## Rules

- Do **not** export quarantine files from `index.ts`, `clients.ts`, `server.ts`, or `metadata.ts`.
- Do **not** import quarantine paths from ERP apps, developer routes, or other packages.
- Delete abandoned quarantine files before slice handoff — or record an explicit deferral in
  `inventory.baseline.json`.
- Promoted files must use **kebab-case** stems (`pnpm normalize:kebab-stems --check`).

## Promotion checklist

Complete every step before moving a file from quarantine to `components/ui/`:

1. **Install** — MCP/CLI output lands in `components/quarantine/` only.
2. **Normalize** — adapt imports to package conventions (`../../lib/cn`, `./button`, no `@/` aliases).
3. **Assign contract tier**
   - **Governed** — add/extend primitive contract tests (`test:primitives`) per A-04–A-06.
   - **Parity-only** — document exception in PR + `PRIMITIVE-API-CONSISTENCY.md` (discouraged).
4. **Kebab stem** — file name is `kebab-case.tsx`; run `pnpm normalize:kebab-stems --check`.
5. **Move** — relocate to `components/ui/{kebab}.tsx` (delete quarantine copy).
6. **Export** — wire `index.ts` / `clients.ts` per [runtime boundary](../../../docs/slices/PHASE-4-RUNTIME-BOUNDARY.md).
7. **Update inventory** — remove path from `inventory.baseline.json` (or keep deferral note until deleted).
8. **Gates**

```bash
pnpm --filter @afenda/shadcn-studio-v2 test:primitives   # when governed tier
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/developer verify:v2-proof          # when consumer-visible
```

## Inventory baseline

Machine-readable inventory: [`inventory.baseline.json`](./inventory.baseline.json).

- Drift guard requires **exact match** between baseline entries and quarantine implementation files.
- Empty baseline (`files: []`) is the current approved state — no raw installs pending promotion.
- When adding a quarantine file, append a baseline entry with `decision`: `pending` | `defer` | `promote`.

## Rollback

Move the file back to quarantine, remove public exports, revert contract tests/docs, and sync
`inventory.baseline.json`.
