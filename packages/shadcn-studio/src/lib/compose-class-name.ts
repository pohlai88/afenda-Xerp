import { cn } from "../utils/utils.js";

type ClassNameStateFn<TState> = (state: TState) => string | undefined;

type ClassNameInput<TState> = string | ClassNameStateFn<TState> | undefined;

/**
 * Merges a base primitive class string with Base UI's optional stateful className.
 * Supports `className` as string or `(state) => string` on Root, Item, Trigger, Panel, etc.
 */
export function composeClassName<TState>(
  baseClassName: string,
  className?: ClassNameInput<TState>
): string | ((state: TState) => string) {
  if (typeof className === "function") {
    return (state: TState) => cn(baseClassName, className(state));
  }

  return cn(baseClassName, className);
}

export type { ClassNameInput, ClassNameStateFn };
