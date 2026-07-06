# Lane B-06 — ERP App Shell And Navigation Cutover

## Document status

- Status: **Complete**
- Completed: 2026-07-06
- Audience: ERP engineers
- Authority: PAS-001A IS-002/IS-003, Lane B index
- Action enabled: B-07 system-admin surface wave (shell chrome stable on v2)

## Overview

Replaced v1 app shell and navigation imports in `apps/erp` with v2 `AppShell01` and
v2 operating-context / nav wire types, while keeping kernel context assembly in ERP.

## Problem

ERP used v2 providers but v1 shell/nav types (`AppShellOperatingContextWire` from v1,
`resolve-shell-nav.server.ts` importing v1).

## Goals

- Migrate ERP root layout / shell wrapper to v2 clients.
- Update `to-shell-operating-context-wire.ts` to use v2 wire types if exported.
- Preserve PAS-001A boundary: kernel → ERP → presentation only.

## Non-goals

- Datatable blocks (B-07, B-08).
- Metadata workspace board (B-08, B-09).

## Constraints

- No `@afenda/kernel` import in v2 package.
- Shell must support protected route groups unchanged.

## Proposed design

### Touchpoints (changed)

| Area | Path |
| --- | --- |
| Shell | `apps/erp/src/components/presentation/app-protected-shell.client.tsx` |
| Nav resolve | `apps/erp/src/lib/navigation/resolve-shell-nav.server.ts` |
| Context wire | `apps/erp/src/lib/context/to-shell-operating-context-wire.ts` |
| Nav ids | `apps/erp/src/lib/presentation/app-shell-nav-wire.ts` |

### Proof

- `app-protected-shell.client.test.tsx`
- `lane-b-erp-shell-cutover.test.ts`
- ERP build PASS

## Interfaces / dependencies

- Upstream: B-03 (CSS)
- Downstream: B-07, B-08

## Risks and mitigations

- Risk: wire type mismatch between v1 and v2.
  - Mitigation: v2 wire types + required `id` fields on nav groups/items.

## Rollout and rollback

1. Swapped shell imports to v2 `AppShell01`.
2. ERP typecheck/build recorded below.
3. B-01 baseline lowered by 4 shell/nav v1 imports.

Rollback: revert layout + nav imports.

## Required gates

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
pnpm --filter @afenda/shadcn-studio-v2 test
```

## Done definition

- [x] ERP protected layout on v2 shell
- [x] No v1 shell/nav imports in ERP layout lib
- [x] ERP build PASS
- [x] Migration map updated

## commands Run

| command | Result |
| --- | --- |
| `pnpm --filter @afenda/erp typecheck` | PASS |
| `pnpm --filter @afenda/erp build` | PASS |
| `pnpm --filter @afenda/erp test:run -- app-protected-shell` | PASS |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS |

## Decision

**`PROCEED`** — B-07 authorized for system-admin table migration.
