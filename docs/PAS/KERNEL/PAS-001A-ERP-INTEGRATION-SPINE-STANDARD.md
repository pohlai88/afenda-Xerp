# PAS-001A — ERP Integration Spine Standard

> **Composed governance layer** — proves production ERP **consumes** kernel vocabulary through one resolver spine. Renamed from legacy "Kernel ERP Production Integration" to **ERP Integration Spine** per [Kernel Blueprint](../../BLUEPRINT/kernel-blueprint.md). Legacy archive: [archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md](archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md).

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-001A |
| **Document title** | ERP Integration Spine Standard |
| **Document class** | `derived_runtime_integration_standard` |
| **Document role** | `erp_integration_spine` · `production_candidate_rollout` |
| **Blueprint box** | **ERP Integration Spine** |
| **Parent PAS** | [PAS-001](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) (vocabulary closed) |
| **Primary runtime owner** | `apps/erp/src/lib/context/` |
| **Layer** | Application integration (runtime integration consumer of Platform kernel — **not substrate**) |
| **Package role** | Runtime integration proof — operating-context vocabulary wired end-to-end |
| **Runtime stance** | `integration-proven` (IS-001/IS-002) — IS-003 pending R1c gate; no new kernel contracts unless PAS-001 amendment |
| **Registry lane** | `PKG010_KERNEL` (integration consumer) · `PKG-007 operating-context` |
| **Agent skills** | `kernel-authority` · `multi-tenancy-erp` · `/afenda-coding-session` |
| **Maturity** | Production Candidate (`production_candidate`) — **historical B71–B75 attestation**; **skeleton R1a–R1b/R1d re-attestation** post [ADR-0027](../../adr/ADR-0027-frontend-presentation-reset.md) |
| **Authority status** | `production_candidate` (doctrine + gates) · `integration-proven` (IS-002 skeleton) · `runtime_partial` (IS-003 — R1c gate pending) |
| **Implementation status** | `historical_delivered` B71–B75 · `skeleton_consumer` B111 · `delivered` R1a–R1b · `attested` R1d (9/10 §6) · `proposed` R1c gate |
| **Evidence level** | `runtime` — §6 matrix green at B75 **on pre-reset ERP**; **9/10 rows green on ADR-0027 skeleton** (see §6.1 · [R1d attestation](./SLICE/pas-001a-r1d-production-candidate-reclose.md)) |
| **Runtime status** | IS-001 live; IS-002 full `CONTEXT_INTEGRATION_WIRING` + protected shell (R1a/R1b gates green); IS-003 metadata consumer code present — **`check:erp-metadata-pas006-consumer` not registered** (R1c) |
| **Remaining slices** | none for R1 family — R1c gate registration is follow-up; see [R1d](./SLICE/pas-001a-r1d-production-candidate-reclose.md) §6 residual |
| **Integration consumers** | `apps/erp`, `@afenda/permissions` (live) · `@afenda/appshell`, `@afenda/metadata-ui`, `@afenda/ui-composition` (**retired** ADR-0027 — do not reference as live consumers) |
| **Upstream** | [Kernel Blueprint](../../BLUEPRINT/kernel-blueprint.md) §5.1 · Kernel NS §4 runtime integration proof |
| **Legacy archive** | [archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md](archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md) |
| **ADR prerequisites** | ADR-0011 · ADR-0014 · ADR-0021–0023 (read-only branding paths) |
| **Last reviewed** | 2026-06-29 |

#### Required gates (baseline)

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/kernel typecheck` |
| 2 | `pnpm --filter @afenda/kernel test:run` |
| 3 | `pnpm quality:kernel-context-surface` |
| 4 | `pnpm check:kernel-context-wire-triad` |
| 5 | `pnpm --filter @afenda/permissions typecheck` |
| 6 | `pnpm --filter @afenda/permissions test:run` |
| 7 | `pnpm --filter @afenda/erp typecheck` |
| 8 | `pnpm --filter @afenda/erp test:run` |
| 9 | `pnpm check:erp-context-surface` *(archived — `scripts/governance/_retired/legacy-frontend/`; not in root `package.json` post ADR-0027)* |
| 10 | `pnpm quality:boundaries` |
| 11 | `pnpm check:foundation-disposition` |

#### Required gates (PAS-001A — slice closure)

| # | Gate command | Slice | Skeleton ERP (ADR-0027) |
| --- | --- | --- | --- |
| 12 | `pnpm check:permission-scope-permissions-surface` | B71 | **Active** |
| 13 | `pnpm check:erp-operating-context-spine` | B72 | **Active** (slim — `TENANT_LIFECYCLE_BRIDGE_WIRING` only) |
| 14 | `pnpm check:documentation-drift` | B73 | **Active** |
| 15 | `pnpm check:metadata-context-authorization-bridge` | B74 | **Archived** (legacy metadata-ui; gate retired) |
| 16 | `pnpm check:erp-tenant-lifecycle-extension-consumer-attestation` | B111 | **Active** (skeleton consumer) |

> **Maturity is part of authority.** PAS-001 Enterprise Accepted is closed — do not reopen kernel vocabulary under PAS-001A. Vocabulary closure ≠ runtime integration closure.

> **Canonical location (composed):** `docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md`

---

# 0. Agent Quick Path

Read [PAS-001 §0](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md#0-agent-quick-path) (kernel boundary — closed), then this §0.

**Kernel is not the ERP runtime. Kernel is the accepted vocabulary consumed by ERP runtime.**

**Scope lock — six deliverables only:**

1. Permission-scope ownership split proof
2. ERP operating-context spine gate
3. Metadata/API/action integration proof
4. Documentation + runtime-matrix sync
5. Governance gates for integration consumer paths
6. Production Candidate attestation (§6 acceptance matrix)

**Hard stops:**

- No new resolver/database/auth logic in `packages/kernel/src/**`
- No `@afenda/kernel` importing `@afenda/permissions`
- No parallel `PermissionScopeContext`, `TenantContext`, or grant vocabulary in ERP
- No kernel parsing untrusted permission-scope wire ingress
- B71 before B72–B74 — permission ownership must land first
- No Production Candidate claim before B75

**Execution:** one slice B71 → B75 · Integration surfaces **IS-001–IS-003** · Invariants **§4.5** · Skills: `kernel-authority` + `multi-tenancy-erp`

---

# 1. Derivation and Scope

## 1.1 Why PAS-001A exists

PAS-001 closes when **kernel vocabulary is enterprise-gated**. Production ERP still requires proof that:

1. Resolved grant scope flows **permissions → ERP → kernel-branded `OperatingContext`**
2. Every protected surface uses the **same resolver spine**
3. Documentation and runtime matrix reflect **actual paths**
4. Governance gates enforce the spine **without manual review**

## 1.2 In scope / out of scope

| In scope | Out of scope |
| --- | --- |
| Permission wire triad in `@afenda/permissions` (IS-001) | Ledger/posting runtime |
| Kernel branding projection only | New kernel vocabulary |
| ERP resolver spine + integration registry (IS-002) | CSS / presentation (PAS-005) |
| Metadata authorization bridge (IS-003) | Knowledge atoms (PAS-004) |
| Doc + matrix sync | PAS-001 hidden amendment |

Full tables: legacy [PAS-001A §1](archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md#1-derivation-and-scope).

## 1.3 Integration surfaces (stable IDs)

Permanent identifiers for ADRs, tests, review comments, and slice handoffs — independent of section numbers.

| ID | Integration surface | Runtime owner | Primary gate | Slice |
| --- | --- | --- | --- | --- |
| **IS-001** | Permission Wire Triad | `@afenda/permissions` | `check:permission-scope-permissions-surface` | B71 |
| **IS-002** | Operating Context Assembly | `apps/erp` | `check:erp-operating-context-spine` | B72 |
| **IS-003** | Metadata Authorization Bridge | `apps/erp` metadata runtime (PAS-006) — *was* `@afenda/metadata-ui` | `check:metadata-context-authorization-bridge` *(archived)* · B111 tenant-extension gate *(active)* | B74 · B111 |

Cross-cutting deliverables (doc/matrix sync, attestation) map to B73 and B75 — not separate integration surfaces.

**Future:** A platform-scoped **Platform Integration Standard** may generalize IS-* IDs across ERP, CRM, HRM, and Inventory runtimes. PAS-001A is the **ERP implementation** of that pattern.

## 1.4 ADR-0027 skeleton re-attestation (2026-06-29)

[ADR-0027](../../adr/ADR-0027-frontend-presentation-reset.md) removed the pre-reset ERP application tree. **PAS-001A doctrine and B71–B75 historical attestation remain valid.** PAS-001A-R1a/R1b restored IS-002 on the PAS-006 skeleton; R1d archived **9/10** §6 gate evidence ([R1d attestation](./SLICE/pas-001a-r1d-production-candidate-reclose.md#r1d-attestation-appendix-archived-gate-bundle-2026-06-29)).

| Layer | Pre-reset (B75) | Current skeleton (post R1a–R1b/R1d) |
| --- | --- | --- |
| IS-001 Permission wire triad | Live in `@afenda/permissions` | **Live** — `check:permission-scope-permissions-surface` |
| IS-002 Operating context assembly | Full `CONTEXT_INTEGRATION_WIRING` + resolver spine | **Live** — R1a spine + R1b protected shell; `check:erp-operating-context-spine` · `check:erp-auth-actor-protected-path-attestation` |
| IS-003 Metadata authorization bridge | `@afenda/metadata-ui` + B74 gate | **Partial** — ERP-local PAS-006 metadata runtime; **`check:erp-metadata-pas006-consumer` not registered** (R1c gate pending) |
| Presentation consumers | AppShell · metadata-ui | **Retired** — PAS-006 `@afenda/shadcn-studio` presentation rebuild |

**Agent rule:** Do not claim §6 **10/10** until row 9 gate evidence exists. **Source truth:** committed `apps/erp/src/**` + archived gate bundle in [R1d](./SLICE/pas-001a-r1d-production-candidate-reclose.md).

---

# 2. Integration Architecture

## 2.1 Integration spine (target architecture — full IS-002)

> **Runtime snapshot (ADR-0027 skeleton):** Only B111 consumer modules exist under `apps/erp/src/lib/`. The flow below is the **required target** for PAS-001A-R1 rebuild — not current committed ERP paths.

```text
HTTP / Server Action / RSC request
        │
        ▼
apps/erp  tenant-domain.server.ts          ← subdomain / session hints
        │
        ▼
apps/erp  resolve-grant-scope.server.ts   ← @afenda/permissions resolvePermissionScopeContext
        │
        ▼
@afenda/permissions  parse*/assert*       ← wire ingress
        │
        ▼
apps/erp  brandPermissionScopeContextFromUnknownWire  ← @afenda/kernel projection
        │
        ▼
apps/erp  resolve-consolidation-scope.server.ts
        │
        ▼
OperatingContext (branded kernel shape)
        │
        ├──► authorize-api-route / runProtectedMutation
        ├──► toApplicationShellOperatingContext → AppShell
        └──► metadata-workspace / module routes
```

## 2.2 Ownership split

| Layer | Runtime owner | Responsibility | Kernel role |
| --- | --- | --- | --- |
| Vocabulary | `@afenda/kernel` | Words, branded shapes, projection | Owns vocabulary only |
| Parse / assert | `@afenda/permissions` | Wire ingress for grant scope (**IS-001**) | — |
| Assembly | `apps/erp` | Full `OperatingContext` (**IS-002**) | imports kernel + permissions |
| Persistence | `@afenda/database` | Tenant, company, org rows | — |
| Presentation | PAS-006 ERP shell (target) — *was* `@afenda/appshell` | Shell labels + switch UI | receives branded context |
| Authorization bridge | `apps/erp` metadata runtime (target) — *was* `@afenda/metadata-ui` | Verified context for metadata (**IS-003**) | — |

Key surfaces: `PermissionScopeWireContext` assert/parse → Permissions · branded `OperatingContext` slot → kernel projection · `resolvePermissionScopeContext` → Permissions · full assembly → `apps/erp`.

## 2.3 Integration registry

Machine authority: `apps/erp/src/lib/context/context-integration-registry.ts`

**Current (skeleton):** `TENANT_LIFECYCLE_BRIDGE_WIRING` — B111 tenant lifecycle + metadata extension boundary (3 entries). Gate: `check:erp-operating-context-spine` (slim mode).

**Target (PAS-001A-R1):** `CONTEXT_INTEGRATION_WIRING` — full operating-context spine. B72 gate verifies every entry: module exists · delegate exported · no forbidden deep imports.

**Source:** Kernel Blueprint §5.1 · legacy PAS-001A §2 (T5) · B111 handoff [SLICE/b111-tenant-lifecycle-extension-consumer-attestation.md](SLICE/b111-tenant-lifecycle-extension-consumer-attestation.md)

## 2.4 Runtime boundaries

Explicit call-direction rules for review — architectural, not import-graph detail.

```text
Runtime boundary stack (downward dependency only):

Kernel → Permissions → ERP → Presentation (AppShell · Metadata UI)
```

| Layer | May | Must never |
| --- | --- | --- |
| **Kernel** | Be imported by downstream packages | Call upward · parse untrusted permission-scope wire · assemble `OperatingContext` · own resolver spine |
| **Permissions** | Parse/assert wire · return validated grant-scope facts | Assemble full `OperatingContext` · redefine kernel grant vocabulary |
| **ERP** | Assemble branded `OperatingContext` · anti-corruption translation | Define parallel kernel vocabulary · bypass Permissions parser for `PermissionScope` |
| **Presentation** | Consume verified branded context from ERP spine | Parse untrusted tenant/company/org input · fork scope models |

**Ingress chain (IS-001 → IS-002):**

```text
untrusted input
        ↓
Permissions parse/assert          (IS-001 — wire ingress ends here for grant scope)
        ↓
validated wire
        ↓
Kernel branding / projection      (no permission-scope wire ingress in kernel)
        ↓
ERP OperatingContext assembly     (IS-002)
        ↓
Presentation / Metadata bridge    (IS-003)
```

---

# 3. Context Map

Bounded contexts: Kernel (vocabulary) · Permissions (grant scope) · Database (persistence) · ERP (anti-corruption + assembly) · AppShell (presentation) · Metadata UI (authorization bridge).

| Relationship | Pattern | Integration module |
| --- | --- | --- |
| Kernel → ERP | Conformist | `resolve-operating-context.server.ts` |
| Permissions → ERP | Anti-corruption | `resolve-grant-scope.server.ts` + kernel projection |
| Database → ERP | Anti-corruption | tenant/legal-entity resolvers |
| ERP → AppShell | Published language | `to-shell-operating-context.ts` |
| ERP → Metadata UI | Shared kernel | B74 bridge |

Full mermaid + table: legacy [PAS-001A §3](archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md#3-context-map-bounded-contexts).

---

# 4. Integration Governance Rules

## 4.1 Anti-corruption

ERP may **translate** facts into kernel-branded `OperatingContext`. ERP **must not redefine** kernel vocabulary.

**Enforcement:** `check:erp-context-surface` · B72 spine gate · `quality:boundaries`

## 4.2 Runtime ingress

Only designated ingress boundaries parse untrusted wire input. Kernel permission-scope has **no wire ingress** — projection only.

```text
untrusted → Permissions/API/resolver ingress → validated wire → kernel parse/brand → OperatingContext
```

See §2.4 for full runtime boundary stack.

## 4.3 Evidence promotion

Production Candidate requires B75 attestation + §6 acceptance matrix 10/10 green. Manual doc claims do not promote status.

## 4.4 Hidden PAS-001 amendment guard

PAS-001A slices must not add kernel contracts, expand exports for ERP-only types, or move resolvers into kernel. Stop → PAS-001 amendment slice.

## 4.5 Integration invariants

Architectural truths — independent of implementation files. Violations require ADR or PAS amendment, not local workaround.

| ID | Invariant | Surfaces |
| --- | --- | --- |
| **INV-001** | Every protected request must pass exactly one `OperatingContext` assembly via the ERP spine | IS-002 |
| **INV-002** | `PermissionScope` must never bypass the Permissions parser/assert path | IS-001 |
| **INV-003** | Kernel branded types must never originate directly from untrusted input without designated ingress | IS-001 · IS-002 |
| **INV-004** | Metadata authorization must consume ERP spine output — not local scope forks | IS-003 |
| **INV-005** | Kernel may be imported downstream; kernel must never call upward into ERP, Permissions evaluation, or Presentation | §2.4 |
| **INV-006** | Permissions returns validated facts; Permissions must never assemble full `OperatingContext` | §2.4 |

Full rules: legacy [PAS-001A §4](archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md#4-integration-governance-rules).

---

# 5. Slice Catalog (B71–B75)

| Slice | Doc | IS | Status | Closes |
| --- | --- | --- | --- | --- |
| B71 | [b71-permission-scope-permissions-parser.md](SLICE/b71-permission-scope-permissions-parser.md) | IS-001 | Delivered | Permission parser owner; kernel projection-only |
| B72 | [b72-erp-operating-context-spine-gate.md](SLICE/b72-erp-operating-context-spine-gate.md) | IS-002 | Delivered | `check:erp-operating-context-spine` |
| B73 | [b73-kernel-erp-doc-drift-closure.md](SLICE/b73-kernel-erp-doc-drift-closure.md) | — | Delivered | Runtime matrix + doc sync |
| B74 | [b74-metadata-context-authorization-bridge.md](SLICE/b74-metadata-context-authorization-bridge.md) | IS-003 | Delivered | Metadata authorization bridge |
| B75 | [b75-pas001a-production-candidate-attestation.md](SLICE/b75-pas001a-production-candidate-attestation.md) | — | Delivered | §6 acceptance matrix attestation |

**Catalog:** [SLICE/kernel-slice-catalog.md §3](SLICE/kernel-slice-catalog.md#3-pas-001a--erp-integration-spine) · **Order:** B71 → B72 → B73 → B74 → B75

---

# 6. ERP Integration Acceptance Matrix (B75 — historical closure)

Reusable governance model for runtime integration proof. ERP is the first implementation; future domain runtimes (CRM, HRM, Inventory) may adopt the same matrix shape under a Platform Integration Standard.

Pass threshold: **10/10 required rows green** for Production Candidate **runtime** claim.

## 6.1 ADR-0027 skeleton scorecard (current)

Post-reset ERP on PAS-006 skeleton. R1d attestation **2026-06-29** — **10/10 green**. Full gate bundle: [R1d attestation appendix](./SLICE/pas-001a-r1d-production-candidate-reclose.md#r1d-attestation-appendix-archived-gate-bundle-2026-06-29).

| # | Criterion | Skeleton status | Gate evidence |
| --- | --- | --- | --- |
| 1 | Permission wire triad | **Green** | `pnpm check:permission-scope-permissions-surface` ✓ |
| 2 | Kernel no permission-scope parser | **Green** | `pnpm quality:kernel-context-surface` ✓ |
| 3 | ERP kernel projection at assembly | **Green** | R1a `resolve-operating-context.server.ts` + `pnpm check:erp-operating-context-spine` ✓ |
| 4 | Runtime ingress rule | **Green** | `pnpm check:erp-auth-actor-protected-path-attestation` ✓ + spine gate |
| 5 | Anti-corruption | **Green** | `pnpm quality:boundaries` ✓ + spine gate forbidden-import checks *( `check:erp-context-surface` archived)* |
| 6 | Full integration registry | **Green** | R1a `CONTEXT_INTEGRATION_WIRING` (9 entries) + spine gate ✓ |
| 7 | Operating-context integration tests | **Green** | `pnpm --filter @afenda/erp test:run` ✓ (`operating-context-spine.integration.test.ts`) |
| 8 | Context map live modules | **Green** | §3 modules on disk; spine gate module/delegate verification ✓ |
| 9 | Metadata spine resolver | **Green** | `pnpm check:erp-metadata-pas006-consumer` ✓ · R1c `hydrate-metadata-binding-slots.server.ts` |
| 10 | Doc drift + matrix synced | **Green** | `pnpm check:documentation-drift` ✓ · this §6.1 row |

**Score:** 10/10 — IS-002 + IS-003 integration-proven on PAS-006 skeleton.

### 6.2 Historical matrix (B75 — pre-reset ERP)

| # | Criterion | IS / INV | Evidence |
| --- | --- | --- | --- |
| 1 | Permission wire triad in `@afenda/permissions` | IS-001 · INV-002 | B71 gate |
| 2 | Kernel has no permission-scope parser | INV-003 | package structure gate |
| 3 | ERP uses kernel projection at assembly | IS-002 · INV-001 | resolve-operating-context + tests |
| 4 | Runtime ingress rule (§4.2 · §2.4) | INV-003 | B71 + B72 |
| 5 | Anti-corruption rule (§4.1) | INV-005 | `check:erp-context-surface` |
| 6 | All `CONTEXT_INTEGRATION_WIRING` verified | IS-002 | B72 |
| 7 | Operating-context integration tests green | IS-002 | `apps/erp/src/lib/context/__tests__/` |
| 8 | Context map rows have live modules | IS-002 · IS-003 | §3 table |
| 9 | Metadata uses spine resolver | IS-003 · INV-004 | B74 |
| 10 | `check:documentation-drift` + matrix synced | — | B73 |

Legacy title: Production Candidate Scorecard — [PAS-001A §6](archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md#6-production-candidate-scorecard-b75--closed).

---

# 7. Closure Waivers (inherit from PAS-001)

Not PAS-001A blockers: `FiscalCalendarId` quarantine · deferred ID families · ledger/posting runtime. See legacy [PAS-001A §7](archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md#7-closure-waivers-inherit-from-pas-001--not-pas-001a-blockers).

---

# 8. Enterprise Acceptance Criteria

| Criterion | Gate | Upstream |
| --- | --- | --- |
| Spine gate operational | `check:erp-operating-context-spine` | IS-002 · Kernel NS runtime integration |
| Permission surface gate | `check:permission-scope-permissions-surface` | IS-001 · PAS-001 §8 vocabulary |
| Metadata bridge | `check:metadata-context-authorization-bridge` *(archived)* · B111 extension gate *(active)* | IS-003 · Blueprint §5.1 |
| Production attestation | B75 historical · skeleton re-attestation pending | §6.2 historical matrix · §6.1 skeleton scorecard |

---

# 9. Doctrine

```text
PAS-001 defines the governed kernel language.
PAS-001A proves that real ERP runtime speaks that language consistently.

Kernel closure is vocabulary acceptance.
PAS-001A closure is production integration acceptance.

The kernel owns the words.
The owner package owns the decision.
The runtime layer owns the behavior.
PAS-001A proves the runtime layer speaks the words.
```

If PAS-001A work requires new kernel words → stop and amend PAS-001 explicitly.

---

# 10. References

| Artifact | Path |
| --- | --- |
| Parent PAS (composed) | [PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) |
| Legacy archive | [archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md](archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md) |
| Kernel Blueprint §5.1 | [kernel-blueprint.md](../../BLUEPRINT/kernel-blueprint.md) |
| Context registry | `packages/kernel/src/context/context-registry.ts` |
| ERP resolver (target) | `apps/erp/src/lib/context/resolve-operating-context.server.ts` *(absent on ADR-0027 skeleton — PAS-001A-R1)* |
| ERP consumer registry (current) | `apps/erp/src/lib/context/context-integration-registry.ts` (`TENANT_LIFECYCLE_BRIDGE_WIRING`) |
| ADR-0027 reset | [ADR-0027-frontend-presentation-reset.md](../../adr/ADR-0027-frontend-presentation-reset.md) |
| Multi-tenancy Step 8 | [multi-tenancy.md](../../PAS/KERNEL/multi-tenancy-delivery-evidence.md) |
| Family index | [KERNEL/README.md](README.md) |
| Future platform pattern | Platform Integration Standard *(proposed — ERP is first implementation)* |

**Provenance:** Production Candidate — composed from legacy PAS-001A B75 closure; acceptance matrix + IS/INV IDs added 2026-06-29.
