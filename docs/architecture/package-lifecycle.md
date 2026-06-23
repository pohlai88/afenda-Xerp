# Package Lifecycle Governance

| Field | Value |
|-------|-------|
| **Status** | Baseline — Pending Sign-off |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **TIP** | TIP-001G — Package Lifecycle Governance |
| **Fingerprint** | `ARCH-BASELINE-2026-06-23-v2` |
| **ADR** | ADR-0006 (to be authored in TIP-001B) |

## Constitutional Principle

**Ownership, layers, and dependencies govern the steady state. Lifecycle governs change over time.**

| Governance | Governs |
|------------|---------|
| Steady state | What architecture *is* — owners, layers, approved dependencies |
| Change over time | How architecture *evolves* — birth, merge, split, deprecation, retirement, restore |

Most repositories govern steady state but not change. Architecture drifts anyway. This document closes that gap.

Without lifecycle governance, AI-assisted development produces:

```text
database-v2
database-next
database-modern
database-refactor
database-rewrite
```

---

## ADR Traceability

| Rule | Future ADR |
|------|------------|
| Layer model | ADR-0002 |
| Dependency governance | ADR-0003 |
| Ownership governance | ADR-0004 |
| Exception governance | ADR-0005 |
| **Package lifecycle** | **ADR-0006** |

---

## Lifecycle States

| State | Meaning |
|-------|---------|
| `planned` | Approved in registry; not yet created in filesystem |
| `experimental` | Proof-of-concept or spike in filesystem; not production-governed |
| `active` | Registered, owned, layered, and enforced |
| `deprecated` | Still present; consumers must migrate; owner remains accountable |
| `retired` | Removed from workspace; ADR and evidence required |

### State transitions

```text
planned → active | experimental
experimental → active | retired
active → deprecated | retired
deprecated → retired | active (restore — see Restore Policy)
retired → active (restore only — see Restore Policy)
```

`planned` must not be used for long-running experiments. Use `experimental` instead.

---

## Policy: Experimental Package

For proof-of-concept, prototype, spike, or exploration work without full platform status.

| Rule | Requirement |
|------|-------------|
| Not production | Must not be imported by `active` packages at runtime |
| Not depended upon | No runtime `@afenda/*` consumers outside `experimental` peers |
| Not public API | No stable `exports` contract; no external consumer guarantees |
| Must expire | `expiresAt` ISO date required (maximum 90 days without Architecture Authority extension) |
| Must have owner | Single owner in [`ownership-registry.md`](ownership-registry.md) |
| ADR | Lightweight ADR or amendment documenting scope and expiry |

### Experimental checklist

```text
[ ] Owner assigned
[ ] expiresAt set (≤ 90 days default)
[ ] package-registry.md lifecycle → experimental
[ ] No active runtime dependents
[ ] Promote to active OR retire before expiry
```

On expiry: promote to `active` (full create policy) or `retired` (retirement policy). No indefinite `experimental` state.

---

## Policy: Create Package

A new workspace package **must not** reach `active` until all of the following are defined:

| Requirement | Artifact |
|-------------|----------|
| Owner | Entry in [`ownership-registry.md`](ownership-registry.md) |
| Layer | Entry in [`layer-registry.md`](layer-registry.md) |
| Approved dependencies | Entry in [`dependency-registry.md`](dependency-registry.md) |
| Purpose | One-line description in [`package-registry.md`](package-registry.md) |
| ADR | New ADR or amendment to existing ADR documenting the decision |
| Lifecycle state | `planned` → `active` on first merge (or `experimental` → `active` on promotion) |

### Constitutional flow

```text
Decision (ADR)
    ↓
Documentation (registries)
    ↓
Registration (package-registry)
    ↓
Implementation (filesystem + package.json)
```

Never: Implementation → documentation someday.

### Create checklist

```text
[ ] ADR authored and Accepted
[ ] package-registry.md updated
[ ] ownership-registry.md updated
[ ] layer-registry.md updated
[ ] dependency-registry.md updated
[ ] packages/architecture-authority machine maps updated (TIP-001C+)
[ ] pnpm-workspace.yaml picks up path automatically (apps/* or packages/*)
[ ] quality:architecture passes
[ ] package.created audit event emitted (TIP-010+)
```

### Forbidden create patterns

- Packages outside approved layers (AI-001)
- Packages without an assigned owner (ARCH-001)
- Duplicate responsibility (`*-v2`, `*-new`, `*-temp`, `*-modern`, `*-refactor`, `*-rewrite` without retirement ADR)
- Packages created before baseline sign-off without Architecture Authority approval
- Using `planned` for experiments longer than the create gate allows — use `experimental`

---

## Policy: Merge Package

When two packages are combined:

| Requirement | Detail |
|-------------|--------|
| ADR | Documents merge rationale, target package, and timeline |
| Registry | Source package → `retired`; target package dependencies updated |
| Consumers | All importers migrated before source retirement |
| Evidence | `quality:architecture` and `pnpm ci` green after merge |
| Audit | `package.merged` event emitted |

---

## Policy: Split Package

When one package becomes two:

| Requirement | Detail |
|-------------|--------|
| ADR | Documents split boundary, ownership assignment, dependency direction |
| Registry | Both packages registered before split merge lands |
| No overlap | Split packages must not duplicate the same layer responsibility |
| Audit | `package.split` event emitted |

---

## Policy: Deprecate Package

When a package is superseded but not yet removed:

| Requirement | Detail |
|-------------|--------|
| Replacement | Named successor package or external dependency |
| Migration path | Documented steps for consumers |
| Removal date | ISO date — deprecation must have an expiry |
| Registry | Lifecycle state → `deprecated` |
| ADR | Amendment or new ADR with `Status: Deprecated` |
| Ownership | **Existing owner remains accountable until `retired`** |
| Audit | `package.deprecated` event emitted |

### Maximum deprecation lifetime

A `deprecated` package may not remain deprecated longer than **12 months** without Architecture Authority review.

If removal is not feasible within 12 months:

1. Architecture Authority review required
2. ADR amendment documenting extended timeline and rationale
3. New `removalDate` committed to registry

Otherwise `deprecated` becomes permanently deprecated — a common source of monorepo decay.

### Deprecation checklist

```text
[ ] Replacement package identified
[ ] Migration guide published
[ ] removalDate set (≤ 12 months default)
[ ] Existing owner confirmed accountable through retirement
[ ] package-registry.md lifecycle → deprecated
[ ] Exception registry entry if temporary overlap required (ADR-0005)
[ ] package.deprecated audit event emitted
```

---

## Policy: Retire (Delete) Package

When a package is removed from the monorepo:

| Requirement | Detail |
|-------------|--------|
| ADR | Accepted retirement ADR with evidence of zero consumers |
| Approval | Architecture Authority sign-off |
| Registry | Entry marked `retired` with date (retain history; do not silent-delete) |
| Evidence | `pnpm ci` green; no remaining imports |
| Snapshot | `dependency-snapshot.json` updated (TIP-001F) |
| Ownership | Owner accountability ends only when state becomes `retired` |
| Audit | `package.retired` event emitted |

### Retirement checklist

```text
[ ] Zero runtime importers verified
[ ] ADR Accepted
[ ] Architecture Authority sign-off
[ ] package-registry.md updated (state → retired)
[ ] ownership-registry.md updated
[ ] dependency-registry.md updated
[ ] architecture-authority machine maps updated
[ ] dependency-snapshot.json regenerated
[ ] pnpm ci green
[ ] package.retired audit event emitted
```

---

## Policy: Restore Package

A `retired` package may be requested again (legacy storage adapter, old renderer, revived integration). Restoration must not bypass retirement governance.

| Requirement | Detail |
|-------------|--------|
| ADR | Accepted ADR documenting why restoration is required |
| New owner confirmation | Successor owner accepts accountability |
| Layer confirmation | Layer assignment re-validated against current matrix |
| Dependency review | All runtime edges re-approved in dependency registry |
| Registry | `retired` → `active` (or `experimental` if spike) |
| Evidence | `quality:architecture` and `pnpm ci` green |
| Audit | `package.restored` event emitted |

### Restore checklist

```text
[ ] ADR Accepted
[ ] Owner assigned and confirmed
[ ] Layer and dependencies re-registered
[ ] No duplicate responsibility with successor package
[ ] package-registry.md updated
[ ] quality:architecture passes
[ ] package.restored audit event emitted
```

---

## Lifecycle Audit Events

Aligns with audit-first architecture. TIP-010 observability may emit these automatically.

| Event | Audit action | When |
|-------|--------------|------|
| Create | `package.created` | `planned` or `experimental` → `active` |
| Merge | `package.merged` | Two packages combined; source retired |
| Split | `package.split` | One package becomes two |
| Deprecate | `package.deprecated` | `active` → `deprecated` |
| Retire | `package.retired` | `deprecated` or `experimental` → `retired`; package removed |
| Restore | `package.restored` | `retired` → `active` or `experimental` |

Each event must include: `packageName`, `previousState`, `newState`, `owner`, `adr`, `timestamp`, `actor`.

---

## Current Lifecycle Inventory

| Package | State | Notes |
|---------|-------|-------|
| All 18 active workspaces | `active` | Baseline 2026-06-20 |

No `experimental`, `deprecated`, or `retired` packages at baseline.

---

## Acceptance

- [x] Steady state vs change governance principle documented
- [x] Create, merge, split, deprecate, retire, and restore policies defined
- [x] `experimental` state with expiry and constraints defined
- [x] Maximum deprecation lifetime (12 months) defined
- [x] Ownership retention during deprecation defined
- [x] Lifecycle audit events defined
- [x] Forbidden create patterns documented
- [x] ADR-0006 traceability established
- [ ] ADR-0006 Package Lifecycle Governance Accepted (TIP-001B)
- [ ] Baseline signed off by Architecture Authority
