/**
 * Runtime implementation of governed design-system recipes for @afenda/ui.
 *
 * @afenda/design-system owns recipe authority and variant vocabulary.
 * @afenda/ui maps governed recipe selections to runtime Tailwind classes only.
 *
 * Boundary rules:
 * - Every map key must be type-bound to @afenda/design-system contracts.
 * - Semantic token utilities (bg-primary, text-destructive, etc.) are
 *   permitted here as runtime implementation. Raw color-scale utilities
 *   such as palette numbers are prohibited everywhere.
 * - Arbitrary values are permitted only in this file and must stay minimal.
 * - CVA runtime objects are internal. Only resolver functions are public.
 * - New variant axes, tones, sizes, radii, shadows, or recipe names must
 *   not be introduced here; they require a design-system contract update.
 */
import { cva } from "class-variance-authority";

import {
  type Density,
  type GovernedRadius,
  type GovernedShadow,
  type GovernedSize,
  type StatusTone,
  type VariantEmphasis,
  type VariantIntent,
  type VariantSelection,
} from "./design-system";
import {
  resolveBadgeVariant,
  resolveButtonVariant,
  resolveCardVariant,
} from "./variant";

// ─── Recipe Coverage ──────────────────────────────────────────────────────────

export const GOVERNED_UI_RECIPES = ["button", "badge", "card"] as const;

export type GovernedRecipeName = (typeof GOVERNED_UI_RECIPES)[number];

export interface GovernedRecipeResult {
  readonly className: string;
  readonly recipeName: GovernedRecipeName;
  readonly selection: VariantSelection;
}

// ─── Button runtime recipe ────────────────────────────────────────────────────

const buttonIntentEmphasis: Record<
  VariantIntent,
  Record<VariantEmphasis, string>
> = {
  primary: {
    solid:
      "bg-primary text-primary-foreground hover:bg-primary/80 aria-expanded:bg-primary/80",
    soft: "bg-primary/10 text-primary hover:bg-primary/15",
    outline:
      "border-border bg-background text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
    ghost:
      "text-primary hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:hover:bg-muted/50",
  },
  secondary: {
    // color-mix is allowlisted: no semantic token exists for secondary hover at 5% foreground blend
    solid:
      "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
    soft: "bg-secondary/60 text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border-border bg-background text-secondary-foreground hover:bg-secondary/30",
    ghost:
      "text-secondary-foreground hover:bg-secondary/40 aria-expanded:bg-secondary/40",
  },
  quiet: {
    solid: "bg-muted text-foreground hover:bg-muted/80",
    soft: "bg-muted/60 text-foreground hover:bg-muted/80",
    outline:
      "border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground",
    ghost:
      "text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:hover:bg-muted/50",
  },
  destructive: {
    solid:
      "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
    soft: "bg-destructive/5 text-destructive hover:bg-destructive/10",
    outline:
      "border-destructive/40 bg-background text-destructive hover:bg-destructive/10",
    ghost: "text-destructive hover:bg-destructive/10",
  },
};

const buttonCompoundVariants = (
  Object.entries(buttonIntentEmphasis) as Array<
    [VariantIntent, Record<VariantEmphasis, string>]
  >
).flatMap(([intent, emphases]) =>
  (Object.entries(emphases) as Array<[VariantEmphasis, string]>).map(
    ([emphasis, className]) => ({
      intent,
      emphasis,
      class: className,
    })
  )
);

const buttonIconSizeClasses: Record<GovernedSize, string> = {
  xs: "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
  sm: "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
  md: "size-8",
  lg: "size-9",
};

const buttonRecipeRuntime = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      intent: {
        primary: "",
        secondary: "",
        quiet: "",
        destructive: "",
      } satisfies Record<VariantIntent, string>,
      emphasis: {
        solid: "",
        soft: "",
        outline: "",
        ghost: "",
      } satisfies Record<VariantEmphasis, string>,
      size: {
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      } satisfies Record<GovernedSize, string>,
      presentation: {
        default: "",
        icon: "",
      },
    },
    compoundVariants: [
      ...buttonCompoundVariants,
      ...(
        Object.entries(buttonIconSizeClasses) as Array<[GovernedSize, string]>
      ).map(([size, className]) => ({
        presentation: "icon" as const,
        size,
        class: className,
      })),
    ],
    defaultVariants: {
      intent: "primary",
      emphasis: "solid",
      size: "md",
      presentation: "default",
    },
  }
);

// ─── Badge runtime recipe ─────────────────────────────────────────────────────

const badgeToneEmphasis: Record<
  StatusTone,
  Record<VariantEmphasis, string>
> = {
  neutral: {
    solid: "bg-muted text-foreground [a]:hover:bg-muted/80",
    soft: "bg-muted/60 text-foreground [a]:hover:bg-muted/80",
    outline: "border-border text-foreground [a]:hover:bg-muted",
    ghost: "text-muted-foreground [a]:hover:bg-muted/50",
  },
  info: {
    solid: "bg-primary/10 text-primary [a]:hover:bg-primary/15",
    soft: "bg-primary/5 text-primary [a]:hover:bg-primary/10",
    outline: "border-primary/20 text-primary [a]:hover:bg-primary/5",
    ghost: "text-primary [a]:hover:bg-primary/5",
  },
  success: {
    solid: "bg-accent text-accent-foreground [a]:hover:bg-accent/80",
    soft: "bg-accent/60 text-accent-foreground [a]:hover:bg-accent/80",
    outline: "border-accent-foreground/20 text-accent-foreground [a]:hover:bg-accent/30",
    ghost: "text-accent-foreground [a]:hover:bg-accent/40",
  },
  // TODO: warning uses chart-3 as a design gap; replace when statusTone.warning token exists
  warning: {
    solid: "bg-chart-3/10 text-foreground [a]:hover:bg-chart-3/15",
    soft: "bg-chart-3/5 text-foreground [a]:hover:bg-chart-3/10",
    outline: "border-chart-3/30 text-foreground [a]:hover:bg-chart-3/10",
    ghost: "text-foreground [a]:hover:bg-chart-3/10",
  },
  danger: {
    solid:
      "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
    soft: "bg-destructive/5 text-destructive [a]:hover:bg-destructive/10",
    outline: "border-destructive/40 text-destructive [a]:hover:bg-destructive/10",
    ghost: "text-destructive [a]:hover:bg-destructive/10",
  },
  forbidden: {
    solid: "bg-destructive/5 text-destructive [a]:hover:bg-destructive/10",
    soft: "bg-destructive/5 text-destructive [a]:hover:bg-destructive/10",
    outline: "border-destructive/40 text-destructive [a]:hover:bg-destructive/10",
    ghost: "text-destructive [a]:hover:bg-destructive/10",
  },
  invalid: {
    solid: "bg-destructive/10 text-destructive [a]:hover:bg-destructive/20",
    soft: "bg-destructive/5 text-destructive [a]:hover:bg-destructive/10",
    outline: "border-destructive/50 text-destructive [a]:hover:bg-destructive/10",
    ghost: "text-destructive [a]:hover:bg-destructive/10",
  },
};

const badgeCompoundVariants = (
  Object.entries(badgeToneEmphasis) as Array<
    [StatusTone, Record<VariantEmphasis, string>]
  >
).flatMap(([tone, emphases]) =>
  (Object.entries(emphases) as Array<[VariantEmphasis, string]>).map(
    ([emphasis, className]) => ({
      tone,
      emphasis,
      class: className,
    })
  )
);

const badgeRecipeRuntime = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      tone: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        danger: "",
        forbidden: "",
        invalid: "",
      } satisfies Record<StatusTone, string>,
      emphasis: {
        solid: "",
        soft: "",
        outline: "",
        ghost: "",
      } satisfies Record<VariantEmphasis, string>,
      density: {
        compact: "h-4 px-1.5 text-[0.65rem]",
        standard: "",
        comfortable: "h-6 px-2.5 text-sm",
      } satisfies Record<Density, string>,
      size: {
        xs: "h-4 px-1.5 text-[0.65rem]",
        sm: "",
        md: "",
        lg: "h-6 px-2.5 text-sm",
      } satisfies Record<GovernedSize, string>,
    },
    compoundVariants: badgeCompoundVariants,
    defaultVariants: {
      tone: "neutral",
      emphasis: "solid",
      density: "standard",
      size: "sm",
    },
  }
);

// ─── Card runtime recipe ──────────────────────────────────────────────────────

const cardRadiusClasses: Record<GovernedRadius, string> = {
  none: "rounded-none *:[img:first-child]:rounded-t-none *:[img:last-child]:rounded-b-none",
  sm: "rounded-lg *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg",
  md: "rounded-xl *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
  lg: "rounded-2xl *:[img:first-child]:rounded-t-2xl *:[img:last-child]:rounded-b-2xl",
};

const cardShadowClasses: Record<GovernedShadow, string> = {
  none: "shadow-none ring-0",
  raised: "ring-1 ring-foreground/10",
  overlay: "shadow-lg ring-1 ring-foreground/10",
};

const cardRecipeRuntime = cva(
  "group/card flex flex-col gap-(--card-spacing) overflow-hidden bg-card py-(--card-spacing) text-sm text-card-foreground has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0",
  {
    variants: {
      density: {
        compact:
          "[--card-spacing:--spacing(3)] has-data-[slot=card-footer]:pb-0 data-[density=compact]:has-data-[slot=card-footer]:pb-0",
        standard: "[--card-spacing:--spacing(4)]",
        comfortable: "[--card-spacing:--spacing(6)]",
      } satisfies Record<Density, string>,
      radius: {
        none: cardRadiusClasses.none,
        sm: cardRadiusClasses.sm,
        md: cardRadiusClasses.md,
        lg: cardRadiusClasses.lg,
      } satisfies Record<GovernedRadius, string>,
      shadow: {
        none: cardShadowClasses.none,
        raised: cardShadowClasses.raised,
        overlay: cardShadowClasses.overlay,
      } satisfies Record<GovernedShadow, string>,
    },
    defaultVariants: {
      density: "standard",
      radius: "md",
      shadow: "raised",
    },
  }
);

// ─── Public resolvers only ────────────────────────────────────────────────────

export function resolveGovernedRecipe(
  recipeName: GovernedRecipeName,
  selection: VariantSelection
): GovernedRecipeResult {
  const normalized = (() => {
    switch (recipeName) {
      case "button":
        return resolveButtonVariant(selection);
      case "badge":
        return resolveBadgeVariant(selection);
      case "card":
        return resolveCardVariant(selection);
    }
  })();

  switch (recipeName) {
    case "button":
      return {
        recipeName,
        selection: normalized,
        className: resolveButtonClassName(normalized),
      };
    case "badge":
      return {
        recipeName,
        selection: normalized,
        className: badgeRecipeRuntime({
          tone: normalized.tone ?? "neutral",
          emphasis: normalized.emphasis ?? "solid",
          density: normalized.density ?? "standard",
          size: normalized.size ?? "sm",
        }),
      };
    case "card":
      return {
        recipeName,
        selection: normalized,
        className: cardRecipeRuntime({
          density: normalized.density ?? "standard",
          radius: normalized.radius ?? "md",
          shadow: normalized.shadow ?? "raised",
        }),
      };
    default: {
      const exhaustive: never = recipeName;
      throw new Error(`Unhandled recipe "${exhaustive}".`);
    }
  }
}

export function resolveButtonClassName(
  selection: VariantSelection & {
    presentation?: "default" | "icon";
  }
): string {
  const { presentation = "default", ...variantSelection } = selection;
  const normalized = resolveButtonVariant(variantSelection);
  return buttonRecipeRuntime({
    intent: normalized.intent ?? "primary",
    emphasis: normalized.emphasis ?? "solid",
    size: normalized.size ?? "md",
    presentation,
  });
}

export function resolveBadgeClassName(selection: VariantSelection): string {
  const normalized = resolveBadgeVariant(selection);
  return badgeRecipeRuntime({
    tone: normalized.tone ?? "neutral",
    emphasis: normalized.emphasis ?? "solid",
    density: normalized.density ?? "standard",
    size: normalized.size ?? "sm",
  });
}

export function resolveCardClassName(selection: VariantSelection): string {
  const normalized = resolveCardVariant(selection);
  return cardRecipeRuntime({
    density: normalized.density ?? "standard",
    radius: normalized.radius ?? "md",
    shadow: normalized.shadow ?? "raised",
  });
}
