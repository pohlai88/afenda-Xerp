# @afenda/shadcn-studio — Stabilization Plan (PAS-006)

**Status:** Package stable · ADR-0038 prefixed folders · gates green · **ERP wiring deferred**

## Completed

| Step | Scope |
|------|--------|
| 1 | Legacy trees removed — `src/components/`, `registry/`, `governance/`, `contracts/`, `_storybook/`, `stories/`, `__tests__/`; canonical `meta-*` + prefixed L2 buckets |
| 1b | `pnpm check:studio-tsconfig-paths` passes (no `src/components/`) |
| 2 | 10 zero-prop blocks prop-driven; barrel aligned (42 MCP blocks); Storybook fixtures |
| 3 | `STUDIO_BLOCK_COMPONENT_REGISTRY` — all 42 MCP seed blocks |
| 3 | Acceptance record IDs + **sealed** `AcceptanceRecordWire` payloads for all 9 governed blocks |
| 3 | `SURFACE_TEMPLATE_REGISTRY` — all 9 governed blocks (was 5) |
| 3 | `DATATABLE_BLOCK_CONTRACT_IDS` — explicit const tuple |
| Optional | `SearchDialogBlock` wired in `AppShell` header |
| Optional | `ARCHITECTURE.md` — `meta-registry/` / `meta-gates/` vocabulary; quarantine cross-link |
| Housekeeping | Knip workspace clean (files/deps); export noise policy in `knip.jsonc` |

## Physical layout (ADR-0038)

| Bucket | Path | MCP alias |
|--------|------|-----------|
| Primitives | `src/components-ui/` | `@/components/ui/*` |
| Blocks | `src/components-layouts/` | `@/components/shadcn-studio/*` |
| Auth shell | `src/components-auth-shell/` | `@/components-auth-shell/*` |
| App shell | `src/components-app-shell/` | `@/components-app-shell/*` |
| Assets | `src/components-assets/` | `@/components-assets/*` |
| Storybook lab | `src/storybook/` | `@afenda/shadcn-studio/lab` |
| L1 inventory | `src/meta-registry/` · `meta-contracts/` · `meta-gates/` | `./governance` export |

## Wire-ready blocks

Datatables, statistics cards 01–03, chart/statistics blocks with typed props.

## Primitive governance

| Artifact | Path |
|----------|------|
| Skill | `.cursor/skills/afenda-primitive-contract/SKILL.md` |
| Mismatch frame (E0) | `.cursor/skills/afenda-primitive-contract/reference/mismatch-inspection-frame.md` |
| Composition bridge | `.cursor/skills/afenda-primitive-contract/reference/composition-patterns-bridge.md` |
| React perf bridge (P1–P8) | `.cursor/skills/afenda-primitive-contract/reference/react-best-practices-bridge.md` |
| React testing bridge (T1–T2) | `.cursor/skills/afenda-primitive-contract/reference/react-testing-patterns-bridge.md` |
| Always-on rule | `.cursor/rules/ui-primitive-mismatch-frame.mdc` |

```bash
pnpm check:studio-primitive-contracts
```

## Gates

```bash
pnpm check:studio-paths
pnpm check:studio-blocks
pnpm check:studio-import-zones
pnpm check:studio-metadata-binding
pnpm check:storybook-block-coverage
pnpm storybook generate
pnpm --filter @afenda/shadcn-studio typecheck && build
pnpm check:package-css-dist-sync
pnpm check:studio-block-acpa-acceptance
pnpm housekeeping:knip:workspace packages/shadcn-studio
```

## Deferred (Step 5 — ERP)

- Module page wiring (`procurement/purchase-orders`, etc.) — only when explicitly requested

## Hard stops

- No ERP module page wiring until explicitly requested (Step 5)
- No `navConfig.tsx` in ERP
- No copying from `_reference/`
- No resurrecting `src/components/` physical tree — virtual MCP aliases only
