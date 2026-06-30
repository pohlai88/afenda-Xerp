# Next.js MCP — Afenda runtime reference

## Wiring

| Item | Value |
| --- | --- |
| MCP server | `next-devtools` in `.mcp.json` |
| CLI package | `next-devtools-mcp@latest` |
| ERP dev URL | `http://localhost:3000` |
| Docs dev URL | `http://localhost:3001` |
| ERP project path | `apps/erp` |
| Docs project path | `apps/docs` |

## Tool sequence

### Discovery

```
nextjs_index {}
```

Returns port, PID, URL, and tool schemas. ERP = 3000, Docs = 3001 when both dev servers run.

### Project metadata

```
nextjs_call { port: "3000", toolName: "get_project_metadata" }
```

Expect: `{ projectPath: ".../apps/erp", devServerUrl: "http://localhost:3000" }`

### Route inventory

```
nextjs_call { port: "3000", toolName: "get_routes" }
```

Optional: `args: { routerType: "app" }` (pass as object, not string).

**After structural changes:** compare output to [project-structure.md](project-structure.md). Route groups like `(protected)` must not appear in URLs.

**Last MCP inventory (2026-06-25):** 8 UI routes, 20 API routes including `/modules/accounting/standards-readiness`.

### Error diagnostics

```
nextjs_call { port: "3000", toolName: "get_errors" }
```

Returns `configErrors`, `sessionErrors` (build + runtime per URL). **Gate:** zero errors on touched routes before claiming done.

**Known failures (2026-06-25):**

| Type | Message |
|------|---------|
| configErrors | `turbopack.extensionAlias` unrecognized in `next.config.ts` |
| sessionErrors `/` | `node:fs` via `error.tsx` → `@afenda/shadcn-studio` barrel |

See [app-router-audit.md](app-router-audit.md) for remediation.

### Page metadata

```
nextjs_call { port: "3000", toolName: "get_page_metadata" }
```

Requires an active browser session on the target page.

### Dev logs

```
nextjs_call { port: "3000", toolName: "get_logs" }
```

Returns log file path — read with Read tool.

### Server Action lookup

```
nextjs_call { port: "3000", toolName: "get_server_action_by_id", args: { actionId: "..." } }
```

## When MCP is unavailable

1. Confirm Next.js ≥ 16 (`apps/erp/package.json` catalog)
2. Start: `pnpm --filter @afenda/erp dev`
3. Retry `nextjs_index` with explicit `port`
4. Fallback: filesystem scan under `apps/erp/src/app/` — **not** a substitute for `get_errors`

## Docs MCP (API uncertainty)

For Next.js API behavior not visible at runtime:

1. Context7: `resolve-library-id` → `query-docs` for `/vercel/next.js/v16.2.9`
2. Vercel plugin skill: `nextjs` (App Router, Cache Components, proxy)

## Audit workflow

1. `get_routes` — inventory
2. `get_errors` — P0 gate
3. Update [app-router-audit.md](app-router-audit.md) scorecard if compliance review requested
