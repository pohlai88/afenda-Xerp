# Next.js MCP — Afenda runtime reference

## Wiring

| Item | Value |
| --- | --- |
| MCP server | `next-devtools` in `.mcp.json` |
| CLI package | `next-devtools-mcp@latest` |
| ERP dev URL | `http://localhost:3000` |
| Project path | `apps/erp` |

## Tool sequence

### Discovery

```
nextjs_index {}
```

Returns port, PID, URL, and tool schemas.

### Project metadata

```
nextjs_call { port: "3000", toolName: "get_project_metadata" }
```

Expect: `{ projectPath: ".../apps/erp", devServerUrl: "http://localhost:3000" }`

### Route inventory

```
nextjs_call { port: "3000", toolName: "get_routes" }
```

Optional filter: `args: { routerType: "app" }`

Use before adding routes — avoid duplicate segments or conflicting dynamic params.

### Error diagnostics

```
nextjs_call { port: "3000", toolName: "get_errors" }
```

Returns `configErrors`, `sessionErrors` (build + runtime per URL). **Gate:** zero errors on touched routes before claiming done.

Common Afenda failure: `node:fs` / server-only import leaked into client graph (often via `error.tsx` or package barrel).

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
4. Fallback: filesystem route scan under `apps/erp/src/app/` — **not** a substitute for `get_errors`

## Docs MCP (API uncertainty)

For Next.js API behavior not visible at runtime:

1. Context7: `resolve-library-id` → `query-docs` for `next`
2. Vercel plugin skill: `nextjs` (App Router, Cache Components, proxy)
