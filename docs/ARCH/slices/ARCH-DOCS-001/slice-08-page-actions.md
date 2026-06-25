# ARCH-DOCS-001 · Slice 8 — Page actions (GitHub · lastModified · copy)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Slice 7 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/src/app/docs/` |
| **Closes** | Gap audit P1 page actions · LLM-adjacent copy affordance |

---

## Design (internal-guide)

- Add `docs-github.constants.ts` — serializable `{ owner, repo, contentPathPrefix }` contract.
- Extend `[[...slug]]/page.tsx` with `getGithubLastEdit` (production only) and `ViewOptionsPopover` / copy affordance from Fumadocs page layout exports.
- Add optional `llms/` route or markdown proxy for `.mdx` copy URL if upstream pattern requires separate route file.
- Test: unit test constants shape; route smoke unchanged.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-08-page-actions.md

1. Objective    — Add GitHub edit link, last-modified footer, and markdown copy affordance on DocsPage.
2. Allowed layer— apps/docs/src/
3. Files        — apps/docs/src/lib/docs-github.constants.ts (New)
                  apps/docs/src/lib/docs-page-path.ts (New)
                  apps/docs/src/app/docs/[[...slug]]/page.tsx (Modified)
                  apps/docs/src/__tests__/docs-github.constants.test.ts (New)
                  apps/docs/src/__tests__/docs-page.test.ts (Modified)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-08-page-actions.md (Modified — status)
                  docs/ARCH/[Complete] ARCH-DOCS-001-fumadocs-site.md (Modified — Slice 8 row)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
4. Prohibited   — GitHub tokens in client bundle · @afenda/* runtime imports · ERP coupling
5. Authority    — ARCH-DOCS-001 · fumadocs-core/content/github · docs-app-architecture
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
                  pnpm exec biome check apps/docs
7. Closes       — Page actions gap · Fumadocs-ready +5%
8. Evidence     — page.tsx · constants test · typecheck
9. Attestation  — Usability · Security (no secrets client-side)
```

---

## Known debt

- Full Fumadocs CLI `ai/page-actions` block optional follow-up if upstream exports differ
