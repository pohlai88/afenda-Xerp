# Doc Types — AUTHOR Guide

Per doc type authoring rules for **AUTHOR** intent. Load when writing or amending governance documentation.

← Router: [../SKILL.md](../SKILL.md) · Boundaries: `.cursor/skills/kernel-authority/reference/doc-boundary-contract.md` · Evidence: `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md`

---

## Authoring sequence (all types)

```text
1. spec-driven-development     — clarify scope if vague
2. source-driven-development   — battle-proven citations before permanent claims
3. incremental-implementation  — one § at a time; verify before next §
4. doc-boundary-contract       — ownership check after each §
```

---

## Domain North Star

| Field | Value |
| --- | --- |
| **Template** | `.cursor/skills/kernel-authority/reference/north-star-template.md` |
| **Target path** | `docs/architecture/<domain>-north-star.md` |
| **Pre-fill from** | Platform NS §4 capabilities · ADR context |
| **Upstream** | Platform NS · ADR Constitution |
| **Downstream** | Architecture Blueprint §13 capability map |

### Section order (mandatory)

| Order | Section | Content |
| --- | --- | --- |
| 1 | §1 Philosophy | Why domain exists forever — before any EFR |
| 2 | §2 Identity | Mission · definition |
| 3 | §3 Vocabulary | Enterprise terms (business meaning only) |
| 4 | §4 Capabilities | EFR rows with maturity tier per capability |
| 5 | §5 Principles | Domain principles |
| 6 | §6 Outcomes + KPIs | Measurable enterprise outcomes |
| 7 | §7 Business events | Event vocabulary |
| 8 | §8 Entity lifecycles | Business state machines |
| 9 | §9 Boundary + dependencies | Owns / never owns · cross-domain deps |
| 10 | §10 Risks | Business risks |
| 11 | §11 Quality attributes | NFR intent (not gate commands) |
| 12 | §12 Evidence | Register + decision log |
| 13 | §13 Blueprint mapping | Capability → box names only |
| 14+ | §14–§19 | Governance · EAC · sync |

### Hard rules

- §1–§12 are **entirely business-facing** — no package names, PAS IDs, runtime, code
- Every EFR in §4–§5, §9: Source ✓ at Production+ maturity
- §3 terms feed PAS-004 via SYNC — do not invent atoms without NS row
- Never duplicate Blueprint §4 registry or PAS §4 surfaces

---

## Architecture Blueprint

| Field | Value |
| --- | --- |
| **Template** | `.cursor/skills/kernel-authority/reference/blueprint-template.md` |
| **Target path** | `docs/architecture/<scope>-blueprint.md` |
| **Pre-fill from** | Domain NS §13 capability map |
| **Upstream** | Domain North Star |
| **Downstream** | PAS inventory §10–§11 |

### Critical sections

| Section | Rule |
| --- | --- |
| §3.1 Architecture Decision Matrix | Run **before** any §4 box add/split/merge — record outcome in Reasoning |
| §3.2 Canonical Dependency Categories | Tag every cross-box edge: compile-time · runtime · metadata · config · knowledge |
| §4 Blueprint boxes | Box name = architectural identity; `@afenda/*` from `package-registry.data.ts` only |
| §4.2 Box Responsibility Matrix | Owns / never owns per box |
| §4.3 Change Impact Matrix | Box change → PAS · domains · packages · tests · ADR |
| §5.1 Cross-box Composition | Conceptual only — not runtime APIs |
| §9 Blueprint → PAS handoff | Required before PAS authoring |
| §10 PAS inventory | Sync from PAS §12 on slice close |

### Hard rules

- No Domain NS §1–§12 prose paste
- Every §4 row: Source + §3.1 matrix citation
- Box status: `live` / `planned` / `blocked` — not in Domain NS

---

## PAS (Package Authority Standard)

| Field | Value |
| --- | --- |
| **Template** | `.cursor/skills/kernel-authority/reference/pas-doc-template.md` · index `.cursor/skills/kernel-authority/reference/pas-template.md` |
| **Target path** | `docs/PAS/PAS-NNN-<PACKAGE>-AUTHORITY-STANDARD.md` |
| **Pre-fill from** | Blueprint §9 handoff · §4 box row |
| **Upstream** | Architecture Blueprint |
| **Downstream** | Slice catalog §12 · SKILL extract |

### Critical sections

| Section | Rule |
| --- | --- |
| §2 Boundary | Owns / never owns — distill from Blueprint §4.2, not NS paste |
| §3.4 Architectural dependencies | Kernel · Metadata · Execution · Permissions · Observability |
| §4 Authority surfaces | **Contract type** + **Stability** on every surface |
| §8 Contract rules | Breaking change → ADR + PAS update |
| §11 EAC | Every row traces to upstream EFR; gate command named |
| §12 Slice catalog | Prerequisites · one surface per implementation slice |
| §13 Gates | Named `pnpm` scripts — real, not placeholder |

### Contract classification (§4)

| Type | Examples |
| --- | --- |
| Identity | IDs, references |
| Domain | Business contracts |
| Runtime | APIs |
| Persistence | Database models |
| Integration | Events |
| Security | Permissions |
| Metadata | Configuration |
| Observability | Audit, telemetry |

| Stability | Meaning |
| --- | --- |
| Constitutional | Very rare changes |
| Stable | Production interfaces |
| Evolutionary | Planned growth |
| Experimental | MVP only |

---

## ADR

| Field | Value |
| --- | --- |
| **Constitution** | `.cursor/skills/kernel-authority/reference/adr-constitution.md` |
| **Target path** | `docs/adr/ADR-NNNN-<slug>.md` |
| **Vendor skill** | `documentation-and-adrs` |
| **Upstream** | Context · alternatives · consequences |
| **Downstream** | NS · Blueprint · PAS traceability |

### ADR checklist

- [ ] Status: Proposed → Accepted (not Accepted without T1–T3 evidence)
- [ ] Alternatives considered with rejection rationale
- [ ] Consequences: positive + negative
- [ ] Traceability: which NS § / Blueprint box / PAS § affected
- [ ] Supersession: link prior ADR if amending

---

## Slice

| Field | Value |
| --- | --- |
| **Template** | `.cursor/skills/kernel-authority/reference/pas-slice-template.md` |
| **Target path** | `docs/PAS/slice/<slug>.md` |
| **Skill** | `pas-slice-planner` |
| **Pre-fill from** | PAS §12 row · PAS §4 surface for this slice |
| **Downstream** | `@afenda-governed-implementer` via 9-field handoff |

### 9-field handoff (mandatory before implementation)

```txt
1. Slice ID
2. PAS reference
3. Authority surface
4. Allowed paths
5. Prohibited
6. Prerequisite slices
7. DoD (EAC rows tracing upstream EFR)
8. Gates
9. Rollback / escalation
```

### Hard rules

- DoD ≥3 EAC rows — each traces to upstream EFR
- One slice = one PAS §4 surface (or declared subset)
- Never copy PAS §11 verbatim into slice DoD — session-scoped EAC only

---

## Reader docs (MDX)

| Field | Value |
| --- | --- |
| **Skill** | `afenda-docs-writing` |
| **Target path** | `apps/docs/content/docs/**` |
| **Scope** | Fumadocs contract · editorial typography |

Use `afenda-docs-writing` directly for reader-facing MDX. Use this bundle only when governance chain (NS→PAS) is also in scope.

---

## Change classification (before authoring)

From `.cursor/skills/kernel-authority/reference/doc-boundary-contract.md`:

| Change | Requires |
| --- | --- |
| New business capability | Domain North Star |
| New Blueprint box | Blueprint + §3.1 matrix |
| New authority surface | PAS §4 |
| Breaking contract | ADR + PAS |
| New package | Blueprint + PAS |
| Emergency production deviation | ADR + Architecture Authority |

Stop and escalate if the change spans a higher document layer than your Phase 0 allowed layer.
