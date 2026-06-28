# Doc Audit — AUDIT Guide

Evidence audit, chain alignment, and drift scan for **AUDIT** intent.

← Router: [../SKILL.md](../SKILL.md) · Evidence: `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` · Boundaries: `.cursor/skills/kernel-authority/reference/doc-boundary-contract.md`

---

## Audit sequence

```text
1. code-review-and-quality     — five-axis review applied to document
2. Evidence audit              — EFR class scan (this file §1)
3. Boundary checklist          — cross-doc contamination (this file §2)
4. Chain alignment scan        — NS → Blueprint → PAS → Code (this file §3)
5. doubt-driven-development    — adversarial challenge on EFR ≥ Production
6. pas-codebase-bridge         — when PAS ↔ code drift suspected
7. pas-prohibited-surface-scan — when unclaimed code or boundary pollution
```

---

## §1 Evidence audit

### Maturity bars

| Maturity | EFR (✓ required) | EAC (✓ required) | △ allowed |
| --- | --- | --- | --- |
| Idea | Optional | Optional | Yes — label as hypothesis |
| MVP | Major capabilities | Slice DoD | Limited — upgrade path required |
| Production | All §4–§5, §9 EFR | All §11 / §16 / DoD | No ✗ assumptions |
| Enterprise | Zero ✗ in §4–§5, §9 | Zero ✗ in all EAC | Zero △ without expiry |

### EFR row scan procedure

For each EFR row in Domain NS §4–§5, §9 (and Blueprint §4 Source):

1. **Source class** — mark ✓ / △ / ✗ per `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md`
2. **Tier** — T0–T6; T4/T6 alone cannot justify Production+ EFR
3. **Reasoning** — Claim / Because / Source / Therefore present?
4. **Circular** — Source points back to same doc without upstream ADR/standard?
5. **Upgrade path** — every △ row has named upgrade action and owner?

### Output: evidence gap table

```markdown
| Location | Claim | Source | Class | Tier | Action |
| --- | --- | --- | --- | --- | --- |
| NS §4.2 Capability X | ... | ADR-0026 | ✓ | T0 | — |
| NS §5.1 Principle Y | "enterprises require..." | (none) | ✗ | — | Add T0–T3 or downgrade maturity |
| BP §4 Box Z | ... | NS §13 | ✓ | T1 | — |
```

---

## §2 Boundary checklist

Run against `.cursor/skills/kernel-authority/reference/doc-boundary-contract.md` ownership matrix.

### Common contamination patterns

| Pattern | Owner | Violation |
| --- | --- | --- |
| Package names in Domain NS §1–§12 | Blueprint/PAS | Implementation leak |
| PAS §4 surfaces in Blueprint prose | PAS §4 | Contract duplication |
| Gate commands in Domain NS §11 | PAS §13 | NFR intent vs executable gate |
| Full NS §9 paste in PAS §2 | PAS §2 distill | Boundary essay duplication |
| `@afenda/*` invented in Blueprint without registry | `package-registry.data.ts` | Dual source of truth |
| Slice DoD = PAS §11 copy | Slice session EAC | Scope creep |
| SKILL body = full PAS | PAS SSOT | Drift maintenance bomb |

### Boundary pass/fail

```markdown
| Topic | Found in | Should be in | Status |
| --- | --- | --- | --- |
| Enterprise vocabulary | PAS §4 event name | Domain NS §3 | Fail — add NS row first |
```

---

## §3 Chain alignment scan

Four layers — produce one combined table (mandatory output).

### Layer 1 — NS → Blueprint

| Check | Question |
| --- | --- |
| Orphan capability | Domain NS §4/§13 capability with no Blueprint §4 box? |
| Orphan box | Blueprint §4 box with no NS §13 capability trace? |
| Matrix gap | Blueprint §4 row without §3.1 decision matrix in Reasoning? |

### Layer 2 — Blueprint → PAS

| Check | Question |
| --- | --- |
| Box without PAS | Blueprint §4 `live`/`planned` box with no PAS in §10 inventory? |
| PAS without box | PAS exists but no Blueprint §4 row? |
| Handoff gap | PAS authored without Blueprint §9 handoff? |

### Layer 3 — PAS → Code

Route to **`pas-codebase-bridge`**:

```text
/pas-codebase-bridge docs/PAS/PAS-NNN-*.md packages/<package>/
```

| Check | Question |
| --- | --- |
| Surface drift | PAS §4 surface marked live but missing in code? |
| Doc contradiction | PAS claims live; runtime-truth-matrix says planned? |
| Gate gap | PAS §13 gate script missing or never run? |

### Layer 4 — Code → PAS

Route to **`pas-prohibited-surface-scan`** when unclaimed exports found:

| Check | Question |
| --- | --- |
| Unclaimed surface | Public export with no PAS §4 owner? |
| Prohibited ownership | Code in wrong package per PAS §2? |
| Boundary pollution | Consumer defining owned contracts? |

---

## §4 Combined alignment table (required output)

**AUDIT is not complete without this table.**

```markdown
| Layer | Item | Status | Gap/Risk | Recommended action |
| --- | --- | --- | --- | --- |
| NS→Blueprint | Capability: Period Close | Orphan | No §4 box | Add Blueprint §4 row after §3.1 |
| Blueprint→PAS | Box: Ledger | Gap | No PAS-NNN | Author PAS from §9 handoff |
| PAS→Code | Surface: journal-post | Drift | PAS live, code missing | Author slice bN-x |
| Code→PAS | export: parseFoo() | Unclaimed | No §4 owner | Add PAS §4 or prohibited scan |
| Evidence | NS §4.3 EFR | Assumption | ✗ at Production | Add ADR or T3 standard |
| SYNC | kernel-authority SKILL | Stale | Sync checksum >90d | Regen SKILL same commit |
```

### Status vocabulary

| Status | Meaning |
| --- | --- |
| **Aligned** | Trace complete · evidence ✓ · no action |
| **Orphan** | Upstream exists · downstream missing |
| **Gap** | Expected artifact missing entirely |
| **Drift** | Docs and code/runtime disagree |
| **Unclaimed** | Code exists · no doc owner |
| **Assumption** | ✗ or △ past maturity gate |
| **Stale** | Sync checksum or review date expired |

---

## §5 Drift scan (SYNC freshness)

Run during AUDIT when PAS or SKILL in scope.

| Check | Location | Fail when |
| --- | --- | --- |
| Sync checksum | `<pkg>-authority/SKILL.md` | Last synced date older than PAS amend date |
| PAS metadata | PAS header/YAML | `runtime_status` ≠ runtime-truth-matrix |
| Blueprint inventory | Blueprint §10 | Count ≠ PAS §12 delivered |
| T6 expert review | NS §12 register | Past expiry without upgrade |
| Registry lane | `foundation-disposition.registry.ts` | PAS §0 lane ≠ registry |

### Recommended gates (list in report; run when not read-only)

```bash
pnpm check:documentation-drift
pnpm check:foundation-disposition
pnpm check:legacy-delivery-terminology
pnpm check:knowledge-conformance
```

---

## §6 Doubt-driven challenge (Production+ EFR)

For every EFR row at Production or Enterprise maturity, ask:

1. **What if this source is wrong?** — Is there a stronger T0–T3 alternative?
2. **What if we don't implement this?** — Real enterprise harm with citation?
3. **Who disagrees?** — Documented alternative in ADR or decision log?
4. **Can an agent implement from this alone?** — Or does it require inference?

Record challenges in audit output — Pass / Fail / Upgrade required.

---

## §7 Risk classification summary

End every AUDIT with counts:

```markdown
| Risk class | Count | Highest severity item |
| --- | --- | --- |
| Orphan | N | ... |
| Gap | N | ... |
| Drift | N | ... |
| Unclaimed | N | ... |
| Assumption | N | ... |
| Stale | N | ... |
```

**Severity order:** Assumption (Production+) > Drift > Unclaimed > Gap > Orphan > Stale
