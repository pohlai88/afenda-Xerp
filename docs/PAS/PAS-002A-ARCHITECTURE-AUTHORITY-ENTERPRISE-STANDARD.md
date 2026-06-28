# PAS-002A — Architecture Authority Enterprise Hardening Standard

> **Derivation:** PAS-002A continues **Enterprise Accepted** promotion after [PAS-002 MVP Authority closure](PAS-002-ARCHITECTURE-AUTHORITY.md) (B1–B27 delivered, `PKGR02_ARCHITECTURE_AUTHORITY` green-lane). It does **not** amend PAS-002 §1–§15 boundary doctrine. It defines **kernel non-duplication discipline** (PAS-001 / ADR-0021), **ownership baseline attestation** (ADR-0004), **governance consumer proof**, **disposition completeness**, and the slice sequence to **Enterprise Accepted** maturity on `@afenda/architecture-authority`.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-002A |
| **Parent PAS** | PAS-002 |
| **Document class** | `derived_enterprise_standard` |
| **Document role** | `enterprise_accepted_rollout` |
| **Canonical filename** | `PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md` |
| **Package** | `@afenda/architecture-authority` |
| **Layer** | Platform |
| **Package role** | Enterprise Accepted evidence — kernel boundary gates, ownership sign-off, governance consumer proof, disposition completeness, formal maturity attestation |
| **Runtime stance** | `contracts-only` |
| **Registry lane** | `PKGR02_ARCHITECTURE_AUTHORITY` · `PKG-019` |
| **Package owner** | Architecture Authority |
| **Parent standard** | PAS-002 (package/layer/ownership/dependency/drift authority) |
| **Agent skills** | `architecture-authority` · **`kernel-authority`** (mandatory for BMD authority, kernel cross-refs, identity boundary slices) |
| **Maturity** | Enterprise Accepted (`enterprise_accepted`) |
| **Authority status** | `accepted_for_boundary` |
| **Implementation status** | `delivered` |
| **Evidence level** | `runtime_proven` |
| **Runtime status** | B38–B42 delivered — four new gates operational; ownership attested 2026-06-28 |
| **Remaining slices** | none |
| **Consumers** | `@afenda/kernel`, all registered workspace packages, `scripts/quality/**`, `scripts/governance/**`, `docs/architecture/*.md` derived views |
| **Change model** | `serialized-slices` (B38+) |
| **Quality target** | Enterprise **9.5 / 10** |
| **Slice directory** | `docs/PAS/slice/` |
| **ADR prerequisites** | ADR-0004 (ownership) · ADR-0014 (foundation disposition) · ADR-0020 (BMD authority) · ADR-0021 (identity constitution — read-only for non-duplication gate) |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/architecture-authority typecheck` |
| 2 | `pnpm --filter @afenda/architecture-authority test:run` |
| 3 | `pnpm quality:architecture` |
| 4 | `pnpm architecture:cycles` |
| 5 | `pnpm architecture:drift` |
| 6 | `pnpm quality:boundaries` |
| 7 | `pnpm check:foundation-disposition` |
| 8 | `pnpm check:architecture-authority-surface` |
| 9 | `pnpm check:documentation-drift` |

#### Required gates (PAS-002A — wired on slice close)

| # | Gate command | First slice |
| --- | --- | --- |
| 10 | `pnpm check:architecture-kernel-non-duplication` | B38 |
| 11 | `pnpm check:architecture-ownership-signoff` | B39 |
| 12 | `pnpm check:architecture-governance-consumer-proof` | B40 |
| 13 | `pnpm check:architecture-disposition-completeness` | B41 |

> **Maturity is part of authority.**
> PAS-002 MVP evidence (B1–B27, green-lane disposition, composite validators) is **closed**. **`contracts-only` runtime stance is permanent** — Enterprise Accepted does **not** mean ERP request-time execution. Do not claim **Enterprise Accepted** until B42 attestation closes and `foundation-registry-owner` promotes `PKGR02` authority to PAS-002A.

> **Kernel wire boundary (mandatory read):** [PAS-001](PAS-001-KERNEL-AUTHORITY-STANDARD.md) · [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) · `.cursor/skills/kernel-authority/SKILL.md`
> **Governance baseline (closed):** [PAS-002](PAS-002-ARCHITECTURE-AUTHORITY.md) · `.cursor/skills/architecture-authority/SKILL.md`
> **Canonical location:** `docs/PAS/PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md`

---

# 0. Agent Quick Path

> Read **PAS-002 §0** (governance boundary), then this §0. Session: `/afenda-coding-session` · Bundle: `/coding-consistency-bundle` · Skills: **`architecture-authority` + `kernel-authority`** on every B38–B42 slice touching BMD registry, identity references, or kernel adjacency.

**Boundary (unchanged from PAS-002):** `@afenda/architecture-authority` **owns architecture registries, package lifecycle truth, layer rules, dependency boundaries, ownership records, drift policy, and architecture quality gates; it never owns product behavior, business master data runtime, Kernel identity primitives, UI behavior, database migrations, auth/session behavior, or ERP module implementation.**

**PAS-002A adds (post–MVP Authority):**

| Topic | PAS-002 (closed) | PAS-002A target |
| --- | --- | --- |
| Maturity claim | MVP Authority · `implementation_status: partial` | **Enterprise Accepted** via B42 scorecard + registry promotion |
| Kernel adjacency | Documented boundary; BMD moved from kernel (ADR-0020) | **Automated non-duplication gate** — no ID families, parsers, wire asserts in architecture-authority |
| Ownership | Machine registry + human doc **Pending Sign-off** | **ADR-0004 baseline attestation** + parity gate |
| Consumer proof | Gates run in CI | **Proven import discipline** — governance scripts and sample foundation packages use root/`/surface` only |
| Disposition | B27 coverage gap closure | **Completeness gate** — every active package row has disposition entry |
| Runtime stance | `contracts-only` | **Unchanged** — Enterprise Accepted = governance proof, not ERP runtime |

**Hard stops:**

- **Prohibited:** claim Enterprise Accepted before B42; add kernel parsers/asserts/ID families to architecture-authority
- **Prohibited:** edit `foundation-disposition.registry.ts` outside `foundation-registry-owner`
- **Prohibited:** conflate **implemented** (runtime truth matrix) with **Enterprise Accepted** (PAS maturity)
- **Required:** dual Phase 0 — architecture-authority **and** kernel-authority — before B38–B41 implementation

**Required gates:** §13

**First implementation slice:** [b38-pas002a-kernel-boundary-gate](slice/b38-pas002a-kernel-boundary-gate.md)

**Planner / registry:** `pas-slice-planner` · disposition changes → `foundation-registry-owner` only

---

# 1. Derivation and Scope

## 1.1 What PAS-002 delivered (B1–B27 — closed)

- Constitutional package/layer/ownership/dependency/drift authority (PAS-002 §1–§15)
- Twelve authority surfaces §4.1–§4.12 in `packages/architecture-authority/src/`
- Composite architecture gate (`validateArchitecture`), lifecycle enforcement, surface registry
- `PKGR02_ARCHITECTURE_AUTHORITY` green-lane disposition row (B18, B27)
- Agent skill chain and package-local tree (`PAS-002-ARCHITECTURE-TREE.md`)
- **Runtime truth matrix:** **implemented** (files, tests, gates)

## 1.2 What PAS-002A owns

PAS-002A is the **Enterprise Accepted rollout standard** for closing remaining governance gaps without amending PAS-002 boundary doctrine:

1. **Kernel non-duplication gate** — architecture-authority records package governance only; PAS-001 owns identity wire behavior
2. **Ownership baseline attestation** — close human-pending sign-off on `docs/architecture/ownership-registry.md` (ADR-0004)
3. **Governance consumer proof** — CI scripts and representative packages import architecture-authority through approved surfaces only
4. **Disposition completeness** — active package-registry rows ↔ foundation-disposition entries parity (extends B27)
5. **Enterprise Accepted scorecard** — §11; B42 attestation + `PKGR02` authority promotion to PAS-002A

## 1.3 What PAS-002A does not do

- Rewrite PAS-002 §1–§15 or change **Runtime stance** from `contracts-only`
- Move kernel identity primitives back into architecture-authority
- Introduce ERP request-time architecture validation services
- Replace `foundation-registry-owner` workflow
- Duplicate long-form ADR/PAS narrative inside package source

## 1.4 Resolving the partial / none confusion

| Label | Meaning for architecture-authority |
| --- | --- |
| PAS-002 `implementation_status: partial` | MVP Authority — not yet Enterprise Accepted |
| PAS-002 `runtime stance: contracts-only` | **No product runtime** — by design, permanent |
| Runtime matrix `implemented` | Code + gates exist on disk |
| PAS-002A target `enterprise_accepted` | Full governance maturity attestation — **still contracts-only** |

---

# 2. One-Sentence Boundary

**`@afenda/architecture-authority` owns Enterprise Accepted evidence for monorepo structural legality — registries, validators, disposition pointers, and architecture gates with kernel non-duplication proof and governance consumer discipline — and never owns kernel wire parsers, business master data runtime, UI rendering, database schema, auth sessions, or ERP route behavior.**

---

# 3. Dependency Rules

## 3.1 Allowed

Same as PAS-002 §3.1, plus:

- Read-only type imports from `@afenda/kernel` **only** when a gate compares registry metadata to kernel contract **paths** (strings) — not when importing parser/runtime behavior
- Cross-skill consultation: `kernel-authority` Phase 0 before any slice touching `business-master-data-authority.registry.ts` or identity-adjacent policy modules

## 3.2 Prohibited imports

Same as PAS-002 §3.2. **PAS-002A adds explicit prohibition:**

- `@afenda/kernel` identity parsers, assert modules, or generator utilities used as runtime validators inside architecture-authority source (path-lint comparison in CI scripts under `scripts/governance/` is allowed)

## 3.3 Dual-authority import rule

```text
architecture-authority → records which package owns which entity ID (ADR-0020)
kernel                   → defines ten_/cus_/leg_ wire format and parse* behavior (PAS-001 §4.1)

If architecture-authority defines prefix regex, parse*, or ID_FAMILIES tables → wrong package (B38 gate must fail).
```

---

# 4. Authority Surfaces (Enterprise Accepted Target)

## 4.1 Kernel boundary non-duplication (B38)

**Authority:** PAS-002 §4.10 · PAS-001 §4.1 · ADR-0020 · ADR-0021

**Target implementation:**

- `packages/architecture-authority/src/policy/architecture-kernel-non-duplication.policy.ts`
- `scripts/governance/check-architecture-kernel-non-duplication.mts`

**Gate must reject:**

- Files matching `*id-family*`, `*parser*`, `*assert*` under `packages/architecture-authority/src/` outside approved allowlist (empty by default)
- Duplicate `ID_FAMILIES`, enterprise ID prefix tables, or `parseTenantId`-style functions
- BMD registry rows that embed wire format rules instead of `domainPackage` + `kernelReferenceNotes`

**Gate must allow:**

- `business-master-data-authority.registry.ts` entity → domain package mapping with `runtimeStatus: "authority_only"`
- String path references to `packages/kernel/src/identity/**` in gate scripts (not in package runtime imports)

## 4.2 Ownership baseline sign-off (B39)

**Authority:** PAS-002 §4.3 · ADR-0004 · `docs/architecture/ownership-registry.md`

**Current gap:** Human view status **Baseline — Pending Sign-off** (runtime truth matrix).

**Target:**

- Signed attestation block in `ownership-registry.md` (Architecture Authority + ADR-0004 traceability)
- Machine parity: `ownership-registry.data.ts` ↔ human view fingerprint sync
- `scripts/governance/check-architecture-ownership-signoff.mts` — fails if pending sign-off marker remains after B39 close

## 4.3 Governance consumer proof (B40)

**Authority:** PAS-002 §4.7 · §6.2 approved exports

**Target:** Static gate proving representative consumers import correctly:

| Consumer class | Minimum proof |
| --- | --- |
| `scripts/governance/check-*.mts` | Import `@afenda/architecture-authority` root or `/surface` only — no deep `src/data/` paths |
| `scripts/quality/*.mjs` | At least one composite gate invokes `validateArchitecture` or documented validator |
| Foundation sample | `@afenda/kernel`, `@afenda/enterprise-knowledge` boundary tests reference architecture registries without cycles |

**Script:** `scripts/governance/check-architecture-governance-consumer-proof.mts`

## 4.4 Disposition completeness (B41)

**Authority:** PAS-002 §4.4 · ADR-0014

**Target:** Every **active** row in `package-registry.data.ts` has a matching `foundation-disposition.registry.ts` entry (or explicit archive-lane waiver in exception registry).

Extends B27 gap closure with automated regression gate:

**Script:** `scripts/governance/check-architecture-disposition-completeness.mts`

## 4.5 Enterprise Accepted scorecard (B42)

**Authority:** PAS-002 §11 · enterprise-erp-standards §9 · PAS-004A §11 pattern

| # | Criterion | Points |
| ---: | --- | ---: |
| 1 | PAS-002 §1–§15 unchanged | 2 |
| 2 | B1–B27 slice handoffs complete | 2 |
| 3 | Kernel non-duplication gate (B38) | 3 |
| 4 | Ownership sign-off attestation (B39) | 3 |
| 5 | Governance consumer proof (B40) | 3 |
| 6 | Disposition completeness gate (B41) | 2 |
| 7 | All PAS-002 §13.1 gates passing | 3 |
| 8 | `check:architecture-authority-surface` passing | 2 |
| 9 | Skill chain synced (architecture + kernel cross-ref) | 2 |
| 10 | Documentation drift clean for PAS-002 paths | 2 |
| 11 | No prohibited imports (`quality:boundaries`) | 2 |
| 12 | PKGR02 promoted to PAS-002A authority | 2 |
| 13 | Completion Report on B38–B42 | 2 |
| 14 | Contracts-only runtime stance preserved (no ERP imports) | 2 |
| | **Total** | **30** · threshold **≥ 28.5 / 30** |

**Honesty rule:** PAS-002 B1–B27 alone scores **≤ 18 / 30** — MVP delivery is not Enterprise Accepted.

---

# 5. What This Package Must Never Own

Everything in PAS-002 §5, plus:

- **Kernel identity parsers, prefix registries, or wire asserts** (PAS-001 / ADR-0021)
- **Enterprise Accepted maturity claims** without B42 scorecard ≥ 28.5/30
- **Request-time ERP validation services** — CI/governance execution only

---

# 6. Package Structure Standard

## 6.1 Current (PAS-002 — honest)

See PAS-002 §6.1 and [`PAS-002-ARCHITECTURE-TREE.md`](../../packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md). B1–B27 structure is live baseline.

## 6.2 Target additions (PAS-002A)

```text
packages/architecture-authority/
└── src/
    └── policy/
        └── architecture-kernel-non-duplication.policy.ts   # B38

scripts/governance/
├── check-architecture-kernel-non-duplication.mts           # B38
├── check-architecture-ownership-signoff.mts                # B39
├── check-architecture-governance-consumer-proof.mts      # B40
└── check-architecture-disposition-completeness.mts         # B41
```

No new runtime npm dependencies. Policy modules are pure static analysis helpers consumed by governance scripts.

---

# 7. Decision Matrix

| Question | If yes → | In architecture-authority? |
| --- | --- | --- |
| Does this add or rename a governed package? | Package + ownership registry | **Yes** (PAS-002) |
| Does this define `ten_` / `cus_` wire format or parse*? | Kernel (PAS-001 §4.1) | **No** |
| Does this map entity type → domain package (ADR-0020)? | BMD authority registry | **Yes** (metadata only) |
| Does this prove CI consumers import approved surfaces? | B40 gate | **Yes** (PAS-002A) |
| Does this attests ownership baseline (ADR-0004)? | B39 docs + gate | **Yes** (PAS-002A) |
| Does this run on every ERP HTTP request? | Application layer | **No** |
| Does this evaluate permissions or entitlements? | permissions / entitlements | **No** |
| Does this duplicate Knowledge Atoms? | enterprise-knowledge | **No** |
| Does this define CSS tokens? | css-authority | **No** |

---

# 8. Contract Rules

All PAS-002 §8 contract rules apply, plus:

1. **Dual Phase 0** — B38–B41 touching kernel adjacency require both `architecture-authority` and `kernel-authority` Phase 0 blocks
2. **BMD registry discipline** — rows record `domainPackage`, `entityKind`, `runtimeStatus: "authority_only"`; no embedded prefix regex
3. **Consumer import suffix** — external packages may import `@afenda/architecture-authority` or `@afenda/architecture-authority/surface` only (existing surface gate enforced)
4. **Sign-off fingerprint** — `ownership-registry.md` fingerprint must match attestation date on B39 close
5. **Disposition parity** — package registry active rows ⊆ disposition registry ids ∪ documented exceptions
6. **No maturity inflation** — `implementation_status` in PAS-002 header updates only after B42 + registry owner promotion

---

# 9. Runtime Rules

**Unchanged from PAS-002:** `@afenda/architecture-authority` remains **contracts-only**.

Enterprise Accepted promotion adds **more CI gates and attestation evidence** — not ERP request lifecycle participation.

Approved runtime primitives (unchanged):

```text
Static registry constants → pure validators → CLI gate scripts → pass/fail report
```

Forbidden (unchanged):

```text
ERP route → architecture-authority → business decision
```

---

# 10. Implementation Sequence (B38–B42)

Execute in order. Do not skip consumer proof or disposition completeness before B42 attestation.

| Order | Slice | Delivers | Status |
| ---: | --- | --- | --- |
| 1 | [B38 Kernel boundary gate](slice/b38-pas002a-kernel-boundary-gate.md) | `architecture-kernel-non-duplication.policy.ts` + `check:architecture-kernel-non-duplication` | **Delivered** |
| 2 | [B39 Ownership baseline sign-off](slice/b39-pas002a-ownership-signoff.md) | ADR-0004 attestation + `check:architecture-ownership-signoff` | **Delivered** |
| 3 | [B40 Governance consumer proof](slice/b40-pas002a-governance-consumer-proof.md) | import-surface gate for scripts/governance + quality | **Delivered** |
| 4 | [B41 Disposition completeness](slice/b41-pas002a-disposition-completeness.md) | package ↔ disposition parity gate | **Delivered** |
| 5 | [B42 Enterprise Accepted attestation](slice/b42-pas002a-enterprise-accepted-attestation.md) | Scorecard 30/30; PKGR02 → PAS-002A | **Delivered** |

**Do not add in this package (correct home):**

- Enterprise ID parsers → `@afenda/kernel`
- Knowledge Atoms → `@afenda/enterprise-knowledge`
- CSS token registry → `@afenda/css-authority`
- Accounting standard families → `@afenda/accounting-standards`
- Permission evaluation → `@afenda/permissions`

---

# 11. Enterprise Acceptance Criteria

## 11.1 Production Candidate (optional milestone — B41 close)

May be recorded in `pas-status-index.md` when B38–B41 gates pass and PAS-002 §13.1 gates remain green:

- Kernel non-duplication gate operational
- Ownership sign-off attested
- Governance consumer proof passing
- Disposition completeness passing
- **Still** `contracts-only` — no ERP runtime claim

## 11.2 Enterprise Accepted (B42)

Requires **all** of:

1. §11 scorecard ≥ **28.5 / 30**
2. All §13 gates passing with Shell evidence in slice Completion Reports
3. `foundation-registry-owner` updates `PKGR02_ARCHITECTURE_AUTHORITY`:
   - `authority: "PAS-002A"`
   - B38–B42 evidence paths in `evidence[]`
   - New gates in `gates[]`
4. PAS-002 metadata `implementation_status` promoted to `implemented` with pointer to PAS-002A as live authority
5. Runtime truth matrix gap row cleared: ownership sign-off **complete**

## 11.3 Permanent exclusions (even at Enterprise Accepted)

- ERP request-time execution
- UI/database/auth SDK dependencies
- Kernel wire parser ownership
- Business master data record schemas

---

# 12. Coverage and Honesty Table

| Domain | PAS-002 (closed) | PAS-002A target | Enterprise Accepted |
| --- | --- | --- | --- |
| Package registry | All active packages | + disposition parity proof | Sustained by B41 gate |
| Layer / dependency gates | Composite validators | + consumer import proof | Sustained by B40 gate |
| Ownership registry | Machine + human doc | Human sign-off attested | ADR-0004 closed |
| BMD authority (ADR-0020) | Registry relocated from kernel | Kernel non-dup gate | B38 enforced |
| Foundation disposition | B27 gap closure | Regression completeness gate | B41 enforced |
| Maturity label | MVP Authority / partial | Production Candidate optional mid-track | Enterprise Accepted via B42 |

---

# 13. Required Gates

## 13.1 Required (all PAS-002A slices — inherited from PAS-002)

```bash
pnpm --filter @afenda/architecture-authority typecheck
pnpm --filter @afenda/architecture-authority test:run
pnpm quality:architecture
pnpm architecture:cycles
pnpm architecture:drift
pnpm quality:boundaries
pnpm check:foundation-disposition
pnpm check:architecture-authority-surface
```

## 13.2 Required after B38

```bash
pnpm check:architecture-kernel-non-duplication
```

## 13.3 Required after B39–B41

```bash
pnpm check:architecture-ownership-signoff
pnpm check:architecture-governance-consumer-proof
pnpm check:architecture-disposition-completeness
```

## 13.4 Recommended (B42)

```bash
pnpm check:documentation-drift
pnpm quality
```

---

# 14. Reusable Guardrail Template

Same as PAS-002 §14. PAS-002A adds:

- Dual-skill invocation: `architecture-authority` + `kernel-authority` on B38–B41
- Registry promotion checklist for `foundation-registry-owner` on B42

---

# 15. Final Doctrine

PAS-002 defines **whether the monorepo structure is governable**. PAS-002A defines **when that governance is Enterprise Accepted** — with kernel adjacency proof, ownership attestation, consumer discipline, and disposition completeness — **without** becoming a product runtime package.

> **Architecture Authority owns structure** — at every maturity level.
> **Kernel owns global identity wire behavior** — architecture authority references, never reimplements.
> **Enterprise Accepted means governance proof** — not ERP hot-path execution.

When in doubt, apply the kernel-authority three-question test before adding functions to architecture-authority: no data loading, no formatting/UI text, no business decision fallbacks.

---

## References

| Document | Role |
| --- | --- |
| [PAS-002](PAS-002-ARCHITECTURE-AUTHORITY.md) | Parent MVP Authority standard |
| [PAS-001](PAS-001-KERNEL-AUTHORITY-STANDARD.md) | Kernel identity boundary |
| [PAS-004A §11](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md#11-enterprise-acceptance-criteria-95-scorecard) | Scorecard pattern reference |
| [afenda-runtime-truth-matrix.md](../architecture/afenda-runtime-truth-matrix.md) | Runtime evidence vocabulary |
| [ownership-registry.md](../architecture/ownership-registry.md) | B39 attestation target |
| [foundation-disposition.md](../architecture/foundation-disposition.md) | PKGR02 read-only view |
