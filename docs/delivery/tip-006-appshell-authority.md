# TIP-006 — AppShell Authority

Status: **In progress** (authority contracts pending; `packages/appshell` implementation underway)

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
- Token migration (TIP-UI-03)
- Permission engine implementation (TIP-010)

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/appshell` (PKG-001) | AppShell authority + shell implementation |

## Depends on

- TIP-003 Design System Authority
- TIP-004 Design System Contracts

## Blocks

- TIP-UI-03 AppShell Token Migration
- TIP-012 ERP Operating Spine (MetadataContext integration)

## Deliverables (planned)

- `packages/appshell/src/contracts/appshell-authority.contract.ts`
- `packages/appshell/src/contracts/navigation.contract.ts`
- `packages/appshell/src/contracts/context.contract.ts`
- `packages/appshell/src/contracts/command-center.contract.ts`
- Contract tests under `packages/appshell/src/contracts/__tests__/`
- Alignment of existing `app-shell.types.ts` with frozen contracts

## Acceptance gate

- AppShell architecture is frozen per ADR-0001
- No nav/context/command behavior without a contract owner
- Existing shell components reference governed types only

## Acceptance criteria (draft)

```gherkin
GIVEN the AppShell authority contracts are registered
WHEN a developer adds a new nav item kind or context field
THEN the change requires a contract update and test
AND no ad-hoc string literals for nav IDs outside governed unions
```

## Rollout / rollback

- Merge contracts first; align existing shell incrementally
- Rollback: revert contract files; shell continues with prior types

## Verdict

Not started — awaiting implementation PR.
