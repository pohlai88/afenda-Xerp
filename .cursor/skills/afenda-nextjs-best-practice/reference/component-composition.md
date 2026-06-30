# Component composition — per-file contracts

**Authority:** Next.js [Server Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) · ADR-0027 (`@afenda/shadcn-studio` → `apps/erp`) · PAS-006 presentation family.

---

## Layer flow

```text
page.tsx (async RSC shell)
  → load-*-page.server.ts (data assembly, permissions, spine)
  → *-panel.tsx (presentation composition)
  → @afenda/shadcn-studio blocks
  → packages/* domain services (from loader/server only)
```

Mutations: `*.action.ts` (`"use server"`) or BFF `route.ts` — never direct DB from presentation.

---

## File type contracts

| File | Directive | May import | Must not |
|------|-----------|------------|----------|
| `page.tsx` | (none — RSC default) | loader, panel, studio blocks, types | `"use client"`, `@afenda/database`, deep domain in page body |
| `layout.tsx` | (none) | context loaders, shell wrappers | Per-page data fetching, mutations |
| `loading.tsx` | (none) | skeleton markup only | Data fetching |
| `error.tsx` | `"use client"` | plain HTML, minimal button | `@afenda/shadcn-studio`, `node:*`, server-only packages |
| `global-error.tsx` | `"use client"` | same as `error.tsx` + `globals.css` if needed | Heavy package barrels |
| `*-panel.tsx` | (none unless interactive) | studio blocks, loader result types | `headers()` if layout already resolved context |
| `load-*-page.server.ts` | server-only | `packages/*`, `src/server/*`, context | React hooks, `"use client"` |
| `*.action.ts` | `"use server"` | operating context resolver, domain services | Skip auth/context resolution |
| `*.client.tsx` | `"use client"` | hooks, browser APIs, scoped BFF fetch | `@afenda/database`, server-only imports |
| `route.ts` | (handler) | `createApiHandler`, `src/server/*` | Inline business rules beyond orchestration |

**MCP P0 (2026-06-25):** `error.tsx` imports `@afenda/shadcn-studio` → `node:fs` build failure on `/`. Error boundaries must use a native `<button>` or a client-safe primitive until studio exposes a client-only entry.

---

## Naming suffixes

| Suffix | Runtime | Example |
|--------|---------|---------|
| `.server.ts` | Server only | `load-procurement-purchase-orders-page.server.ts` |
| `.action.ts` | Server Action entry | `context-switch.action.ts` |
| `.client.tsx` | Client Component | `metadata-binding-slot-hydration-preview.client.tsx` |
| `.client.server.ts` | Server helper for client boundary | `service-actor-s2s-ping.client.server.ts` |

Do not use `.server.tsx` for React server components — use plain `.tsx` in server-only paths or rely on RSC default without `"use client"`.

---

## Thin page template

```tsx
import { loadProcurementPurchaseOrdersPage } from "@/lib/procurement/load-procurement-purchase-orders-page.server";
// import { ProcurementPurchaseOrdersPanel } from "@/components/procurement/purchase-orders-panel";

export const metadata = { title: "Purchase orders" };
// Prefer generateMetadata when title depends on params or tenant branding.

export default async function ProcurementPurchaseOrdersPage() {
  const data = await loadProcurementPurchaseOrdersPage();

  if (data.kind === "error") {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-4 p-6">
        <h1 className="font-semibold text-2xl">{data.title}</h1>
        <p className="text-muted-foreground text-sm">{data.message}</p>
      </main>
    );
  }

  // return <ProcurementPurchaseOrdersPanel data={data} />;
  return <main>...</main>;
}
```

**Rules:**

1. `page.tsx` stays under ~40 lines — extract panel when larger.
2. Loader returns discriminated union (`kind: "error" | "ready"`).
3. Layout already ran `loadProtectedRequestOperatingContext` — pages call loaders that reuse `React.cache`, not duplicate `headers()` unnecessarily.
4. Export `metadata` or `generateMetadata` — no `next/head`.

---

## Dynamic route props (Next.js 16)

`params` and `searchParams` are **Promises** — always `await`:

```tsx
interface PageProps {
  readonly params: Promise<{ id: string }>;
  readonly searchParams: Promise<{ q?: string }>;
}

export default async function DetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { q } = await searchParams;
  // ...
}
```

Same for `layout.tsx` and `route.ts` handlers. See [Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes).

---

## Client boundary rules

Add `"use client"` only when the module needs:

- `useState`, `useEffect`, event handlers on native elements
- Browser APIs (`window`, `localStorage`)
- Third-party hooks that require client

Use `next/dynamic` with `{ ssr: false }` for heavy client-only widgets (charts, rich editors).

**Presentation:** Import blocks from `@afenda/shadcn-studio`. Customize in `apps/erp` panels — not by editing studio package internals without PAS-006 acceptance.

---

## Accessibility baseline

| Surface | Requirement |
|---------|-------------|
| `loading.tsx` | `aria-busy="true"`, `aria-live="polite"` (root pattern) |
| `layout.tsx` | `<html lang="en">` (or tenant locale when i18n lands) |
| Forms | Labels, error text associated with fields |
| Auth-adjacent UI | WCAG 2.2 AA per PAS-006C |

---

## Error boundary template (client-safe)

```tsx
"use client";

interface SegmentErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function SegmentError({ error, reset }: SegmentErrorProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
      <h1 className="font-semibold text-xl">Something went wrong</h1>
      {process.env.NODE_ENV === "development" && error.message ? (
        <p className="text-muted-foreground text-sm">{error.message}</p>
      ) : null}
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
```
