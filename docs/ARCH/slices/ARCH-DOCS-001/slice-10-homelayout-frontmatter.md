# ARCH-DOCS-001 · Slice 10 — HomeLayout + frontmatter schema

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Slice 9 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/src/app/` |
| **Closes** | Gap audit P2 HomeLayout · custom frontmatter schema |

---

## Design (internal-guide)

- Replace root redirect-only `page.tsx` with Fumadocs `HomeLayout` landing (hero + Cards to `/docs` sections).
- Extend `source.config.ts` Zod schema: `full`, `status`, `noIndex` optional fields per afenda-fumadocs skill.
- Set `full: true` on hub pages (`index.mdx`, `apps/index.mdx`) via frontmatter.
- Add `docs-home.constants.ts` for serializable home page copy (boundary-safe).

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-10-homelayout-frontmatter.md

1. Objective    — Add HomeLayout marketing landing at /; extend frontmatter schema; mark hub pages full-width.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/source.config.ts (Modified)
                  apps/docs/src/app/page.tsx (Modified)
                  apps/docs/src/lib/docs-home.constants.ts (New)
                  apps/docs/src/lib/layout.shared.ts (Modified)
                  apps/docs/content/docs/index.mdx (Modified — full frontmatter)
                  apps/docs/content/docs/apps/index.mdx (Modified — full frontmatter)
                  apps/docs/src/__tests__/docs-home.test.ts (New)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-10-homelayout-frontmatter.md (Modified — status)
                  docs/ARCH/[Complete] ARCH-DOCS-001-fumadocs-site.md (Modified — Slice 10 row)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
4. Prohibited   — @afenda/ui shell primitives · brand accent in shell chrome
5. Authority    — ARCH-DOCS-001 · afenda-fumadocs §3 · docs-editorial-palette contract
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
                  pnpm exec biome check apps/docs
7. Closes       — HomeLayout · frontmatter schema · Fumadocs-ready +5%
8. Evidence     — / route render · source.config.ts · test:run
9. Attestation  — Usability · Contract stability
```

---

## Known debt

- NotebookLayout not in scope
