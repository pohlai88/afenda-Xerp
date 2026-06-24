# write-fdr — Canonical Templates (v1.1)

> Copy a template; fill every placeholder. Do not leave `<!-- ... -->` stubs in committed docs.
>
> **Folder casing is enforced:** use `docs/delivery/FDR/` only. Do not create `docs/delivery/fdr/`. Case-sensitive on Linux CI.

---

## §A — FDR Delivery Doc Template

File path: `docs/delivery/FDR/[status] fdr-NNN-short-title.md`  
When status changes, rename the `[status]` prefix in the same PR as `fdr-status-index.md`.

```markdown
# fdr-NNN — <Title>

| Field | Value |
| --- | --- |
| **Status** | Not started \| Partially Implemented \| Complete (authority only) \| Complete \| Maintain Only \| Blocked |
| **FDR ID** | `fdr-NNN-short-title` |
| **Registry entry ID** | `PKG002_AUTH` (from `foundation-disposition.registry.ts`) |
| **Package** | `@afenda/<pkg>` (PKG-NNN) |
| **Lane** | <current lane from registry> |
| **Clean Core level** | A / B / C / D |
| **Risk class** | Low / Medium / High |
| **Change class** | Configuration / Extension / Modification / Localization / Integration / Report |
| **BRD reference** | `<BRD-NNN>` or "internal — no BRD" |
| **Enterprise readiness** | N/30 (evidence-backed only — see §Enterprise readiness score) |
| **Runtime evidence** | <paths or "—"> |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Enterprise controls** | <SAP/Oracle rows from enterprise-erp-standards §8> |

## §Registry link

> Read-only snapshot — authority is `foundation-disposition.registry.ts`. Do not invent fields here.

| Field | Value |
| --- | --- |
| id | `<registry entry ID>` |
| packageId | PKG-NNN |
| domain | `<domain>` |
| lane | `<lane>` |
| runtimeOwner | `<path>` |
| gates | <list> |
| prohibited | <list> |
| allowedAgents | <list> |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/<pkg>` (PKG-NNN) | <role> | `<path>` |

## Purpose

<One paragraph. Link ADR + registry entry ID.>

## Scope

**In scope**

- <item>

**Out of scope**

- <item>

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit registry constants |
| Package boundary | Implementation agent may edit only `runtimeOwner` paths |
| Shared constants | No agent may duplicate registry constants locally |
| Evidence output | Agents must output file paths + gates, not prose-only claims |
| Parallel work | Two agents may not modify the same package or registry entry in the same session |
| Conflict handling | If runtime evidence conflicts with FDR, runtime matrix + registry win |

## §Research

> Required when Status = Not started. Slice 1 = Research only. No source edits.

### Discovery questions

- <question>

### Files to inspect

| Path | Why |
| --- | --- |
| `<path>` | <reason> |

### Skills to read

- `<skill>` — <why>

## Runtime evidence (<YYYY-MM-DD>)

| Artifact | Path | Proven |
| --- | --- | --- |
| <desc> | `<path>` | Yes \| No \| Partial |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `<gap-id>` | <description> | red \| amber \| blue | <agent/package> | Slice N | <test/gate/evidence> |

## §Enterprise readiness score

> Score 0–5 per dimension. No score may be awarded from prose alone (Grade E = 0). File path only = Grade C, max 3/5. Automated gate exit 0 = Grade A, max 5/5. See ENTERPRISE-BENCHMARK.md §3.2 for evidence grade table.

| Dimension | Score | Evidence |
| --- | ---: | --- |
| Contract stability | N/5 | `<path/test/gate>` |
| Test coverage | N/5 | `<path/test/gate>` |
| Observability + audit | N/5 | `<path/test/gate>` |
| Security + RBAC + RLS | N/5 | `<path/test/gate>` |
| Documentation + BRD traceability | N/5 | `<path/test/gate>` |
| Maintainability + Clean Core | N/5 | `<path/test/gate>` |
| **Total** | **N/30** | — |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behavior | No |

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/<pkg>` | `<export>` | Yes \| No | A→A \| A→B (justify) |

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| <from enterprise-erp-standards §2> | <from §2> | `pnpm ...` | N |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion must map to a BRD ref or declare "internal".

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| <BRD-NNN> or internal | <Gherkin scenario title> | N | `pnpm ...` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Performance efficiency | P99 < 200ms for server actions | load test or benchmark path |
| Reliability | Retry + idempotency on governed mutations | test file path |
| Security | RBAC gate + RLS proof | `pnpm check:database-tenant-rls-coverage` |
| Maintainability | Biome clean, typecheck strict, 0 `any` | `pnpm ci:biome` + typecheck |
| Compatibility | No breaking public API change | backward-compat test or semver tag |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| <mutation> | Yes \| waived — Phase 9 gate | `<test path>` or ADR ref |

## Depends on

- <upstream FDR or registry entry>

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `<path>` | `@afenda/<pkg>` | New \| Modified |

## Acceptance gate

- `pnpm --filter @afenda/<pkg> typecheck`
- `pnpm check:foundation-disposition`
- <entry gates from registry>

## Acceptance criteria

```gherkin
GIVEN the actor has permission <key> from @afenda/permissions
AND operating context is resolved via resolveOperatingContext()
WHEN <action>
THEN <outcome>
AND an audit event is emitted for governed mutations
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence | file exists | [ ] |
| 2 | Tests pass | `pnpm --filter <pkg> test:run` | [ ] |
| 3 | Boundaries | `pnpm quality:boundaries` | [ ] |
| 4 | TypeScript strict | `pnpm --filter <pkg> typecheck` | [ ] |
| 5 | Biome clean | `pnpm ci:biome` | [ ] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [ ] |
| 7 | Runtime matrix updated | matrix row | [ ] |
| 8 | fdr-status-index updated | index row | [ ] |
| 9 | Drift green | `pnpm check:documentation-drift` | [ ] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |
| 11 | NFR baselines documented | §NFR section complete | [ ] |
| 12 | Impact analysis complete | §Impact analysis table filled | [ ] |
| 13 | Rollback plan present | §Rollback strategy filled | [ ] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [ ] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [ ] |
| 17 | Security negative path tested | denial test path exists | [ ] |
| 18 | Public API compatibility verified | backward-compat gate or semver tag | [ ] |
| 19 | E2E requirement satisfied or waived | E2E path or waiver row in §BRD traceability | [ ] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete | [ ] |

## Slices

### Slice 1 — Research (<title>)

**Status:** Not started  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low | Medium | High  
**Clean Core impact:** A→A | A→B (justify if drop)

#### Design

Research-only slice. Updates §Remaining gaps and runtime evidence. No source edits.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Not started] fdr-NNN-<title>.md

1. Objective    — Complete Research discovery for <package>; document gaps in §Remaining gaps.
2. Allowed layer— docs/delivery/FDR + docs/architecture/
3. Files        — docs/delivery/FDR/[status] fdr-NNN-<title>.md (Modified)
                  docs/delivery/fdr-status-index.md (Modified if status changes)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified if evidence changes)
4. Prohibited   — packages/ and apps/ source edits; registry edits; accounting runtime
5. Authority    — ADR-0014 + ADR-0016
6. Gates        — pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| N | <criterion> | `pnpm ...` |

#### Known debt

- <deferred item with ADR reference if blocked>

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Slice N | <migration down / registry restore / revert commit> | Quarterly-release-safe; no hand-edited objects |

## §Waivers

> Waivers cannot be permanent. Every waiver must have an expiry or revisit milestone.

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `<waiver-id>` | <DoD/NFR/security/E2E item> | <reason> | Architecture Authority | <date or milestone> |

## §Knowledge transfer

### Operational runbook
- <how to operate, monitor, and diagnose in production>

### Observability
- Audit log surface: `<path or @afenda/observability export>`
- Correlation ID: <how to trace a request end-to-end>

### On-call escalation
- <symptom → diagnostic step → owner>

## Verdict

**<Status>** — <one sentence summary>.
```

---

## §B — fdr-status-index row template

```markdown
| fdr-NNN | [`FDR/[status] fdr-NNN-slug.md`](FDR/...) | <Status> | PKG-NNN | <lane> | <next step> |
```

---

## §C — ADR template

File path: `docs/adr/ADR-NNNN-short-title.md`.

```markdown
# ADR-NNNN — <Title>

| Field | Value |
| --- | --- |
| **Status** | Proposed \| Accepted \| Deprecated \| Superseded |
| **Date** | YYYY-MM-DD |
| **Supersedes** | ADR-NNNN or — |

## Context

<Why this decision is needed.>

## Decision

<What was decided.>

## Consequences

<What changes as a result; what is now prohibited; what gates prove compliance.>

## Acceptance gate

- `pnpm ...` — proves ADR is satisfied
```
