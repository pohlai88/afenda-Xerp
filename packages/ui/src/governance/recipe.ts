/**
 * Runtime implementation of governed design-system recipes for @afenda/ui.
 *
 * @afenda/design-system owns recipe authority and variant vocabulary.
 * @afenda/ui maps governed recipe selections to runtime Tailwind classes only.
 */
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";
import {
  resolveAppShellClassName,
  resolveAppShellVariant,
  resolveMetadataUiClassName,
  resolveMetadataUiVariant,
} from "./authority-recipe";
import type {
  GovernedPanelRadius,
  GovernedPanelShadow,
} from "./component-props";
import {
  isGovernedPanelRadius,
  isGovernedPanelShadow,
} from "./component-props";
import type {
  Density,
  GovernedSize,
  StatusTone,
  VariantEmphasis,
  VariantIntent,
  VariantSelection,
} from "./design-system";
import {
  badgeToneEmphasis,
  buttonIconSizeClasses,
  buttonIntentEmphasis,
  densitySpacingClasses,
  fieldOrientationClasses,
  focusRingInteractiveClasses,
  focusRingInvalidClasses,
  formControlSizeClasses,
  panelRadiusClasses,
  panelShadowClasses,
  type ToggleSizeKey,
  type ToggleVariantKey,
  tableSizeClasses,
  toggleRootSlotClassName,
  toggleSizeClassNames,
  toggleVariantClassNames,
  toneEmphasisClasses,
} from "./recipe-maps";
import type { GovernedRecipeName, GovernedRecipeResult } from "./types";
import { GOVERNED_UI_RECIPES } from "./types";
import {
  resolveBadgeVariant,
  resolveButtonVariant,
  resolveCardVariant,
  resolveFormControlVariant,
  resolveStatusVariant,
  resolveSurfaceVariant,
  resolveTableVariant,
} from "./variant";

export type { GovernedRecipeName, GovernedRecipeResult };
export { GOVERNED_UI_RECIPES };

function buildCompoundVariants<TKey extends string>(
  map: Record<TKey, Record<VariantEmphasis, string>>,
  keyName: "intent" | "tone"
) {
  return (
    Object.entries(map) as [TKey, Record<VariantEmphasis, string>][]
  ).flatMap(([key, emphases]) =>
    (Object.entries(emphases) as [VariantEmphasis, string][]).map(
      ([emphasis, className]) => ({
        [keyName]: key,
        emphasis,
        class: className,
      })
    )
  );
}

const buttonRecipeRuntime = cva(
  `group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all ${focusRingInteractiveClasses} active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive ${focusRingInvalidClasses} dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0`,
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
      ...buildCompoundVariants(buttonIntentEmphasis, "intent"),
      ...(
        Object.entries(buttonIconSizeClasses) as [GovernedSize, string][]
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

const badgeRecipeRuntime = cva(
  `group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-4xl border border-transparent px-2 py-0.5 font-medium text-xs transition-all ${focusRingInteractiveClasses} has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!`,
  {
    variants: {
      tone: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        danger: "",
        critical: "",
        pending: "",
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
    compoundVariants: buildCompoundVariants(badgeToneEmphasis, "tone"),
    defaultVariants: {
      tone: "neutral",
      emphasis: "solid",
      density: "standard",
      size: "sm",
    },
  }
);

const cardRecipeRuntime = cva(
  "group/card flex flex-col gap-(--card-spacing) overflow-hidden bg-card py-(--card-spacing) text-card-foreground text-sm has-[>img:first-child]:pt-0 has-data-[slot=card-footer]:pb-0",
  {
    variants: {
      density: {
        compact:
          "[--card-spacing:--spacing(3)] has-data-[slot=card-footer]:pb-0 data-[density=compact]:has-data-[slot=card-footer]:pb-0",
        standard: "[--card-spacing:--spacing(4)]",
        comfortable: "[--card-spacing:--spacing(6)]",
      } satisfies Record<Density, string>,
      radius: panelRadiusClasses satisfies Record<GovernedPanelRadius, string>,
      shadow: panelShadowClasses satisfies Record<GovernedPanelShadow, string>,
    },
    defaultVariants: {
      density: "standard",
      radius: "md",
      shadow: "raised",
    },
  }
);

const surfaceRecipeRuntime = cva(
  "group/surface flex flex-col gap-(--surface-spacing) bg-background p-(--surface-spacing) text-foreground",
  {
    variants: {
      density: densitySpacingClasses satisfies Record<Density, string>,
      radius: panelRadiusClasses satisfies Record<GovernedPanelRadius, string>,
      shadow: panelShadowClasses satisfies Record<GovernedPanelShadow, string>,
    },
    defaultVariants: {
      density: "standard",
      radius: "md",
      shadow: "none",
    },
  }
);

const statusRecipeRuntime = cva(
  "group/status relative grid w-full gap-1 rounded-lg border px-(--surface-spacing) py-(--surface-spacing) text-left text-sm has-data-[slot=alert-action]:relative has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 has-data-[slot=alert-action]:pr-18 *:[svg:not([class*='size-'])]:size-4 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current",
  {
    variants: {
      tone: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        danger: "",
        critical: "",
        pending: "",
        forbidden: "",
        invalid: "",
      } satisfies Record<StatusTone, string>,
      emphasis: {
        solid: "",
        soft: "",
        outline: "",
        ghost: "",
      } satisfies Record<VariantEmphasis, string>,
      density: densitySpacingClasses satisfies Record<Density, string>,
      radius: panelRadiusClasses satisfies Record<GovernedPanelRadius, string>,
    },
    compoundVariants: buildCompoundVariants(toneEmphasisClasses, "tone"),
    defaultVariants: {
      tone: "neutral",
      emphasis: "soft",
      density: "standard",
      radius: "md",
    },
  }
);

const formControlRecipeRuntime = cva(
  "group/form-control flex flex-col p-(--field-spacing) [&_[data-slot=label]]:font-medium [&_[data-slot=state]]:text-muted-foreground",
  {
    variants: {
      density: densitySpacingClasses satisfies Record<Density, string>,
      size: formControlSizeClasses satisfies Record<GovernedSize, string>,
    },
    defaultVariants: {
      density: "standard",
      size: "md",
    },
  }
);

const tableRecipeRuntime = cva(
  "group/table w-full caption-bottom text-foreground [&_[data-slot=table-header]]:border-b [&_[data-slot=table-body]]:[&_[data-slot=table-row]:last-child]:border-0",
  {
    variants: {
      density: {
        compact: "[--table-density:compact]",
        standard: "[--table-density:standard]",
        comfortable: "[--table-density:comfortable]",
      } satisfies Record<Density, string>,
      size: tableSizeClasses satisfies Record<GovernedSize, string>,
    },
    defaultVariants: {
      density: "standard",
      size: "sm",
    },
  }
);

function normalizePanelRecipeArgs(
  selection: VariantSelection,
  resolvePanelVariant: (input: VariantSelection) => VariantSelection
): {
  density: Density;
  radius: GovernedPanelRadius;
  shadow: GovernedPanelShadow;
} {
  const normalized = resolvePanelVariant(selection);
  const radius = normalized.radius ?? "md";
  const shadow = normalized.shadow ?? "raised";

  if (!isGovernedPanelRadius(radius)) {
    throw new Error(
      `TIP-004 panel recipe violation. Unsupported radius "${radius}". Allowed: none, sm, md, lg.`
    );
  }

  if (!isGovernedPanelShadow(shadow)) {
    throw new Error(
      `TIP-004 panel recipe violation. Unsupported shadow "${shadow}". Allowed: none, raised, overlay.`
    );
  }

  return {
    density: normalized.density ?? "standard",
    radius,
    shadow,
  };
}

function normalizeStatusRecipeArgs(selection: VariantSelection): {
  density: Density;
  radius: GovernedPanelRadius;
  tone: StatusTone;
} {
  const normalized = resolveStatusVariant(selection);
  const radius = normalized.radius ?? "md";

  if (!isGovernedPanelRadius(radius)) {
    throw new Error(
      `TIP-004 status recipe violation. Unsupported radius "${radius}". Allowed: none, sm, md, lg.`
    );
  }

  return {
    density: normalized.density ?? "standard",
    radius,
    tone: normalized.tone ?? "neutral",
  };
}

function resolveRecipeVariant(
  recipeName: GovernedRecipeName,
  selection: VariantSelection
): VariantSelection {
  switch (recipeName) {
    case "button":
      return resolveButtonVariant(selection);
    case "badge":
      return resolveBadgeVariant(selection);
    case "card":
      return resolveCardVariant(selection);
    case "surface":
      return resolveSurfaceVariant(selection);
    case "status":
      return resolveStatusVariant(selection);
    case "form-control":
      return resolveFormControlVariant(selection);
    case "table":
      return resolveTableVariant(selection);
    case "app-shell":
      return resolveAppShellVariant(selection);
    case "metadata-ui":
      return resolveMetadataUiVariant(selection);
  }
}

export function resolveGovernedRecipe(
  recipeName: GovernedRecipeName,
  selection: VariantSelection
): GovernedRecipeResult {
  const normalized = resolveRecipeVariant(recipeName, selection);

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
        className: resolveBadgeClassName(normalized),
      };
    case "card":
      return {
        recipeName,
        selection: normalized,
        className: resolveCardClassName(normalized),
      };
    case "surface":
      return {
        recipeName,
        selection: normalized,
        className: resolveSurfaceClassName(normalized),
      };
    case "status":
      return {
        recipeName,
        selection: normalized,
        className: resolveStatusClassName(normalized),
      };
    case "form-control":
      return {
        recipeName,
        selection: normalized,
        className: resolveFormControlClassName(normalized),
      };
    case "table":
      return {
        recipeName,
        selection: normalized,
        className: resolveTableClassName(normalized),
      };
    case "app-shell":
      return {
        recipeName,
        selection: normalized,
        className: resolveAppShellClassName(normalized),
      };
    case "metadata-ui":
      return {
        recipeName,
        selection: normalized,
        className: resolveMetadataUiClassName(normalized),
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
  return cardRecipeRuntime(
    normalizePanelRecipeArgs(selection, resolveCardVariant)
  );
}

export function resolveSurfaceClassName(selection: VariantSelection): string {
  return surfaceRecipeRuntime(
    normalizePanelRecipeArgs(selection, resolveSurfaceVariant)
  );
}

export function resolveStatusClassName(selection: VariantSelection): string {
  const args = normalizeStatusRecipeArgs(selection);
  return statusRecipeRuntime({
    tone: args.tone,
    density: args.density,
    radius: args.radius,
  });
}

export function resolveFormControlClassName(
  selection: VariantSelection
): string {
  const normalized = resolveFormControlVariant(selection);
  return formControlRecipeRuntime({
    density: normalized.density ?? "standard",
    size: normalized.size ?? "md",
  });
}

export function resolveTableClassName(selection: VariantSelection): string {
  const normalized = resolveTableVariant(selection);
  return tableRecipeRuntime({
    density: normalized.density ?? "standard",
    size: normalized.size ?? "sm",
  });
}

export function resolveToggleClassName(input: {
  variant?: ToggleVariantKey;
  size?: ToggleSizeKey;
}): string {
  const variant = input.variant ?? "default";
  const size = input.size ?? "default";

  return cn(
    toggleRootSlotClassName,
    toggleVariantClassNames[variant],
    toggleSizeClassNames[size]
  );
}

export function resolveGovernedRecipeClassName(
  recipeName: GovernedRecipeName,
  selection: VariantSelection
): string {
  return resolveGovernedRecipe(recipeName, selection).className;
}

export function resolveFieldOrientationClassName(
  orientation: keyof typeof fieldOrientationClasses
): string {
  return fieldOrientationClasses[orientation];
}
