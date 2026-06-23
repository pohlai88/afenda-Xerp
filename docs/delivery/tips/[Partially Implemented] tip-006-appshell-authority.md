# TIP-006 — AppShell Authority

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** |
| **Authority status** | Documented — contracts not frozen |
| **Runtime evidence** | `packages/appshell/` — 92+ `.tsx`, `src/styles/afenda-appshell.css`, shadcn-studio blocks, dashboard canvas, tests |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Remaining gap** | Frozen authority contracts under `packages/appshell/src/contracts/` (planned deliverables below) |

## Purpose

Freeze AppShell governance before further shell UI work. TIP-006 defines ownership for navigation, workspace context, command center, and shell layout — without building new ERP modules.

ADR-0001 authority: AppShell architecture must be frozen before business domains begin.

## Scope

**In scope**

- AppShell authority contract
- Navigation contract (nav item ownership, permission metadata)
- Context contract (tenant / company / organization workspace switching)
- Command center contract
- Delivery evidence and acceptance tests for contracts

**Out of scope**

- New ERP business modules
- Metadata UI renderers (TIP-UI-04)
- Token migration (TIP-UI-03) — tracked separately; runtime partial
- Permission engine implementation (TIP-010)

## Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| Shell CSS (token-aligned) | `packages/appshell/src/styles/afenda-appshell.css` | Yes — no `app-shell.module.css` |
| Governed UI blocks | `packages/appshell/src/shadcn-studio/blocks/` | Yes |
| Dashboard canvas | `packages/appshell/src/dashboard/` | Yes |
| Tests | `packages/appshell/src/__tests__/` | Yes |
| Authority contracts | `packages/appshell/src/contracts/` | **No** — directory absent |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/appshell` (PKG-001) | AppShell authority + shell implementation |

## Depends on

- TIP-003 Design System Authority
- TIP-004 Design System Contracts

## Blocks

- TIP-UI-03 AppShell Token Migration (closeout)
- TIP-012 ERP Operating Spine (shell context integration)

## Deliverables (remaining)

- `packages/appshell/src/contracts/appshell-authority.contract.ts`
- `packages/appshell/src/contracts/navigation.contract.ts`
- `packages/appshell/src/contracts/context.contract.ts`
- `packages/appshell/src/contracts/command-center.contract.ts`
- Contract tests under `packages/appshell/src/contracts/__tests__/`
- Alignment of existing shell types with frozen contracts

## Acceptance gate

- AppShell architecture is frozen per ADR-0001
- No nav/context/command behavior without a contract owner
- Existing shell components reference governed types only

## Acceptance criteria

```gherkin
GIVEN the AppShell authority contracts are registered
WHEN a developer adds a new nav item kind or context field
THEN the change requires a contract update and test
AND no ad-hoc string literals for nav IDs outside governed unions
```

## Verdict

**Partially Implemented** — substantial shell UI and CSS exist; authority contract freeze is the remaining TIP-006 deliverable. Do not treat as Complete until contracts land.
