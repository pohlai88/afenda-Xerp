# ARCH-DOCS-001 · Slice 22 — Phase 5 evidence-sync (async deferral)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | **Delivered** 2026-06-26 |
| **Prerequisite** | Slices 18–21 delivered |
| **Slice type** | Evidence-sync |
| **Runtime owner** | `docs/` |
| **Closes** | Gap audit Phase 5 · Fumadocs-ready 80%+ target |

---

## Design (internal-guide)

- Update `fumadocs-feature-gap-audit.md` executive summary for Slices 18–21 outcomes.
- Update slice-index Phase 5 table; mark slices Delivered with gate evidence.
- **P5 async: true — Deferred:** Document trigger in gap audit §Remaining gaps: enable only when SSG route count ≥ 50 **or** `fumadocs-mdx` cold start consistently >15s. Do **not** enable async/dynamic in this slice unless trigger met (Research-only note).
- Run `pnpm check:documentation-drift` if matrix/index rows change.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-22-phase5-evidence-sync.md

1. Objective    — Sync Phase 5 evidence: gap audit ~80%+, slice-index, async deferral criteria; no runtime code unless async trigger met.
2. Allowed layer— docs/architecture/ · docs/ARCH/slices/ARCH-DOCS-001/
3. Files        — docs/architecture/fumadocs-feature-gap-audit.md (Modified)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-22-phase5-evidence-sync.md (Modified — status)
                  docs/ARCH/[Complete] ARCH-DOCS-001-fumadocs-site.md (Modified — Phase 5 row)
4. Prohibited   — apps/** unless async trigger documented and approved in slice addendum · registry mutation
5. Authority    — ARCH-DOCS-001 · documentation-drift guard
6. Gates        — pnpm check:documentation-drift
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
7. Closes       — Phase 5 catalog · Enterprise evidence packet
8. Evidence     — gap audit metrics table · slice-index orchestration
9. Attestation  — ADR-0012 doc hygiene
```

---

## Known debt

- `docs-live-dns` operator step unchanged.
- Full zh corpus translation remains incremental beyond Slice 20.
