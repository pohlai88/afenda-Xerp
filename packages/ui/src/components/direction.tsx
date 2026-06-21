"use client";

import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Direction } from "radix-ui";
import type * as React from "react";

const DIRECTION_RECIPE_NAME = "surface" as const;

function DirectionProvider({
  dir,
  direction,
  children,
  ...props
}: React.ComponentProps<typeof Direction.DirectionProvider> & {
  direction?: React.ComponentProps<typeof Direction.DirectionProvider>["dir"];
}) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Direction",
    recipeName: DIRECTION_RECIPE_NAME,
    slot: "root",
  });

  return (
    <Direction.DirectionProvider
      {...props}
      dir={direction ?? dir}
      {...governed.dataAttributes}
    >
      {children}
    </Direction.DirectionProvider>
  );
}

DirectionProvider.displayName = "DirectionProvider";

const useDirection = Direction.useDirection;

export { DirectionProvider, useDirection };
