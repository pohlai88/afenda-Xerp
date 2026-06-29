# Slice B49 — Authority Mirror Sync (PAS-004D §4.1)

**Prerequisite:** [B48 Docs consumer projection adoption](b48-pas004c-docs-consumer-projection-adoption.md) delivered

**Status:** Delivered — mirror gate `check:knowledge-authority-mirror` registered 2026-06-29

**Type:** Governance + documentation

**Risk class:** Low — mirror surfaces only until gate lands

**Clean Core impact:** A→A — no runtime behavior change in doc-only phase

## Purpose

Close PAS-004C audit **P0 documentation mirror drift**. Introduce `pnpm check:knowledge-authority-mirror` so PAS headers, skill mirror, and pas-status-index cannot diverge again.

## Handoff block

```
Handoff from: docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b49-pas004d-authority-mirror-sync.md

1. Objective    — Sync PAS-004* mirror surfaces; add check:knowledge-authority-mirror gate; register in package.json + PKGR04 gates (delegate registry owner).
2. Allowed layer— docs/PAS/** · .cursor/skills/enterprise-knowledge/** · scripts/governance/check-knowledge-authority-mirror.mts · package.json (script only)
3. Files        —
   docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md
   docs/PAS/pas-status-index.md
   docs/PAS/README.md
   .cursor/skills/enterprise-knowledge/SKILL.md
   scripts/governance/check-knowledge-authority-mirror.mts
   scripts/governance/__tests__/check-knowledge-authority-mirror.test.ts
4. Prohibited   — foundation-disposition.registry.ts (delegate); atoms.json corpus edits; kernel edits
5. Authority    — PAS-004D §4.1 · enterprise-knowledge skill · documentation-drift guard
6. Gates        —
   pnpm check:knowledge-authority-mirror
   pnpm check:documentation-drift
7. Closes       — P0 doc mirror drift from PAS-004C closure audit
8. Evidence     — gate PASS output · synced SKILL scorecard 58/58
9. Attestation  — Documentation · Governance
```

## DoD

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | SKILL mirror shows PAS-004C **58/58** and PAS-004D queue | SKILL §PAS rollout status |
| 2 | PAS-004B §17 has no duplicate Proposed rows | PAS-004B doc |
| 3 | PAS-004C §17 lists B47–B48 | PAS-004C doc |
| 4 | `check:knowledge-authority-mirror` registered and passing | CI / shell |
| 5 | pas-status-index **Next sequence item** → B50 after B49 closes | pas-status-index |

## Mirror rules (gate enforcement target)

| Check | Expected |
| --- | --- |
| SKILL scorecard | `58/58` (until B54 extends to 70) |
| SKILL active slice | Points to B49 or next open PAS-004D slice — never B38 |
| PAS-004C remaining_slices | Superseded by PAS-004D or `none` with 004D next |
| PAS-004 runtime_status blockquote | References PAS-004C/D for live runtime |

## Registry delegation

Append `check:knowledge-authority-mirror` to PKGR04 gates via **foundation-registry-owner** when gate script lands.
