# ARCH-DOCS-001 · Slice 11 — TypeScript governance + gap evidence-sync

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Slices 6–10 ✓ |
| **Slice type** | Evidence-sync + Implementation (TS cleanup) |
| **Runtime owner** | `apps/docs/src/` · `docs/` |
| **Closes** | Principal TS architect objectives · Fumadocs-ready score update |

---

## Design (internal-guide)

- Principal TS pass on `apps/docs/src/**`: remove dead exports, normalize public contract exports, eliminate redundant helpers, ensure serializable constants.
- Persist gap audit matrix at `docs/architecture/fumadocs-feature-gap-audit.md` with before/after scores.
- Update ARCH-DOCS-001 Phase 2 completion row, enterprise score (target 29/30), fdr-005 §Remaining gaps if any.
- No behavior changes beyond cleanup; all gates must remain exit 0.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-11-typescript-evidence-sync.md

1. Objective    — TS governance cleanup in apps/docs; persist Fumadocs gap audit; sync ARCH + matrix evidence for Phase 2.
2. Allowed layer— apps/docs/src/ · docs/architecture/ · docs/ARCH/
3. Files        — apps/docs/src/lib/*.ts (Modified — cleanup only)
                  apps/docs/src/components/*.tsx (Modified — cleanup only)
                  docs/architecture/fumadocs-feature-gap-audit.md (New)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — Docs Fumadocs-ready note)
                  docs/ARCH/[Complete] ARCH-DOCS-001-fumadocs-site.md (Modified — Phase 2 score)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-11-typescript-evidence-sync.md (Modified — status)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
                  docs/ARCH/arch-status-index.md (Modified — Phase 2 note)
4. Prohibited   — Breaking nav contract exports · apps/erp/* · registry mutation · OpenAPI
5. Authority    — afenda-coding-session PATTERNS · ARCH-DOCS-001 · documentation-drift guard
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
                  pnpm quality:boundaries
                  pnpm exec biome check apps/docs
                  pnpm check:documentation-drift
                  pnpm check:foundation-disposition
7. Closes       — Principal TS #1–10 · Phase 2 evidence · Fumadocs-ready target 55–65%
8. Evidence     — gap audit doc · gate log · typecheck exit 0
9. Attestation  — Enterprise 9.5+ · Maintainability · Documentation traceability
```

---

## Principal TS checklist

| # | Objective | Verification |
| --- | --- | --- |
| 1 | Fix type errors | typecheck exit 0 |
| 2 | Normalize exports/imports | biome + manual review |
| 3 | Remove dead code | grep + test:run |
| 4 | Simplify generics | build-graph guards retained |
| 5 | Type-check perf | no new heavy conditional types |
| 6 | Strict best practices | no any, catch unknown |
| 7 | Serializable contracts | constants files JSON-safe |
| 8 | No circular deps | quality:boundaries |
| 9 | Backward compatibility | nav contract semver |
| 10 | Clean directory | no stale slice-APPS paths |
