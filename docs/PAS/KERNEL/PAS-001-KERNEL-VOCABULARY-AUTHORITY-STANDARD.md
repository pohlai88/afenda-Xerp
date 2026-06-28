# PAS-001 — Kernel Vocabulary Authority Standard

> **Composed governance layer** — distilled from accepted legacy [PAS-001](../PAS-001-KERNEL-AUTHORITY-STANDARD.md). Exhaustive §4 contract implementation detail remains in the legacy archive until selectively promoted here.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-001 |
| **Document class** | `package_authority_standard` |
| **Document role** | `kernel_vocabulary_authority` |
| **Blueprint box** | **Kernel Vocabulary** |
| **Package** | `@afenda/kernel` |
| **Layer** | Platform |
| **Package role** | Zero-dependency platform vocabulary and execution context substrate |
| **Runtime stance** | Contracts-first; no database, HTTP, auth runtime, or UI runtime |
| **Registry lane** | `@afenda/kernel` · `PKGR01_ACCOUNTING` (erp-domain/accounting subpath) |
| **Agent skill** | `kernel-authority` · `.cursor/skills/kernel-authority/SKILL.md` |
| **Maturity** | Enterprise Accepted (`enterprise_accepted`) |
| **Authority status** | `enterprise_accepted` |
| **Implementation status** | `implemented` |
| **Evidence level** | `runtime_proven` |
| **Runtime status** | Kernel contracts, slice catalog B49–B70 closed, runtime gates operational |
| **Remaining slices** | none — B70 Delivered |
| **Total slices planned** | B49–B70 closure sequence (legacy catalog lists full B2–B70 history) |
| **Delivered slices** | B49–B70 closed · prior B2–B48 historical |
| **Consumers** | `@afenda/auth`, `@afenda/permissions`, `@afenda/execution`, `@afenda/observability`, `@afenda/appshell`, `apps/erp`, governed domain packages |
| **Upstream** | [Kernel North Star](../../NORTHSTAR/kernel-north-star.md) · [Kernel Blueprint](../../BLUEPRINT/kernel-blueprint.md) §4 Kernel Vocabulary |
| **Extension PAS** | [PAS-001A](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) · [PAS-001B](PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) |
| **Legacy archive** | [PAS-001-KERNEL-AUTHORITY-STANDARD.md](../PAS-001-KERNEL-AUTHORITY-STANDARD.md) |
| **ADR prerequisites** | ADR-0021 · ADR-0022 · ADR-0023 · ADR-0011 (operating context hierarchy) |
| **Last reviewed** | 2026-06-29 |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/kernel typecheck` |
| 2 | `pnpm --filter @afenda/kernel test:run` |
| 3 | `pnpm quality:kernel-context-surface` |
| 4 | `pnpm check:kernel-context-wire-triad` |
| 5 | `pnpm check:kernel-identity-governance` |
| 6 | `pnpm check:kernel-zero-runtime-deps` |
| 7 | `pnpm check:accounting-domain-contracts` |
| 8 | `pnpm check:foundation-disposition` |
| 9 | `pnpm quality:boundaries` |
| 10 | `pnpm architecture:cycles` |
| 11 | `pnpm architecture:drift` |

> **Maturity is part of authority.** PAS-001 vocabulary is closed at Enterprise Accepted. Amendment slices only — do not expand vocabulary under PAS-001A or PAS-001B.

> **Canonical location (composed):** `docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md`
> **Implementation archive:** `docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md` · **Package tree:** `packages/kernel/PAS-001-KERNEL-TREE.md`

---

# 0. Agent Quick Path

**Read order:** [KERNEL README](README.md) → this §0 → legacy [PAS-001 §4](../PAS-001-KERNEL-AUTHORITY-STANDARD.md#4-authority-surfaces) when implementing a cited surface.

**Boundary:** The kernel defines **cross-package facts, branded vocabulary, wire-safe contracts, and execution context primitives**; it never implements **business behavior, persistence, transport, rendering, formatting, authorization evaluation, accounting logic, or external integration**.

**Hard stops:**

- **Prohibited imports:** `@afenda/database`, `@afenda/auth`, `@afenda/permissions`, `@afenda/execution`, `@afenda/observability`, `@afenda/appshell`, `apps/erp`, Drizzle, Better Auth, Next.js, React, Zod, HTTP/DB/cloud SDKs
- **Must never own:** database schema, auth sessions, permission evaluation, API routes, React/UI, domain workflows, posting/ledger, resolver spine
- **Identity gate:** Slice B runtime starts only after ADR-0021, ADR-0022, ADR-0023 are Accepted
- **Enterprise knowledge:** Business meaning → [PAS-004](../PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md); kernel retains wire shapes only

**Required gates:** §13.1 · Session: `/afenda-coding-session` · Skill: `kernel-authority`

---

# 1. Package Definition

`@afenda/kernel` is the lowest shared Platform package. It defines the shared vocabulary that platform, foundation, application, and domain packages may depend on.

The kernel answers **what is this thing?** It must not answer how to load, persist, authorize, render, calculate, format, or execute it.

**Source:** Kernel Blueprint §4.2 · Kernel NS §4 D1 · legacy PAS-001 §1 (T5)

---

# 2. One-Sentence Boundary

The kernel defines **cross-package facts, branded vocabulary, wire-safe contracts, and execution context primitives**; it never implements **business behavior, persistence, transport, rendering, formatting, authorization evaluation, accounting logic, or external integration**.

---

# 3. Dependency Rules

## 3.1 Allowed

TypeScript types and pure helpers · branded IDs · frozen registries · JSON-serializable contracts · minimal async context propagation adapter (dependency-free, no app/domain runtime objects).

## 3.2 Prohibited imports

See §0 hard stops. Kernel may import from itself only.

## 3.3 Import rule

If a kernel contract appears to need database, HTTP, auth, permission, UI, or execution imports, the contract belongs in another package.

## 3.4 Architectural dependencies

| Depends on | Kind | Required for | Notes |
| --- | --- | --- | --- |
| **ADR identity stack** | T0 decision | Branded enterprise IDs | ADR-0021–0023 |
| **Enterprise Knowledge** | Meaning authority | Wire term labels | PAS-004 — kernel shapes only |
| **Permissions** | Consumer | Grant-scope *words* on `OperatingContext` | Evaluation in `@afenda/permissions` |
| **ERP Integration Spine** | Consumer proof | Production wiring | PAS-001A — not kernel substrate |

Full dependency prose: legacy [PAS-001 §3](../PAS-001-KERNEL-AUTHORITY-STANDARD.md#3-dependency-rules).

---

# 4. Authority Surfaces (summary)

Each surface has **Contract type** + **Stability** in the legacy archive. This table is the composed index — implement from legacy §4.

| Surface | Contract type | Stability | Legacy § | Kernel NS capability |
| --- | --- | --- | --- | --- |
| Canonical Enterprise Identity | Identity | Constitutional | §4.1 | Shared enterprise identity |
| Result and Error Vocabulary | Domain | Stable | §4.2 | Result and error vocabulary |
| Execution Context | Runtime | Stable | §4.3 | Execution traceability |
| Operating Context | Runtime | Stable | §4.4 | Operating scope hierarchy |
| Localization / Global Format | Metadata | Evolutionary | §4.5 | — |
| Platform Entity Authority | Domain | Stable | §4.6 | — |
| Business Reference Identity | Identity | Stable | §4.7 | — |
| Accounting Domain Vocabulary (seed) | Domain | Stable | §4.8 | → PAS-001B catalog |
| Policy Decision Vocabulary | Security | Stable | §4.9 | Policy decision vocabulary |
| Domain Event Envelope | Integration | Stable | §4.10 | Domain event envelope |
| Async Context Propagation | Runtime | Stable | §4.11 | Minimal async context frame |

**Permission model:** legacy [PAS-001 §8](../PAS-001-KERNEL-AUTHORITY-STANDARD.md) — grant-scope vocabulary only; evaluation in `@afenda/permissions`.

**ERP domain wire terms:** promoted to [PAS-001B](PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) — not expanded ad hoc under PAS-001 §4.8 alone.

---

# 5. Prohibited Ownership

Kernel must never own: database schema/migrations/clients · auth sessions · permission evaluation · API routes · React/UI · domain workflows · cron/queues · accounting posting/ledger · resolver spine · business state resolution.

**Source:** Kernel NS §9 · Kernel Blueprint §4.2 · legacy PAS-001 §5

---

# 6. Package Structure

**Path:** `packages/kernel/src/` — identity, context, erp-domain (catalog), governance registries.

**Public exports:** governed by legacy PAS-001 §6 · `packages/kernel/package.json` subpaths.

**Drift registry:** `packages/kernel/src/governance/kernel-boundary-drift.registry.ts`

---

# 7. Decision Matrix

Boundary questions resolve through legacy [PAS-001 §7](../PAS-001-KERNEL-AUTHORITY-STANDARD.md) decision matrix (≥8 rows, Yes/No). Composed rule: **when in doubt, escalate to Domain NS or open amendment slice — do not patch consumers.**

---

# 8. Contract Rules

- Branded IDs require family `parse*` at trust boundaries — no silent `as TenantId`
- Wire triads: assert → parse → brand at designated ingress only
- Breaking changes require ADR + PAS amendment + gates
- JSON-serializable contracts at package boundaries

Full rules: legacy PAS-001 §9.

---

# 9. Runtime Rules

Kernel contracts are importable without side effects. No I/O, no env reads in contract modules. Propagation adapter remains dependency-free.

Legacy: PAS-001 §10.

---

# 10. Implementation Sequence

Historical B2–B48 slices delivered core surfaces. **Closure sequence B49–B70** delivered wire triads, hierarchy boundary, context gate, and test import hygiene.

**Current rule:** no new vocabulary slices without PAS-001 amendment handoff. Consumer work → PAS-001A. Catalog work → PAS-001B.

---

# 11. Enterprise Acceptance Criteria

| Criterion | Gate / evidence | Upstream EFR |
| --- | --- | --- |
| Zero runtime deps enforced | `check:kernel-zero-runtime-deps` | Kernel NS D1 |
| Identity governance | `check:kernel-identity-governance` | ADR-0021–0023 |
| Context wire triad | `check:kernel-context-wire-triad` | Operating scope hierarchy |
| Boundary cycles clean | `architecture:cycles` · `architecture:drift` | Platform substrate |
| B49–B70 closure attested | B67–B70 slice Delivered | PAS-001 §13 |

Full §11 table: legacy [PAS-001 §12](../PAS-001-KERNEL-AUTHORITY-STANDARD.md#12-enterprise-acceptance-criteria).

---

# 12. Slice Catalog (closure summary)

| Range | Focus | Status |
| --- | --- | --- |
| B2–B48 | Identity, context, permission vocabulary, package structure | Delivered (historical) |
| B49–B52 | Operating context wire triads (tenant → full hierarchy) | Delivered |
| B53–B57 | Propagation frame · project · policy · permission wire | Delivered |
| B67–B70 | Doc attestation · hierarchy boundary · context gate · test hygiene | Delivered |

**Full catalog:** [KERNEL/SLICE/kernel-slice-catalog.md](SLICE/kernel-slice-catalog.md) · composed handoffs (SSOT) [KERNEL/SLICE/](SLICE/) · legacy archive [`docs/PAS/slice/`](../slice/) · compliance [slice-compliance-audit.md](SLICE/slice-compliance-audit.md)

**Prerequisite for extension work:** PAS-001 Enterprise Accepted (this document) before PAS-001A or PAS-001B consumer/catalog slices.

---

# 13. Required Gates

## 13.1 Required

See metadata **Required gates** table above (legacy PAS-001 §14.1).

## 13.2 Recommended

```bash
pnpm check:kernel-propagation-isolation
pnpm check:kernel-events-wire-serializable
```

## 13.3 Promotion rules

Recommended gates become required when implemented for affected slices. Missing future gates must not block current closure.

---

# 14. Doctrine

```text
Kernel owns words.
Owner packages own decisions.
Runtime layers own behavior.

Vocabulary closure (PAS-001) ≠ integration proof (PAS-001A) ≠ ERP wire catalog (PAS-001B).
```

**Final kernel doctrine:** legacy [PAS-001 §16](../PAS-001-KERNEL-AUTHORITY-STANDARD.md#16-final-kernel-doctrine).

---

# 15. References

| Artifact | Path |
| --- | --- |
| Kernel North Star | [docs/NORTHSTAR/kernel-north-star.md](../../NORTHSTAR/kernel-north-star.md) |
| Kernel Blueprint | [docs/BLUEPRINT/kernel-blueprint.md](../../BLUEPRINT/kernel-blueprint.md) |
| Legacy implementation archive | [PAS-001-KERNEL-AUTHORITY-STANDARD.md](../PAS-001-KERNEL-AUTHORITY-STANDARD.md) |
| ERP Integration Spine | [PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| Wire vocabulary catalog | [PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md](PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) |
| Family index | [KERNEL/README.md](README.md) |
| Status index | [pas-status-index.md](../pas-status-index.md) |

**Provenance:** Enterprise Accepted — composed from legacy PAS-001 closure evidence (2026-06-29).
