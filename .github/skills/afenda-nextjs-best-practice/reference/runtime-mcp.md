# Next.js MCP — Afenda runtime reference

## Wiring

| Item | Value |
| --- | --- |
| MCP server | `next-devtools` in `.mcp.json` |
| ERP | port **3000** · `apps/erp` |
| Docs | port **3001** · `apps/docs` |

## Tool sequence

```
nextjs_index {}
nextjs_call { port: "3000", toolName: "get_project_metadata" }
nextjs_call { port: "3000", toolName: "get_routes" }
nextjs_call { port: "3000", toolName: "get_errors" }
```

## Module route verification

After adding module surfaces:

1. `get_routes` — every `/modules/**` path must match [module-route-surface-registry.md](module-route-surface-registry.md)
2. `get_errors` — must be clean before claiming done

**Known failures (2026-06-25):**

| Type | Detail |
| ---- | ------ |
| configErrors | `turbopack.extensionAlias` unrecognized |
| sessionErrors `/` | `node:fs` via `error.tsx` → `@afenda/shadcn-studio` |

## Scaffold vs target

MCP may show **static** paths (`/modules/procurement/requisitions`) while target is **`/modules/[moduleSlug]/[surface]`**. Label drift in PR — do not treat static scaffold as architecture SSOT.

## API uncertainty

Context7: `/vercel/next.js/v16.2.9` · Vercel plugin `nextjs` skill.

## Audit

Full checklist: [app-router-audit.md](app-router-audit.md)
