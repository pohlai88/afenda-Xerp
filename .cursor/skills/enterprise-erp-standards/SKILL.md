---
name: enterprise-erp-standards
description: Encodes SAP/Oracle delivery discipline as concrete Afenda guardrails — 30-point enterprise readiness scoring, 10 enterprise gates (G1–G10), Clean Core levels A–D, ISO/IEC 25010 NFRs, DORA targets, SoD evidence, and package-by-package targets. Use before touching red-lane or amber-lane packages, when evaluating Phase 9 readiness, or when authoring PAS docs at enterprise 9.5 benchmark. Full scoring and package targets in pas-slice-planner/ENTERPRISE-BENCHMARK.md.
disable-model-invocation: true
paths:
  - packages/**
  - apps/erp/**
  - docs/PAS/**
---

# Enterprise ERP Standards (SAP / Oracle Benchmark)

> Read this skill before working on any `red-lane` or `amber-lane` entry in `foundation-disposition.registry.ts`.
> Authority: ADR-0014 · Registry: `packages/architecture-authority/src/data/foundation-disposition.registry.ts`

---

## 0 · When to use

| Trigger | Action |
| --- | --- |
| Subagent touches `red-lane` or `amber-lane` package | Read §2 benchmark table + §3 go-live criteria first |
| Evaluating Phase 9 accounting readiness | Run §3 gates; no red-lane open gaps |
| User asks "enterprise quality" or "SAP/Oracle standard" | Cite §2 mapping — never invent a score |
| Claiming implementation complete | Every DoD row must map to a `pnpm` gate from §2 |

---

## 1 · Principle

Enterprise quality is **not a vibe score**. It is a set of provable gates equivalent to SAP Solution Manager sign-off and Oracle Fusion readiness checklists.

Afenda maps each enterprise standard to a **concrete command or registry state**.

The correct benchmark is not "do we have every SAP/Oracle feature?" It is whether we match their **delivery discipline**:

| Enterprise discipline | SAP / Oracle equivalent | Afenda PAS guardrail |
| --- | --- | --- |
| Business requirement traceability | SAP Blueprint / Oracle BRD-FDD | PAS §BRD traceability: BRD → AC → DoD → gate |
| Clean Core | SAP RISE Clean Core | No local constants, no deep imports, no consumer-side authority |
| Extension classification | SAP CEMLI / Oracle extension model | Every change classified: config / extension / integration |
| Transport safety | SAP CTS / Oracle migration control | §Rollback strategy + upgrade path required |
| Non-functional controls | ISO 25010 / enterprise NFR | PAS §NFR: performance, security, reliability, maintainability |
| Security & SoD | SAP GRC / Oracle roles | RBAC, tenant scope, RLS, audit proof, §SoD evidence |
| Go-live readiness | SOLMAN / Oracle deployment checklist | §Knowledge transfer + runbook + observability |

---

## 2 · SAP / Oracle → Afenda gate mapping

| Enterprise standard | What it means | Afenda gate |
| --- | --- | --- |
| SAP ATC zero violations | Static analysis clean | `pnpm ci:biome` + `pnpm typecheck` |
| SAP Authorization Objects | Every transaction has auth check | `pnpm check:api-contracts` |
| SAP Change Transport System | No direct DDL | `pnpm quality:migrations` |
| SAP Namespace Governance | No unregistered packages | `pnpm quality:architecture` |
| SAP HANA Row-Level Security | Tenant/company/org isolation | `pnpm check:database-tenant-rls-coverage` |
| SAP Fiori UX | Accessible, semantic, keyboard-navigable UI | `pnpm ui:guard` |
| SAP Solution Documentation (SOLMAN) | Docs match runtime | `pnpm check:documentation-drift` |
| SAP AIF integration contracts | Documented API envelopes | `pnpm check:api-contracts` |
| Oracle CEMLI classification | Customization lane documented | `pnpm check:foundation-disposition` |
| Oracle FDD testable AC | Gherkin + DoD with gates | `pas-slice-planner` §4 / registry `gates` field |
| Oracle SoD | No self-approval of mutations | Kernel `ApprovalContext` (amber-lane — not Phase 9 blocker) |
| Oracle Data Security | Cross-company isolation | `pnpm check:database-tenant-rls-coverage` |
| Oracle Advanced Controls | Audit on sensitive mutations | `pnpm quality:erp-observability` + PKG013_AUDIT gates |
| Oracle Fusion REST | Envelope, errors, pagination | `pnpm check:api-contracts` |
| SAP Activate Q-Gate CQC | Phase checkpoint before next delivery phase | `pnpm check:foundation-disposition` + `pnpm check:documentation-drift` |
| Oracle FDD BRD traceability | Requirement → AC → DoD → gate chain documented | PAS §BRD traceability table (pas-slice-planner §13) |
| ISO/IEC 25010:2023 NFRs | Product quality characteristics with targets | PAS §NFR section + `pnpm ci:biome` + `pnpm typecheck` |
| DORA elite slice velocity | Change lead time < 1 day for green-lane slices | Slice delivered in single session; gates exit 0 |

---

## 3 · Phase 9 enterprise go-live criteria

Accounting agents may run only when **all** pass:

```
1. No red-lane entry in foundation-disposition.registry.ts (lane promotion blocked while red).
2. pnpm check:api-contracts — RBAC on all governed routes.
3. pnpm quality:erp-observability — audit on governed mutations.
4. pnpm check:database-tenant-rls-coverage — tenant RLS proofs.
5. pnpm quality:migrations — no hand-edited DDL.
6. pnpm check:documentation-drift — runtime and docs in sync.
7. pnpm ui:guard — zero className on @afenda/ui primitives in consumers.
8. pnpm check:foundation-disposition — registry validator green.
9. pnpm quality:architecture — no unregistered packages.
10. pnpm ci:biome — zero lint/format violations.
```

---

## 4 · Enterprise incomplete signals

Do **not** claim completion when any of these are true:

- Any `red-lane` entry exists without PAS §Remaining gaps closure plan.
- A nav item or registry claims a route that has no `page.tsx` or API handler.
- A consumer defines local permission constants instead of `@afenda/permissions`.
- Server actions resolve tenant scope from session without `resolveOperatingContext()`.
- A governed mutation has no audit event emission.
- TIP delivery doc status contradicts runtime matrix (TIP is archive evidence only).

---

## 5 · Subagent pre-flight (mandatory)

Before editing foundation code:

```
1. Read foundation-disposition.registry.ts — find your entry by package/domain.
2. Confirm your agent ID is in allowedAgents.
3. Respect prohibited rules for that entry.
4. Run gates listed on the entry after implementation.
5. Post afenda-coding-session §11 Completion Report with evidence paths.
```

Only `foundation-registry-owner` may edit the registry itself.

---

## 6 · Enterprise readiness dimensions (for reporting only)

When reporting status, use these six dimensions (1–5 each). **Do not use a single score as a gate.**

| Dimension | 5 = ready | 1 = not ready |
| --- | --- | --- |
| Contract stability | Public API frozen; no drift | Ad-hoc exports; breaking changes |
| Test coverage | Happy + error paths gated in CI | Smoke only or missing |
| Observability | Audit + correlation on all protected paths | Logging only |
| Security | RBAC + RLS + tenant isolation proven | Partial guards |
| Documentation | Registry + runtime matrix in sync | Markdown claims without evidence |
| Maintainability | Biome clean, typecheck strict, 0 `any`, no dead code | Lint violations; unsafe casts |

Target for Phase 9 sign-off: **4+ on all dimensions for green-lane entries**; red-lane must reach 4+ before lane promotion.

---

## 7 · Per-lane SAP/Oracle analogs

| Lane | SAP analog | Oracle analog | Agent rule |
| --- | --- | --- | --- |
| `red-lane` | ATC blocker + transport hold | CEMLI hold | Close PAS §Remaining gaps first — no implementation |
| `amber-lane` | Bounded correction transport | Limited-scope CR | Gap closure only — no scope expansion |
| `green-lane` | Released transport | Production-ready | Consume; run maintenance gates |
| `blue-lane` | Sandbox namespace | Incubation pod | No production dependency |
| `black-lane` | Change request required | ADR approval gate | Stop until ADR Accepted |
| `archive-lane` | Project archive | Evidence store | Read-only (TIP docs) |

---

## 8 · Per-domain control mapping

| PAS domain | SAP control | Oracle control | Required gates |
| --- | --- | --- | --- |
| `system-admin` | Auth objects + audit | Advanced Controls | `check:system-admin-mutation-audit`, `quality:erp-observability` |
| `operating-context` | HANA RLS | Data Security | `check:multi-tenancy-context-integration`, RLS coverage |
| `auth` | Auth objects / Logon | Identity Governance | `better-auth-erp` discipline, `check:api-contracts` |
| `audit-coverage` | SOLMAN diagnostics | Advanced Controls | `quality:erp-observability` |
| `rbac` | Authorization objects | RBAC policies | `check:api-contracts`, permissions surface |
| `governed-primitives` | Fiori UX | Fusion UX | `pnpm ui:guard` |
| `accounting-contracts` | FI config (design) | Financials setup | `check:accounting-domain-contracts` |
| `persistence` | CTS / no DDL | Change management | `quality:migrations`, `check:database-tenant-rls-coverage` |
| `outbox-jobs` | AIF / RFC | Oracle AQ | execution test gates, `quality:boundaries` |
| `rollout-flags` | Transport variants | Oracle Profiles | typecheck until ERP proof |
| `tenant-storage` | Storage partitioning | Storage namespace | RLS gates when proven |

---

## 9 · Completion Report enterprise attestation

Every §11 on foundation/PAS work must include:

```text
Enterprise attestation:
- Registry entry: <FDR_ID>  lane: <lane>
- SAP/Oracle controls satisfied (§2 + §8): <list>
- Gates run (all exit 0): <gates[] from entry + slice>
- §Remaining gaps closed this session: <gap-ids or none>
- Dimensions (§6):
    Contract stability  : N/5
    Test coverage       : N/5
    Observability       : N/5
    Security            : N/5
    Documentation       : N/5
    Maintainability     : N/5
- Clean Core level: <A|B|C|D> (§10)
- SoD evidence: <path or "waived — Phase 9 gate">
```

---

## 10 · Clean Core level analog (SAP RISE extensibility)

Every PAS slice must declare its Clean Core analog level in the metadata table. Levels must be determined by evidence, not by declaration.

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| **A** | Pure registry-driven, public contracts, no local authority, no hacks | Yes |
| **B** | Extension through approved package boundary, in dependency-registry, no breaking consumers | Yes, with evidence |
| **C** | Tactical workaround, bounded and tracked, `prohibited[]` referenced | Amber-lane only — not gate-critical |
| **D** | Local hack, duplicate constant, private import, undocumented runtime behaviour | No — stop |

**Hard rule: no red-lane or gate-critical PAS slice may be Clean Core C or D.**

A drop in level during a slice (e.g. A→B) must be justified in PAS §Impact analysis.

---

## 11 · ISO/IEC 25010:2023 NFR characteristic mapping

Map product-quality characteristics to Afenda gates. PAS §NFR must document targets for applicable rows.

| Characteristic | Subcharacteristic focus | Afenda gate / evidence |
| --- | --- | --- |
| Functional suitability | Completeness, correctness | Gherkin AC + `pnpm --filter <pkg> test:run` |
| Performance efficiency | Time behaviour | P99 target in PAS §NFR; load test or benchmark path |
| Compatibility | Interoperability, co-existence | `pnpm quality:boundaries`; backward-compat test |
| Usability | Accessibility, operability | `pnpm ui:guard` |
| Reliability | Fault tolerance, recoverability | Retry/idempotency test; rollback in §Rollback strategy |
| Security | Confidentiality, integrity | `pnpm check:api-contracts`, RLS coverage |
| Maintainability | Modularity, analysability | `pnpm ci:biome` + `pnpm typecheck` |
| Portability | Adaptability | No hand-edited migrations; `pnpm quality:migrations` |
| Safety | Operational constraint | ADR-0010 accounting gate; prohibited[] compliance |

---

## 12 · DORA delivery performance targets

Slice velocity targets aligned with DORA research (2026 edition).

| Band | Change lead time | Deploy frequency | Change fail rate | Recovery time |
| --- | --- | --- | --- | --- |
| Elite | < 1 day | Daily+ | < 5% | < 1 hour |
| High | < 1 week | Weekly | < 10% | < 1 day |
| Medium | < 1 month | Monthly | < 15% | < 1 week |

**PAS slice targets:** green-lane → Elite; amber-lane → High; red-lane → close gaps before velocity claims.

---

## 13 · SoD (Segregation of Duties) evidence requirements

Required for amber-lane and above. Records evidence path in PAS §SoD evidence.

- Every governed mutation must declare approver ≠ initiator via `ApprovalContext`, or declare `"SoD waived — Phase 9 gate"`.
- Evidence path: test file proving dual-control, or ADR reference for waiver.
- Oracle Advanced Controls analog — audit event must record both actor and approver when approval is required.

---

## References

- Registry: `packages/architecture-authority/src/data/foundation-disposition.registry.ts`
- ADR: `docs/adr/ADR-0014-foundation-disposition-registry.md`
- Afenda coding session: `.cursor/skills/afenda-coding-session/SKILL.md`
- PAS authoring: `.cursor/skills/pas-slice-planner/SKILL.md`
- Benchmark detail: `.cursor/skills/pas-slice-planner/ENTERPRISE-BENCHMARK.md` — 10 gates, 30-pt scoring, package targets, anti-bullshit rule
- PAS workflow: `docs/PAS/README.md`
