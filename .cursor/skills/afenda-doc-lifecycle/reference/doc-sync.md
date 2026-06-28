# Doc Sync — SYNC Guide

SKILL regeneration, vocabulary promotion, CI gates, and inventory sync for **SYNC** intent.

← Router: [../SKILL.md](../SKILL.md) · SKILL template: `.cursor/skills/kernel-authority/reference/pas-skill-template.md` · Extract map: `.cursor/skills/kernel-authority/reference/pas-template.md`

---

## When to use SYNC

- PAS amended and `<package>-authority/SKILL.md` must regenerate
- Domain NS §3 term ready for PAS-004 knowledge atom promotion
- PAS §13.1 gate needs wiring to existing `pnpm check:*` scripts
- Slice closed and Blueprint §10 inventory must sync from PAS §12

**When NOT to use SYNC:** authoring new doc sections (→ AUTHOR) · auditing quality or drift (→ AUDIT)

---

## Sub-flow A — SKILL regeneration (PAS → SKILL)

1. `Read` PAS doc + `.cursor/skills/kernel-authority/reference/pas-template.md` (PAS → SKILL generation model).
2. Extract per map:

| PAS section | SKILL destination |
| --- | --- |
| §2 Boundary | SKILL.md verbatim block |
| §3.2 + §5 Hard stops | SKILL.md |
| §3.4 Dependencies | SKILL.md summary table |
| §4 Surfaces | `reference/authority-surfaces.md` |
| §6 Structure | `reference/package-structure.md` |
| §7 Decision matrix | SKILL.md |
| §13.1 Gates | SKILL.md |
| §15 Doctrine | SKILL.md |
| All extracted rows | `## Sync checksum` dates |

3. Update `## Sync checksum` — **same commit** as PAS change.
4. SKILL ≤350 lines; no `[From PAS §X]` placeholders.
5. Never paste full PAS body into SKILL.

**Route:** `.cursor/skills/kernel-authority/reference/pas-skill-template.md`

---

## Sub-flow B — PAS-004 vocabulary promotion

→ Read and apply `.cursor/skills/enterprise-knowledge/SKILL.md`

1. Domain NS §3 term must exist before atom promotion.
2. Atom gets PAS-004 registration slice.
3. Do not invent business meaning in PAS-004 without NS §3 row.

---

## Sub-flow C — CI gate wiring

→ Pattern from vendor `ci-cd-and-automation` — map PAS §13.1 to existing scripts only:

```bash
pnpm check:documentation-drift
pnpm check:foundation-disposition
pnpm check:legacy-delivery-terminology
pnpm check:knowledge-conformance
```

Do not invent new gate script names without PAS §13.1 amendment.

---

## Sub-flow D — Blueprint inventory sync

On slice **Delivered**:

| Update | Location |
| --- | --- |
| Slice row status + date | PAS §12 |
| `Delivered slices` · `Remaining slices` | PAS metadata |
| `Live / Total slices` | Blueprint §10 only — not Domain NS |
| Continuation queue | `docs/PAS/pas-status-index.md` |
| Runtime status changed | Regenerate SKILL (Sub-flow A) |

---

## SYNC verification

- [ ] Sync checksum dates updated in same commit as PAS
- [ ] `pnpm check:documentation-drift` passes (or listed as recommended if read-only)
- [ ] Vocabulary atom has PAS-004 registration when promoted
- [ ] Blueprint §10 counts match PAS §12 if slice closed
- [ ] No SKILL edited without PAS SSOT change in same commit
