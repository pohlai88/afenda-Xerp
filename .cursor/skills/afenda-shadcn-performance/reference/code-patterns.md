# Code Patterns — Afenda-safe performance

Copy-paste patterns aligned with PAS-006 import zones and Next.js App Router.

## Lazy modal with Skeleton loading

```tsx
// apps/erp/src/app/(protected)/modules/example/_components/users-page.client.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button, Skeleton } from "@afenda/shadcn-studio";

const UserProfileModal = dynamic(
  () =>
    import("./user-profile-modal.client").then((mod) => ({
      default: mod.UserProfileModal,
    })),
  {
    loading: () => (
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    ),
    // ssr: false only if modal uses window/document/canvas
  }
);

export function UsersPageClient() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>View profile</Button>
      {open ? (
        <UserProfileModal open={open} onOpenChange={setOpen} />
      ) : null}
    </>
  );
}
```

## Browser-only component (ssr: false)

```tsx
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./pdf-viewer.client"), {
  ssr: false,
  loading: () => <p className="text-muted-foreground text-sm">Loading viewer…</p>,
});
```

Reserve `ssr: false` for PDF/canvas/WebGL/localStorage — not for ordinary dialogs.

## Static Tailwind class map

```tsx
const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
} as const;

type Size = keyof typeof sizeClasses;

export function Label({ size }: { size: Size }) {
  return <span className={sizeClasses[size]}>Label</span>;
}
```

## Named lucide import

```tsx
import { ChevronRight, Loader2 } from "lucide-react";

// optimizePackageImports in next.config.ts further tree-shakes lucide-react
```

## Lean CVA in studio primitive

```tsx
import { cva } from "class-variance-authority";

// Only variants shipped in the design system
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
```

Remove `destructive`, `ghost`, etc. from source if the ERP never uses them — Tailwind still generates CSS for unused CVA strings.

## Below-the-fold lazy sections (Server Component page)

```tsx
import dynamic from "next/dynamic";
import { ProductInfo } from "./_components/product-info";

const ReviewSection = dynamic(() => import("./_components/review-section"));
const RelatedProducts = dynamic(() => import("./_components/related-products"));

export default async function ProductPage() {
  return (
    <>
      <ProductInfo />
      <ReviewSection />
      <RelatedProducts />
    </>
  );
}
```

## Native JS instead of lodash

```tsx
// Before
// import _ from "lodash";
// const unique = _.uniq(array);

// After
const unique = [...new Set(array)];
```

## ERP import zone (zone C)

```tsx
// Good — barrel
import { Button, Card, Skeleton } from "@afenda/shadcn-studio";

// Bad — deep import in ERP
// import { Button } from "@afenda/shadcn-studio/src/components/ui/button";
```

## error.tsx — no studio barrel

```tsx
"use client";

// Client-safe only — no @afenda/shadcn-studio
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
```
