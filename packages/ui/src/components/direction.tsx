"use client";

import type { GovernedDirectionProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Direction } from "radix-ui";
import * as React from "react";

const DIRECTION_RECIPE_NAME = "surface" as const;

const DIRECTION_SLOT_ROLES = {
  root: "root",
} as const satisfies Record<string, "root">;

export interface DirectionProviderProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Direction.DirectionProvider>,
      "className" | "dir"
    >,
    GovernedDirectionProps {
  readonly className?: string;
  /** Canonical text direction — wins over `dir` when both are supplied. */
  readonly direction?: React.ComponentProps<
    typeof Direction.DirectionProvider
  >["dir"];
  readonly dir?: React.ComponentProps<typeof Direction.DirectionProvider>["dir"];
}

function DirectionProvider({
  className,
  dir,
  direction,
  state,
  children,
  ...props
}: DirectionProviderProps) {
  const resolvedDir = direction ?? dir;
  const governed = resolvePrimitiveGovernance({
    componentName: "Direction",
    recipeName: DIRECTION_RECIPE_NAME,
    state,
    slot: DIRECTION_SLOT_ROLES.root,
    className,
  });

  return (
    <Direction.DirectionProvider dir={resolvedDir ?? "ltr"}>
      <div
        {...applyGovernedPresentation(
          { ...props, style: { display: "contents" } },
          governed,
          resolvedDir === undefined ? undefined : { dir: resolvedDir }
        )}
      >
        {children}
      </div>
    </Direction.DirectionProvider>
  );
}

DirectionProvider.displayName = "DirectionProvider";

const useDirection = Direction.useDirection;

export { DirectionProvider, useDirection };
