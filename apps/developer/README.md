# Afenda Developer App

`@afenda/developer` is the UI/UX review surface for Afenda route and presentation work. It runs on port `3002` and hosts **one governed surface system** with profile-specific policy:

| Profile | Example routes | Purpose |
| --- | --- | --- |
| `index` | `/` | Route-lab doctrine index |
| `operator-lab` | `/dashboard/sales`, `/settings/appearance` | ERP route-shape proof under `(lab)` |
| `consumer-proof` | `/design-system/v2-proof` | `@afenda/shadcn-studio-v2` public export proof |

**SSOT:** [`src/lib/lab/route-surface-registry.ts`](src/lib/lab/route-surface-registry.ts) — route identity, profile, import law, smoke headings.

Runtime authority uses P5 demo-fixture operating context (`resolveLabShellOperatingContext`), an empty BFF allowlist, and prohibition on `@afenda/auth`, `@afenda/kernel`, `@afenda/database`, and `@afenda/server`. See [ADR-0044](../../docs/adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md).

Agent checklist: [`.cursor/skills/afenda-nextjs-best-practice/reference/developer-app-surfaces.md`](../../.cursor/skills/afenda-nextjs-best-practice/reference/developer-app-surfaces.md)

Audit: [ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md](../../docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md) · Green-light: [DEVELOPER_ROUTE_LAB_GREENLIGHT.md](../../docs/architecture/DEVELOPER_ROUTE_LAB_GREENLIGHT.md)

## Run

```bash
pnpm --filter @afenda/developer dev
```

Open `http://127.0.0.1:3002`.

## Verification (canonical)

One release-grade path covers **all** surface profiles:

```bash
pnpm --filter @afenda/developer verify:greenlight
```

Fast inner loops:

```bash
pnpm --filter @afenda/developer verify:route-lab   # typecheck + governance
pnpm --filter @afenda/developer verify:v2-proof    # v2-proof unit tests + presentation/hydration gates
```

Workspace delegate:

```bash
pnpm check:developer-route-lab-greenlight
```

Direct fallback:

```bash
node apps/developer/scripts/verify-greenlight.mjs
node apps/developer/scripts/check-developer-app-governance.mjs
```
