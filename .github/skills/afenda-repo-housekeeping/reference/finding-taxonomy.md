# Finding taxonomy

Every housekeeping finding gets **exactly one** class before action. Wrong classification causes incorrect deletes (especially registry vs unused file).

## Classes

| Class | Signal | Action path | Mode |
|-------|--------|-------------|------|
| `unused-export` | Knip: unused export | Unexport or Slice D delete | Delegate |
| `unused-file` | Knip: unused file | Slice D after `rg` | Delegate |
| `unused-dependency` | Knip: unused dep in package.json | Per-package `knip --fix` or manual remove | Delegate |
| `registry-drift` | Registry lists path that does not exist | Trim registry to filesystem | **align** |
| `catalog-drift` | Seed catalog missing keys tests expect | Add keys + rebuild database dist | **align** |
| `intentional-public` | Foundation stub, facade re-export, planned API | knip ignore / `@public` tag; no delete | audit only |
| `storybook-orphan` | MCP block dir with no consumer | Dry-run script → Slice D if confirmed | Delegate |
| `local-artifact-leak` | Tracked or root agent/IDE dump outside `.cursor/audit/checkpoints/` | Delete + `git rm --cached` + `check:local-artifact-leakage` | audit / implement |

## Triage decision tree

```text
Finding reported?
├── Registry or catalog lists missing file/key?
│   └── YES → registry-drift or catalog-drift → align (NOT Slice D delete)
├── Storybook MCP block under packages/shadcn-studio?
│   └── YES → storybook-orphan → dry-run script first
├── Knip unused file/export/dep?
│   ├── rg finds consumers outside Knip graph?
│   │   └── YES → fix knip.jsonc globs or mark intentional-public
│   ├── foundation-disposition says stub/planned?
│   │   └── YES → intentional-public
│   └── NO → unused-* → delegate Slice D
└── Broken import to deleted package?
    └── YES → P0 stale-ref → Slice D (high priority)
```

## Common misclassifications (from waves 1–5)

| Mistake | Correct class | Why |
|---------|---------------|-----|
| Delete kernel / architecture-authority / enterprise-knowledge / shadcn-studio barrel exports because Knip flags them | **intentional-public** | Knip workspace scope does not see cross-package importers (`apps/erp`, `apps/storybook`, contract className SSOT, etc.) |
| Delete registry entry file that never existed | `registry-drift` | Trim registry, do not hunt ghost files |
| Delete entitlements service stubs | `intentional-public` | Foundation placeholders; check registry first |
| Delete shadcn block after weak orphan scan | `storybook-orphan` | Must include MCP seed IDs + layout import paths |
| Knip flags auth email `.tsx` | Fix workspace template | Add `*.tsx` to project globs |
| Permissions test fails after catalog edit | `catalog-drift` | Rebuild `@afenda/database` dist before permissions tests |

## Finding matrix template (audit output)

```markdown
| Package | Class | Symbol / path | Recommended action |
|---------|-------|---------------|-------------------|
| @afenda/observability | registry-drift | demo-auth-action.ts | align — remove registry entry |
| @afenda/entitlements | intentional-public | *-service.ts stubs | defer — document in audit |
| @afenda/testing | unused-export | MOCK_EXECUTION_* | Slice D — unexport |
```
