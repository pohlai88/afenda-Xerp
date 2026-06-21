import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

export interface GovernedSlotProps extends React.HTMLAttributes<HTMLElement> {
  readonly children?: React.ReactNode;
}

/** Radix Slot adapter for governed `asChild` composition — no visual authority. */
export const GovernedSlot = React.forwardRef<HTMLElement, GovernedSlotProps>(
  ({ children, ...props }, ref) => (
    <Slot ref={ref} {...props}>
      {children}
    </Slot>
  )
);

GovernedSlot.displayName = "GovernedSlot";

export { Slot };
