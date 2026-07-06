/**
 * Route-lab hydration resolution catalog — machine-readable authority for
 * `check-developer-hydration-governance.mjs` and client-leaf authors.
 *
 * Methods mirror proven patterns in @afenda/shadcn-studio-v2 (ThemeScript,
 * suppressHydrationWarning) and @afenda/shadcn-studio (useIsMobile mounted gate).
 */

export const hydrationResolutionMethodIds = [
  "layout-html-suppress",
  "theme-script-prehydrate",
  "mounted-gate",
  "element-suppress-hydration-warning",
] as const;

export type HydrationResolutionMethodId =
  (typeof hydrationResolutionMethodIds)[number];

export interface HydrationResolutionMethod {
  readonly appliesTo: readonly ("layout" | "client-leaf")[];
  readonly description: string;
  readonly id: HydrationResolutionMethodId;
  readonly referencePaths: readonly string[];
  readonly resolves: readonly string[];
}

export const hydrationResolutionMethods = [
  {
    id: "layout-html-suppress",
    appliesTo: ["layout"],
    resolves: [
      "Theme class or attribute drift on documentElement between SSR and client theme persistence",
    ],
    description:
      "Root layout sets suppressHydrationWarning on <html> when theme runtime may differ after localStorage hydration.",
    referencePaths: [
      "apps/developer/src/app/layout.tsx",
      "apps/erp/src/app/layout.tsx",
    ],
  },
  {
    id: "theme-script-prehydrate",
    appliesTo: ["layout"],
    resolves: [
      "Flash of wrong color mode or overlay tokens before React hydrates",
    ],
    description:
      "ThemeScript runs before paint to align DOM tokens/class with persisted theme (pairs with ThemeProvider).",
    referencePaths: [
      "packages/shadcn-studio-v2/src/components/shared/ThemeScript.tsx",
    ],
  },
  {
    id: "mounted-gate",
    appliesTo: ["client-leaf"],
    resolves: [
      "useTheme / useSettings / matchMedia values rendered into text or data-* attributes on first client pass",
    ],
    description:
      "Defer storage- or viewport-backed UI until after mount via useMounted() from @/lib/lab/use-mounted.client.",
    referencePaths: [
      "apps/developer/src/lib/lab/use-mounted.client.ts",
      "packages/shadcn-studio/src/hooks/use-mobile.ts",
      "apps/developer/src/app/design-system/v2-proof/_components/v2-proof-route.client.tsx",
    ],
  },
  {
    id: "element-suppress-hydration-warning",
    appliesTo: ["client-leaf"],
    resolves: [
      "Residual benign text or attribute drift on a bounded probe element after mounted-gate placeholder",
    ],
    description:
      "Optional suppressHydrationWarning on the specific element that intentionally changes post-mount.",
    referencePaths: [
      "packages/shadcn-studio-v2/src/components/shared/ThemeScript.tsx",
    ],
  },
] as const satisfies readonly HydrationResolutionMethod[];

/** Hooks whose first client render may diverge from SSR when storage is enabled. */
export const runtimeSensitiveClientHooks = ["useTheme", "useSettings"] as const;

export type RuntimeSensitiveClientHook =
  (typeof runtimeSensitiveClientHooks)[number];

export const mountedGateImportPath = "@/lib/lab/use-mounted.client" as const;

export const mountedGateHookName = "useMounted" as const;

export const developerThemeStorageKey = "afenda-studio-v2-theme" as const;
