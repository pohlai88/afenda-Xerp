# write-fdr — Enterprise 9.5 Benchmark Reference

> Progressive-disclosure companion to `SKILL.md`. Read when scoring an FDR, evaluating gate-critical readiness, or planning Phase 9 qualification.
>
> The correct benchmark is not "do we have every SAP/Oracle feature?" It is whether we match their **delivery discipline**.

---

## §1 — SAP / Oracle enterprise discipline → Afenda FDR guardrail

| Enterprise discipline | SAP / Oracle equivalent | Afenda FDR guardrail |
| --- | --- | --- |
| Business requirement traceability | SAP Blueprint / Oracle BRD-FDD | FDR §BRD traceability: BRD → AC → DoD → gate |
| Clean Core | SAP RISE Clean Core | No local constants, no deep imports, no consumer-side authority |
| Extension classification | SAP CEMLI / Oracle extension model | Every change classified: config / extension / integration |
| Transport safety | SAP CTS / Oracle migration control | §Rollback strategy + upgrade path required |
| Non-functional controls | ISO 25010 / enterprise NFR | FDR §NFR: performance, security, reliability, maintainability |
| Security & SoD | SAP GRC / Oracle roles | RBAC, tenant scope, RLS, audit proof, §SoD evidence |
| Go-live readiness | SOLMAN / Oracle deployment checklist | §Knowledge transfer + runbook + observability |

---

## §2 — Enterprise gates (G0–G10)

An FDR satisfies enterprise 9.5 only when all gates pass, or any missing gate is explicitly waived by ADR/registry with reason and expiry.

| Gate | Requirement | 9.5 expectation |
| --- | --- | --- |
| **G0 — Source of Truth** | Registry-first execution | Subagents must read `foundation-disposition.registry.ts`; FDR and runtime matrix cannot invent package truth |
| **G1 — Authority** | ADR + registry alignment | No package work without registry entry |
| **G2 — Clean Core** | No local hacks | No duplicated constants, no deep imports, no consumer-side authority |
| **G3 — BRD traceability** | Requirement chain | Every AC maps to BRD/internal requirement and DoD; no orphan rows |
| **G4 — Security** | RBAC / RLS / SoD | Permissions, tenant scope, audit, denial tests |
| **G5 — Data ownership** | Tables and migrations | Owner package declared; no hand-edited migrations |
| **G6 — Integration** | Inbound/outbound contracts | API/events/export surfaces documented |
| **G7 — NFR** | ISO 25010 | Performance, reliability, maintainability, security targets |
| **G8 — Testing** | Unit/integration/E2E where relevant | Test path exists, not just "planned" |
| **G9 — Operability** | Runbook + observability | Logs, audit, correlation, escalation |
| **G10 — Rollback** | Safe deployment | Rollback strategy + upgrade path |

---

## §3 — 30-point enterprise readiness score

Score each dimension **0–5**. Do not award points for prose — see §3.1 hard fail rules and §3.2 evidence grade.

| Dimension | Score | Evidence |
| --- | ---: | --- |
| Contract stability | N/5 | `<path/test/gate>` |
| Test coverage | N/5 | `<path/test/gate>` |
| Observability + audit | N/5 | `<path/test/gate>` |
| Security + RBAC + RLS | N/5 | `<path/test/gate>` |
| Documentation + BRD traceability | N/5 | `<path/test/gate>` |
| Maintainability + Clean Core | N/5 | `<path/test/gate>` |
| **Total** | **N/30** | — |

### Score thresholds

| Score | Rating |
| --- | --- |
| 29–30 | 9.5 enterprise-ready |
| 26–28 | 8.5 production-leaning |
| 22–25 | 7.5 foundation acceptable |
| 18–21 | 6.5 partial |
| < 18 | Not ready |

### Gate-critical FDR minimum

```text
Phase 9 gate-critical FDR  : minimum 26/30; no dimension below 4/5; Clean Core A or B
Accounting posting / journal: minimum 29/30; no dimension below 4/5; Clean Core A only
```

---

## §3.1 — Hard fail rules

An FDR **cannot be rated above 7.5 (22/30)** if any of these are true:

- Registry entry is missing.
- Clean Core level is D.
- Runtime evidence conflicts with the FDR claim.
- Security-negative path is missing for a governed mutation.
- A red-lane FDR has no rollback plan.
- A package uses duplicated constants or parallel authority.
- A public API/export change has no compatibility assessment.

An FDR **cannot be rated 9.5 (29+/30)** if any single dimension is below 4/5.

---

## §3.2 — Evidence grade

Every scored point must reference evidence at a defined grade. Grade determines the maximum score for that item.

| Grade | Evidence type | Max score contribution |
| --- | --- | --- |
| A | Automated gate / test / validator exits 0 | 5/5 |
| B | Runtime file path + test path with relevant assertion | 5/5 |
| C | Runtime file path only — no test | 3/5 max |
| D | ADR or doc claim only — no runtime file | 2/5 max |
| E | Prose claim without any evidence | 0 |

File existence alone is Grade C, not Grade A or B. A gate command that exits 0 is Grade A.

---

## §4 — Clean Core level definitions

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| **A** | Pure registry-driven, public contracts, no local authority, no private imports | Yes |
| **B** | Extension through approved package boundary, in dependency-registry, no duplicated constants | Yes, with evidence |
| **C** | Tactical workaround, bounded and tracked | Amber-lane only — not gate-critical |
| **D** | Local hack, duplicate constants, private import, undocumented runtime behaviour | No — hard fail |

**Rule: no red-lane or gate-critical FDR may be Clean Core C or D.**

A drop in level during a slice (e.g. A→B) must be justified in FDR §Impact analysis.

---

## §5 — Package-by-package readiness targets

Package targets are defaults. **Registry lane wins** — see §5.1.

| Package / area | Before Accounting Contracts | Before Journal Posting |
| --- | --- | --- |
| `@afenda/database` schema/RLS | 26/30 | 29/30 |
| `@afenda/kernel` context | 26/30 | 29/30 |
| `@afenda/permissions` RBAC | 26/30 | 29/30 |
| `@afenda/observability` audit | 26/30 | 29/30 |
| `apps/erp` System Admin — permission/audit control plane | 26/30 | 28/30 |
| `apps/erp` System Admin — visual settings only | 24/30 | 26/30 |
| `@afenda/auth` login/session/platform user bridge | 26/30 | 29/30 |
| `@afenda/auth` MFA / SSO / device trust | Not required | Enterprise beta requirement |
| `@afenda/ui` primitives | 24/30 | 26/30 |
| `@afenda/appshell` | 24/30 | 26/30 |
| `@afenda/feature-flags` | Not required | 24/30 before rollout |
| `apps/docs` | Not required | 24/30 before external developer beta |

---

## §5.1 — Lane overrides package defaults

Package target scores are defaults. The registry lane wins.

| Lane | Rule |
| --- | --- |
| `red-lane` | Must meet gate-critical minimum regardless of package defaults |
| `amber-lane` | Must be bounded; gaps recorded in §Remaining gaps before any new implementation |
| `green-lane` | Maintain-only unless changed; run maintenance gates |
| `blue-lane` | Cannot be required by red-lane work |
| `black-lane` | Blocked until ADR Accepted |
| `archive-lane` | Evidence only; read-only |

---

## §6 — Anti-bullshit rule

Do not award enterprise readiness points for prose.

Every point must map to **one of**:

- file path in repo
- test path with assertion
- gate command exit 0
- ADR (Accepted)
- registry entry with correct lane
- runtime matrix row marked `implemented`
- explicit waiver with owner, reason, and expiry

If evidence cannot be cited at Grade C or above, the score for that item is 0.

---

## §7 — FDR metadata fields (full set)

```yaml
status: Not started | Partially Implemented | Complete (authority only) | Complete | Maintain Only | Blocked
lane: red-lane | amber-lane | green-lane | blue-lane | black-lane | archive-lane
cleanCore: A | B | C | D
enterpriseReadiness: N/30
riskClass: Low | Medium | High
changeClass: Configuration | Extension | Modification | Localization | Integration | Report
brdReference: BRD-NNN | "internal — no BRD"
```

Status and lane are independent. Clean Core level and enterprise readiness score are separate from both.

---

## §8 — Change classification (CEMLI analog)

Every FDR must declare a change class. Modification touching auth, RLS, RBAC, audit, context, or database migrations requires **High risk class**.

| Class | Meaning | Afenda example |
| --- | --- | --- |
| Configuration | Registry/config-only change; no runtime logic | Add FDR row, update route metadata |
| Extension | New governed capability through approved package boundary | Add System Admin permissions page |
| Modification | Change to existing runtime behaviour | Change context resolver, update audit emission |
| Localization | Country/locale-specific extension | Vietnam tax label formatting |
| Integration | External API/event/storage/job connection | Trigger.dev outbox publisher |
| Report | Read-only projection/reporting surface | Audit export, compliance dashboard |
