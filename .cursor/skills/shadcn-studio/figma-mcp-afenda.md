# Figma MCP + Afenda ERP (shadcn/studio)

Authority: [ADR-0017](../../../docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) · [Figma to Code (shadcn/studio)](https://shadcnstudio.com/docs/documentation-figma/figma-to-code-mcp-server) · [Figma MCP remote setup](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)

## Repo wiring

| Item | Value |
|------|--------|
| Remote MCP | `.cursor/mcp.json` → `figma` → `https://mcp.figma.com/mcp` |
| Desktop MCP (optional) | `.cursor/mcp.json` → `figma-desktop` → `http://127.0.0.1:3845/mcp` |
| Auth design file | `https://www.figma.com/design/2ZNqNOxyNb5TwCTBIaMVPD/loginauth` (file key `2ZNqNOxyNb5TwCTBIaMVPD`) |
| Design system rules | `.cursor/rules/figma-afenda-design-system-rules.mdc` |
| Next.js image loader | `apps/erp/next.config.ts` → `localhost:3845` / `127.0.0.1:3845` |
| Studio MCP | `shadcn-studio` (for `/ftc` block install workflow) |

## One-time setup (you)

1. **Restart Cursor** after `.cursor/mcp.json` changes.
2. **Authenticate remote Figma MCP:** Cursor → Settings → MCP → `figma` → **Connect** → allow OAuth ([Figma docs](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)).
3. **Optional desktop MCP** (selection-based, local images on port 3845):
   - Figma Desktop → Preferences → **Enable Dev Mode MCP Server**
   - Enable MCP server `figma-desktop` in Cursor (green status)
4. **Optional:** set `FIGMA_AUTH_DESIGN_URL` in `.env` from `.env.example`.

## When to use which tool

| Workflow | Tool | Use when |
|----------|------|----------|
| `/ftc` | shadcn/studio MCP | Pro/Free block instances in Figma, minimal customization — installs matching `@ss-blocks` |
| Figma MCP `get_design_context` | `figma` or `figma-desktop` | Heavily customized frames or fully custom auth UI |
| Promotion pipeline | afenda-shadcn-components skill | After any generated UI lands in repo |

**Auth shell today:** `packages/appshell/src/auth-shell/` — promote Figma output here, not raw Tailwind in `apps/erp`.

## Prompting patterns

### Remote server (link-based)

Copy a frame/layer link from [loginauth](https://www.figma.com/design/2ZNqNOxyNb5TwCTBIaMVPD/loginauth), then:

```text
Implement the auth entry frame from this Figma link using @afenda/ui governed props
and the auth-shell promotion pipeline. File: packages/appshell/src/auth-shell/
```

### Desktop server (selection-based)

1. Open Figma Desktop, select the frame (blue outline).
2. In Cursor:

```text
Generate code for the selected Figma frame. Map to AuthShellEntry compound API,
@afenda/appshell auth-shell CSS (§L), zero className on @afenda/ui primitives.
```

## Afenda conversion rules (mandatory)

Do **not** paste raw Figma Tailwind output into production paths.

1. **Primitives:** `@afenda/ui` + `@afenda/ui/governance` — `intent`, `emphasis`, `size`, `presentation`; **no `className`** on primitives.
2. **Shell chrome:** BEM in `packages/appshell/src/styles/afenda-appshell-studio.css` §L — not Tailwind on blocks.
3. **App forms:** `apps/erp/src/app/(auth)/auth.css` + `AuthForm` compound only.
4. **Install cwd:** `npx shadcn@latest add … -c packages/ui` for missing primitives.
5. **After CSS edits:** `pnpm sync:package-css-dist -- --package @afenda/appshell`
6. **Gates:** `pnpm ui:guard:scan` → `pnpm --filter @afenda/appshell test auth-shell`

## Figma MCP tools (common)

| Tool | Purpose |
|------|---------|
| `get_design_context` | Layout + styles → code (customize prompt for governed React) |
| `get_screenshot` | Visual fidelity check |
| `get_variable_defs` | Tokens / spacing / typography from selection |
| `get_metadata` | Large files — outline first, then drill into node IDs |

See [Figma tools and prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/).

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `figma` tools missing | Restart Cursor; authenticate MCP |
| Can't access file | Ensure your Figma account has access to `loginauth` |
| Images 403 in dev | Enable desktop MCP; confirm `next.config.ts` port 3845 patterns |
| `/ftc` vs Figma MCP confusion | Unmodified blocks → `/ftc`; custom frames → Figma MCP + promotion |
