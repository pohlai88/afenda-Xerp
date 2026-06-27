---
name: write-fdr
description: Authors Afenda FDR delivery docs under docs/PAS/ with enterprise 9.5 sections — NFR (ISO 25010), BRD traceability, Clean Core levels, impact analysis, rollback strategy, knowledge transfer, and 15-row DoD tables with SAP/Oracle gate mapping. Use when drafting or updating an FDR, writing ADR-0016+ delivery authority, planning package upgrade slices, or creating enterprise acceptance criteria. Replaces write-tip for all foundation and package work after 2026-06-25. Invoke with /write-fdr or attach when producing FDR delivery documentation.
disable-model-invocation: true
---

# write-fdr — FDR Delivery & Architecture Doc Authoring

> **Active for all foundation/package work (2026-06-25).** Read [`foundation-delivery-authority.md`](../../../docs/architecture/foundation-delivery-authority.md) and the registry entry before authoring.
>
> Full templates → [TEMPLATES.md](TEMPLATES.md). Enterprise gates → [enterprise-erp-standards](../enterprise-erp-standards/SKILL.md).

---

## 0 · Authority order (never invert)

```
ADR
  → foundation-disposition.registry.ts
    → package-registry.data.ts
      → docs/PAS/[status] fdr-*.md   ← you are authoring here
        → afenda-runtime-truth-matrix.md
          → docs/PAS/slice/ (archive-lane evidence only)
```

An FDR doc **never overrides** the typed registry or an ADR.

---

## 1 · Document types

| Document | When | Trigger |
| --- | --- | --- |
| **FDR delivery doc** | Scoping or upgrading a foundation/domain package | `/write-fdr fdr-NNN` |
| **ADR** | Binding architectural decision | `/write-fdr ADR` |
| **Runtime matrix update** | After implementation lands | `/write-fdr runtime` |
| **fdr-status-index update** | When FDR status or sequence changes | Same PR as FDR doc |

---

## 2 · FDR delivery doc — workflow

### Step 1 — Pre-flight

```
1. Read foundation-disposition.registry.ts — find entry by packageId/domain (or plan new entry with foundation-registry-owner)
2. Read afenda-runtime-truth-matrix.md — current status + evidence
3. Read package-registry.md — confirm PKG-NNN and package name
4. Read enterprise-erp-standards/SKILL.md §2 + §8 — identify SAP/Oracle controls for this domain
5. Read enterprise-erp-standards/SKILL.md §10–§13 — identify Clean Core level + NFR profile + SoD requirements
6. Check docs/PAS/ for existing FDR; update don't recreate
7. Read fdr-status-index.md — confirm FDR appears in §FDR catalog
```

### Step 2 — Required fields

```
FDR ID            : fdr-NNN-<domain-slug> — NNN MUST match owning PKG-NNN (or r01 for PKG-R01)
                  Multiple FDRs per PKG allowed (e.g. PKG-013 → fdr-013-audit-coverage + fdr-013-logging-tracing)
                  Must exist in fdr-status-index.md §FDR register before authoring
Registry entry ID : e.g. PKG002_AUTH (from foundation-disposition.registry.ts; optional for sibling FDRs on same PKG)
Title             : Short descriptive title
Current status    : Not started | Partially Implemented | Complete (authority only) | Complete | Maintain Only | Blocked
Target lane       : from registry or planned lane after upgrade
Owning package(s) : from package-registry.md
Runtime evidence  : file paths that prove current status
Remaining gaps    : in FDR §Remaining gaps — NOT in registry knownGaps (deprecated)
Enterprise controls: SAP/Oracle rows from enterprise-erp-standards §2 + §8
Clean Core level  : A / B / C / D (from enterprise-erp-standards §10)
Risk class        : Low / Medium / High (High requires peer review before merge)
BRD reference     : upstream requirement ID or "internal — no BRD"
```

### Step 3 — Draft using canonical template

Full template → [TEMPLATES.md §A](TEMPLATES.md). Required sections:

| Section | Required | Notes |
| --- | --- | --- |
| Metadata table | Yes | FDR ID + Registry entry ID separate; Source of truth row; Clean Core level; enterprise readiness N/30 |
| §Registry link | Yes | Read-only snapshot — never invent fields |
| Package ownership | Yes | Before Purpose; establishes edit boundary immediately |
| Purpose | Yes | ADR authority link |
| Scope (In / Out) | Yes | |
| **§Subagent concurrency rules** | Yes | Ownership, parallel work, conflict rules |
| **§Research** | Yes when Not started | Discovery only; no source edits |
| Runtime evidence | Yes | path → proven Y/N |
| **§Remaining gaps** | Yes | Expanded: owner, target slice, close condition |
| **§Enterprise readiness score** | Yes | 30-pt breakdown; every point evidence-backed |
| **§Clean Core classification** | Yes | A–D inline definitions + hard rule |
| **§Impact analysis** | Yes | Upstream consumers, breaking change, Clean Core impact |
| §Enterprise acceptance | Yes | SAP/Oracle → Afenda gate table |
| **§BRD traceability** | Yes | No orphan AC rows |
| **§NFR** | Yes | ISO 25010 characteristics with targets |
| §SoD evidence | Yes for amber-lane+ | Approver ≠ initiator evidence |
| Deliverables | Yes | concrete file paths |
| Acceptance gate | Yes | pnpm commands |
| Acceptance criteria | Yes | Gherkin |
| Definition of Done | Yes | 20 rows; each maps to enterprise gate |
| Slices | Yes when Partially Implemented / Not started | write-fdr-slice format |
| **§Rollback strategy** | Yes for Implementation slices | Executable procedure — not prose-only |
| **§Waivers** | When any DoD/NFR row is waived | Expiry or revisit milestone required |
| **§Knowledge transfer** | Yes for Complete / Maintain Only | Runbook + observability links |
| Verdict | Yes | |

### Step 4 — Status vocabulary

| Value | Meaning |
| --- | --- |
| `Not started` | No runtime evidence; Research slice required first |
| `Partially Implemented` | Evidence exists; gaps in §Remaining gaps |
| `Complete (authority only)` | Contracts/governance only; no runtime by design |
| `Complete` | Evidence + all gates pass |
| `Maintain Only` | Green lane; no upgrade slices scheduled |
| `Blocked` | ADR or black-lane dependency missing |

---

## 3 · File path planning — boundary rules

Same as write-tip §3:

- Edit only paths under `runtimeOwner` from registry entry
- Cross-package imports must appear in dependency-registry
- No local permission constants in consumers
- Registry edits → foundation-registry-owner only

---

## 4 · Acceptance criteria — Gherkin + enterprise gates

Every Gherkin scenario must reference at least one gate from enterprise-erp-standards §2.

Required GIVEN clauses for Afenda enterprise features:

- `GIVEN the actor has permission <key> from @afenda/permissions`
- `GIVEN operating context is resolved via resolveOperatingContext()`
- `GIVEN the mutation emits an audit event via @afenda/observability` (for governed mutations)

---

## 5 · Definition of Done table

| # | Criterion | Verification | Enterprise control |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | File exists | SOLMAN |
| 2 | Acceptance criteria pass | `pnpm --filter <pkg> test:run` | Oracle FDD |
| 3 | No boundary violations | `pnpm quality:boundaries` | SAP namespace |
| 4 | TypeScript strict | `pnpm --filter <pkg> typecheck` | SAP ATC |
| 5 | Biome clean | `pnpm ci:biome` | SAP ATC |
| 6 | Registry entry aligned | `pnpm check:foundation-disposition` | Oracle CEMLI |
| 7 | Runtime matrix updated | matrix row | SOLMAN |
| 8 | fdr-status-index updated | index row | SOLMAN |
| 9 | Drift guard green | `pnpm check:documentation-drift` | SOLMAN |
| 10 | §11 Completion Report + enterprise attestation | afenda-coding-session §11 | Oracle FDD |
| 11 | NFR baselines documented | FDR §NFR section with targets | ISO 25010 |
| 12 | Impact analysis complete | §Impact analysis table filled | SAP CTS |
| 13 | Rollback plan documented | §Rollback strategy present | SAP transport rollback |
| 14 | Peer review evidence | PR approved by Architecture Authority member | Oracle FDD sign-off |
| 15 | Clean Core level declared | metadata + §Registry link aligned | SAP Clean Core |
| 16 | No duplicated constants / no parallel authority | `pnpm check:foundation-disposition` | Clean Core |
| 17 | Security negative path tested | denial test path exists | SAP GRC / Oracle roles |
| 18 | Public API compatibility verified | export/API gate or semver tag | SAP ATC / Oracle FDD |
| 19 | E2E requirement satisfied or waived | E2E path or waiver row in §BRD traceability | Go-live readiness |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete in FDR doc | SOLMAN / Oracle sign-off |

---

## 6 · ADR authoring

Unchanged from write-tip §6. File path: `docs/adr/ADR-NNNN-short-title.md`.

---

## 7 · Runtime truth update

After any slice that changes runtime evidence, update `afenda-runtime-truth-matrix.md` in the same PR.

---

## 8 · Consistency rules for subagents

1. Read registry before FDR before coding
2. Read enterprise-erp-standards for red/amber/blue lanes
3. Never use tip-status-index as implementation authority
4. Never duplicate registry constants in FDR prose — link to registry entry ID
5. Gap tracking in FDR §Remaining gaps only

---

## 9 · §Research section (mandatory for Not started)

When status = `Not started`, Slice 1 must be Research only:

```markdown
## §Research

> Manual discovery — no implementation until Research slice Complete.

### Discovery questions
- <question 1>
- <question 2>

### Files to inspect
- `<path>` — <why>

### Skills to read
- `<skill-name>` — <why>

### Expected outputs
- Updated §Remaining gaps
- Updated runtime evidence table
- Slice 2 handoff (implementation) — only if gaps are bounded
```

Research slice §3 Files: FDR doc, fdr-status-index, runtime matrix only. **Prohibited:** `packages/` and `apps/` source edits.

---

## 10 · Handoff to implementation

Paste into afenda-coding-session Phase 0:

```
Handoff from: docs/PAS/[status] fdr-NNN-<slug>.md

1. Objective    — <one sentence; close §Remaining gap or Research discovery>
2. Allowed layer— <runtimeOwner from registry>
3. Files        — <Deliverables rows for this slice only>
4. Prohibited   — <prohibited[] from registry + ADR-0010 accounting runtime>
5. Authority    — <authority from registry + ADR>
6. Gates        — <gates[] from registry + entry-specific pnpm commands>
```

For multi-slice FDRs: one handoff per coding session. Use write-fdr-slice to author slice blocks.

---

## 11 · Enterprise attestation (Completion Report)

Every implementation session must include (from enterprise-erp-standards §9):

```text
Enterprise attestation:
- Registry entry: <FDR_ID>  lane: <lane>
- Clean Core level: <A|B|C|D>
- Enterprise readiness: <N>/30  (Contract N/5 · Test N/5 · Observability N/5 · Security N/5 · Documentation N/5 · Maintainability N/5)
- SAP/Oracle controls satisfied: <list>
- Gates run (exit 0): <list>
- §Remaining gaps closed: <ids or none>
- SoD evidence: <path or "waived — Phase 9 gate">
```

---

## 12 · SAP Activate phase alignment

Map FDR status to SAP Activate phases so Q-Gate questions map directly:

| FDR status | SAP Activate phase | Agent action |
| --- | --- | --- |
| `Not started` | Prepare | Research slice required |
| Research slice in progress | Explore | Discovery only — no source edits |
| `Partially Implemented` | Realize | Implementation slices close §Remaining gaps |
| `Complete` | Deploy / Run | All DoD rows `[x]`; §Knowledge transfer filled |
| `Maintain Only` | Run (6-month cycle) | Maintenance gates only |

---

## 13 · BRD / requirement traceability

Every FDR must include a traceability table linking upstream requirements to verifiable gates:

```markdown
## §BRD traceability

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| <BRD-NNN> or internal | Gherkin scenario title | N | `pnpm ...` |
```

Oracle FDD analog: every design element traces to a BRD requirement. No orphan AC rows.

---

## 14 · Non-functional requirements (NFR)

Required section. Map ISO/IEC 25010 characteristics to targets and verification (see enterprise-erp-standards §11).

```markdown
## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Performance efficiency | P99 < 200ms for server actions | load test or benchmark path |
| Reliability | Retry + idempotency on governed mutations | test file path |
| Security | RBAC gate + RLS proof | `pnpm check:database-tenant-rls-coverage` |
| Maintainability | Biome clean, typecheck strict, 0 `any` | `pnpm ci:biome` + typecheck |
| Compatibility | No breaking public API change | backward-compat test or semver tag |
```

Remove rows not applicable; add domain-specific rows (e.g. Usability for UI FDRs).

---

## 15 · Impact analysis

Complete before authoring any Implementation slice:

```markdown
## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/<pkg>` | `<export>` | Yes / No | A→A / A→B (justify) |
```

- **Upstream consumers scan:** which packages import the target package
- **Breaking change assessment:** is the public API surface changing?
- **Upgrade stability:** does this change drop the Clean Core level?

---

## 16 · Rollback strategy + upgrade path

Required for every Implementation slice:

```markdown
## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Slice N | <migration down / registry restore / revert commit> | Quarterly-release-safe; no hand-edited objects |
```

Oracle analog: confirm upgrade-safe (no internal object modifications). SAP analog: transport rollback plan.

---

## 17 · Knowledge transfer / operational runbook

Required for `Complete` status declaration:

```markdown
## §Knowledge transfer

### Operational runbook
- <how to operate, monitor, and diagnose in production>

### Observability
- Audit log surface: `<path or @afenda/observability export>`
- Correlation ID: `<how to trace a request end-to-end>

### On-call escalation
- <symptom → diagnostic step → owner>
```

SAP SOLMAN go-live analog. Oracle go-live checklist analog.

---

## 18 · Enterprise 9.5 benchmark rule

An FDR is considered 9.5 enterprise-ready only when all ten conditions are satisfied:

1. Enterprise readiness score is at least 29/30.
2. No dimension is below 4/5.
3. Clean Core level is A or B.
4. All red-lane gaps are closed.
5. Security negative tests exist or are explicitly waived.
6. Rollback strategy is executable, not prose-only.
7. Runtime evidence paths exist and are cited.
8. Registry entry and FDR metadata match.
9. BRD traceability has no orphan acceptance criteria.
10. Knowledge transfer section is complete for any `Complete` or `Maintain Only` FDR.

Full scoring table, gate definitions, and package-by-package targets → [ENTERPRISE-BENCHMARK.md](ENTERPRISE-BENCHMARK.md).

---

## 19 · Anti-bullshit rule

Do not award enterprise readiness points for prose.
Every point must map to:

- file path in repo
- test path with assertion
- gate command exit 0
- ADR (Accepted)
- registry entry with correct lane
- runtime matrix row marked `implemented`
- or explicit waiver with owner and reason

If evidence cannot be cited, the score for that item is 0 — not "assumed OK".

---

## References

- Registry: `packages/architecture-authority/src/data/foundation-disposition.registry.ts`
- Workflow: `docs/architecture/foundation-delivery-authority.md`
- Index: `docs/PAS/README.md`
- Enterprise: `.cursor/skills/enterprise-erp-standards/SKILL.md`
- Benchmark: [ENTERPRISE-BENCHMARK.md](ENTERPRISE-BENCHMARK.md) — 10 gates, 30-pt scoring, package targets
- Slice authoring: `.cursor/skills/write-fdr-slice/SKILL.md`
- Implementation: `.cursor/agents/fdr-slice-implementer.md`
