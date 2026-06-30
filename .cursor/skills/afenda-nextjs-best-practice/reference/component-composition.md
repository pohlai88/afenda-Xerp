# Component composition — module ingress

**Authority:** template §5 · PAS-006D · ADR-0027 (`@afenda/shadcn-studio` → `apps/erp`).

---

## Flow (module surfaces)

```text
page.tsx (thin async RSC)
  → load-{surface}-page.server.ts
  → projectModuleRuntimeContext (from PAS-001A OperatingContext)
  → _components/{surface}-panel.tsx
  → @afenda/shadcn-studio blocks
  → packages/features/erp-modules / packages/* services (from loader only)
```

---

## Where components live

| UI type | Location |
| ------- | -------- |
| **Module screens (default)** | `app/(protected)/modules/.../[moduleSlug]/_components/` |
| **Cross-cutting ERP chrome** | `apps/erp/src/components/` — metadata operator, shared shells only |
| **Design system blocks** | `@afenda/shadcn-studio` — never fork without PAS-006 acceptance |

**Do not** default to `src/components/{module}/` for LoB module UI.

---

## File contracts

| File | May import | Must not |
| ---- | ---------- | -------- |
| `page.tsx` | loader, `_components/*`, studio blocks | `"use client"`, `@afenda/database`, inline domain logic |
| `modules/layout.tsx` | `force-dynamic`, shell only | Per-surface data |
| `[moduleSlug]/layout.tsx` | `guardModuleRoute`, module chrome | Local tenant resolution |
| `load-*-page.server.ts` | spine, `packages/*`, `src/server/*` | React hooks |
| `_components/*.tsx` | studio blocks, loader types | `headers()` if layout resolved context |
| `*.server-actions.ts` | operating context, domain services | Skip auth/permission |
| `error.tsx` | plain `<button>` | `@afenda/shadcn-studio` (MCP: `node:fs` on `/`) |

---

## Thin page template

```tsx
import { loadProcurementRequisitionsPage } from "@/lib/procurement/load-procurement-requisitions-page.server";
// import { RequisitionsPanel } from "./_components/requisitions-panel";

export async function generateMetadata() {
  return { title: "Requisitions" };
}

export default async function RequisitionsPage() {
  const data = await loadProcurementRequisitionsPage();
  if (data.kind === "error") {
    return <main>...</main>;
  }
  // return <RequisitionsPanel data={data} />;
  return <main>...</main>;
}
```

---

## Naming suffixes

| Suffix | Use |
| ------ | --- |
| `.server.ts` | Server-only loaders and ingress |
| `.action.ts` | `"use server"` entry points |
| `.client.tsx` | Client leaves (hooks, browser APIs) |
| `.client.server.ts` | Server helper for client boundary |

---

## Client-safe error boundary

```tsx
"use client";

export default function SegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
      <h1 className="font-semibold text-xl">Something went wrong</h1>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
```
