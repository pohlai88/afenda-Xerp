# Package Registry

| Field | Value |
|-------|-------|
| **Status** | Baseline — Pending Sign-off |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **TIP (archive)** | TIP-001A — Architecture Baseline Discovery |
| **FDR** | [`foundation-disposition.md`](foundation-disposition.md) · [`foundation-delivery-authority.md`](foundation-delivery-authority.md) |
| **Fingerprint** | `ARCH-BASELINE-2026-06-23-v2` |
| **Active workspaces** | 22 |
| **Planned workspaces** | 0 |

This registry freezes every workspace package in the Afenda monorepo as of the baseline date. **Package disposition** (lane, gaps, gates) lives in the [Foundation Disposition Registry (FDR)](foundation-disposition.md) — not in TIP delivery docs.

```text
Unlisted packages are prohibited once Architecture Authority enforcement is active (TIP-001E).
```

That enforces **registry-first architecture**: no `temp-package`, `new-package`, or `helper-package` may exist without registration.

Lifecycle states (`planned`, `experimental`, `active`, `deprecated`, `retired`) are defined in [`package-lifecycle.md`](package-lifecycle.md).

---

## Registry Status Values (machine-readable)

TIP-001D validators consume these values exactly — no human variants.

| Status | Meaning |
|--------|---------|
| `active` | Filesystem exists; fully governed |
| `active-exempt` | Filesystem exists; exempt from selected layer-dep rules (tooling only) |
| `planned` | Approved intent; not yet in filesystem |
| `experimental` | POC/spike in filesystem; see lifecycle policy |
| `deprecated` | Present; migrating consumers |
| `retired` | Removed from filesystem; registry history retained |

---

## Active Registry (22)

Filesystem reality — `package.json` exists under `apps/*` or `packages/*`.

| ID | Package | Path | Layer | Lifecycle | Purpose | Public API owner | Exports | Status |
|----|---------|------|-------|-----------|---------|------------------|---------|--------|
| PKG-001 | `@afenda/appshell` | `packages/appshell` | ERPSpine | active | ERP application shell — navigation, layout, command center | ERP Spine Authority | Yes | `active` |
| PKG-002 | `@afenda/auth` | `packages/auth` | Platform | active | Identity and authentication authority | Platform Authority | Yes | `active` |
| PKG-003 | `@afenda/database` | `packages/database` | Platform | active | Persistence and schema authority | Platform Authority | Yes | `active` |
| PKG-004 | `@afenda/design-system` | `packages/design-system` | Design | active | Design tokens and visual governance contracts | Design Authority | Yes | `active` |
| PKG-005 | `@afenda/docs` | `apps/docs` | Application | active | Documentation delivery surface | Application Authority | No | `active` |
| PKG-006 | `@afenda/entitlements` | `packages/entitlements` | Integration | active | Entitlements, limits, and access gates | Platform Authority | Yes | `active` |
| PKG-007 | `@afenda/erp` | `apps/erp` | Application | active | Primary ERP application delivery surface | Application Authority | No | `active` |
| PKG-021 | `@afenda/storybook` | `apps/storybook` | Application | active | Design-system and ERP shell Storybook delivery surface | Application Authority | No | `active` |
| PKG-008 | `@afenda/execution` | `packages/execution` | Foundation | active | Durable execution and workflow registry | Platform Authority | Yes | `active` |
| PKG-009 | `@afenda/feature-flags` | `packages/feature-flags` | Integration | active | Deployment flags and rollout evaluation | Platform Authority | Yes | `active` |
| PKG-010 | `@afenda/kernel` | `packages/kernel` | Platform | active | Platform kernel — branded IDs, Result, and execution contracts | Platform Authority | Yes | `active` |
| PKG-011 | `@afenda/metadata` | `packages/metadata` | Metadata | active | Metadata architecture authority contracts | Metadata Authority | Yes | `active` |
| PKG-012 | `@afenda/metadata-ui` | `packages/metadata-ui` | Metadata | active | Metadata-driven rendering contracts | Metadata Authority | Yes | `active` |
| PKG-013 | `@afenda/observability` | `packages/observability` | Platform | active | Logging, tracing, and audit authority | Platform Authority | Yes | `active` |
| PKG-014 | `@afenda/permissions` | `packages/permissions` | Platform | active | Authorization and policy engine authority | Platform Authority | Yes | `active` |
| PKG-015 | `@afenda/storage` | `packages/storage` | Foundation | active | Tenant-scoped storage abstraction | Platform Authority | Yes | `active` |
| PKG-016 | `@afenda/testing` | `packages/testing` | Integration | active | Shared test utilities and mock providers | Platform Authority | Yes | `active` |
| PKG-017 | `@afenda/typescript-config` | `packages/typescript-config` | Platform (tooling) | active | Shared TypeScript compiler presets | Platform Authority | Config only | `active-exempt` |
| PKG-018 | `@afenda/ui` | `packages/ui` | Design | active | Shared UI primitives foundation | Design Authority | Yes | `active` |
| PKG-019 | `@afenda/architecture-authority` | `packages/architecture-authority` | Platform | active | Architecture maps, validators, and governance contracts | Architecture Authority | Yes | `active` |
| PKG-020 | `@afenda/ai-governance` | `packages/ai-governance` | Platform | active | AI-assisted development governance contracts and validators | Architecture Authority | Yes | `active` |
| PKG-R01 | `@afenda/accounting` | `packages/accounting` | Domain | active | Accounting domain contracts-only (ADR-0015) | Accounting Authority | Yes | `active` |

**`active-exempt`:** PKG-017 is exempt from layer-dependency enforcement only. It remains registered and owned.

---

## Planned Registry

No filesystem-planned packages. Reserved domain slots are listed under Domain Layer (reserved).

---

## Domain Layer (reserved)

One domain package is registry-active (contracts-only); four remain planned.

| ID | Package | Owner domain | Status |
|----|---------|--------------|--------|
| PKG-R01 | `@afenda/accounting` | Accounting Authority | `active` (contracts-only — ADR-0015; filesystem delivered TIP-014 Slice 2) |
| PKG-R02 | `@afenda/inventory` | Inventory Authority | `planned` |
| PKG-R03 | `@afenda/hrm` | HRM Authority | `planned` |
| PKG-R04 | `@afenda/crm` | CRM Authority | `planned` |
| PKG-R05 | `@afenda/procurement` | Procurement Authority | `planned` |

**Inter-domain dependencies are prohibited** unless approved through ADR (ADR-0005 exception or domain ADR). Examples of forbidden runtime edges without approval:

```text
accounting → hrm
hrm → crm
crm → inventory
```

See [`layer-registry.md`](layer-registry.md) Domain Layer Governance.

---

## Registry Change Log

Audit trail for registry mutations. Material changes require fingerprint bump on baseline report.

| Date | Action | Registry ID | Package / subject | ADR |
|------|--------|-------------|-------------------|-----|
| 2026-06-20 | Created | — | Baseline registry (PKG-001–018 active, PKG-R01–R05 reserved) | ADR-0001 |
| 2026-06-20 | Activated | PKG-019 | `@afenda/architecture-authority` promoted from planned to active | TIP-001C |
| 2026-06-20 | Activated | PKG-020 | `@afenda/ai-governance` registered active | ADR-0007 |
| 2026-06-20 | Activated | PKG-011 | `@afenda/metadata` registered active (metadata authority) | TIP-005 |
| 2026-06-20 | Accepted | — | ADR-0007 AI Development Governance | ADR-0007 |
| 2026-06-23 | Fingerprint bump | — | `ARCH-BASELINE-2026-06-23-v2` — TIP-000D documentation authority closeout (ADR-0009–0013) | ADR-0012 |
| 2026-06-24 | Activated (contracts-only) | PKG-R01 | `@afenda/accounting` promoted active; filesystem pending TIP-014 Slice 2 | ADR-0015 |
| 2026-06-24 | Filesystem | PKG-R01 | `packages/accounting/` scaffold + kernel dependency edge | TIP-014 Slice 2 |

---

## Acceptance

- [x] 100% active workspace packages discovered (20/20)
- [x] Planned workspaces documented separately (0 filesystem-planned)
- [x] 0 unknown packages in `apps/*` or `packages/*`
- [x] Machine-readable status values defined
- [x] Registry IDs assigned (PKG-001–020, PKG-R01–R05)
- [x] Package purpose documented (one line each)
- [x] Public API owner documented per package
- [x] Domain inter-domain dependency rule stated
- [x] Registry change log initiated
- [ ] Baseline signed off by Architecture Authority
