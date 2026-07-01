"use client";

import {
  DirectionProvider as DirectionProviderPrimitive,
  useDirection,
} from "@base-ui/react/direction-provider";
import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";

import { DIRECTION_SLOTS } from "./direction.contract.js";

type DirectionProviderProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DirectionProviderPrimitive>
>;

function DirectionProvider({ ...props }: DirectionProviderProps) {
  return (
    <DirectionProviderPrimitive
      {...props}
      data-slot={DIRECTION_SLOTS.provider}
    />
  );
}

export type { DirectionSlot } from "./direction.contract.js";
export type { DirectionProviderProps };
export { DirectionProvider, useDirection };
