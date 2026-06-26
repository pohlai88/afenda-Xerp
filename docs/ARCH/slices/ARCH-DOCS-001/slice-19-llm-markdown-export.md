# ARCH-DOCS-001 · Slice 19 — LLM markdown export

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | **Delivered** 2026-06-26 |
| **Prerequisite** | Slice 18 runtime evidence ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/` |
| **Closes** | Gap audit LLM / page actions Partial → **Adopted** |

---

## Design (internal-guide)

- Enable `postprocess.includeProcessedMarkdown: true` in `source.config.ts`.
- Add `get-llm-text.ts` using `page.data.getText('processed')`.
- Add locale-aware route `app/llms.mdx/[lang]/docs/[[...slug]]/route.ts` with `generateStaticParams`.
- Pass `markdownUrl={`${page.url}.mdx`}` to `ViewOptionsPopover`; optional `LLMCopyButton` via Fumadocs pattern.
- **Optional (P2):** middleware negotiation `isMarkdownPreferred` + `rewritePath` for `/[lang]/docs/*` → llms route (after route exists).
- Charter tests for includeProcessedMarkdown, route wiring, markdownUrl on slug page.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-19-llm-markdown-export.md

1. Objective    — Close Slice 8 LLM debt: processed markdown export, llms.mdx route, and ViewOptionsPopover markdownUrl for en+zh docs pages.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/source.config.ts (Modified)
                  apps/docs/src/lib/get-llm-text.ts (New)
                  apps/docs/src/app/llms.mdx/[lang]/docs/[[...slug]]/route.ts (New)
                  apps/docs/src/app/[lang]/docs/[[...slug]]/page.tsx (Modified)
                  apps/docs/src/middleware.ts (Modified — optional negotiation)
                  apps/docs/src/__tests__/docs-llm-export.test.ts (New)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-19-llm-markdown-export.md (Modified — status)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
                  docs/architecture/fumadocs-feature-gap-audit.md (Modified)
4. Prohibited   — Ask AI / chat routes · ERP secrets · OpenAPI MDX generator changes · @afenda/ui runtime
5. Authority    — Fumadocs integrations/llms · ARCH-DOCS-001 slice-08 known debt
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
7. Closes       — LLM / page actions Adopted · markdown copy affordance
8. Evidence     — docs-llm-export.test.ts · route returns text/markdown
9. Attestation  — Security (no secrets in markdown pipeline)
```

---

## Known debt

- `llms.txt` / `llms-full.txt` site indexes optional follow-up.
- Negotiation Accept-header rewrite optional if `.mdx` suffix sufficient.
