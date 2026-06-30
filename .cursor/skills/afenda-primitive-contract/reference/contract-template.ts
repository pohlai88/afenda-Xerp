/**
 * Reference template — copy to packages/shadcn-studio/src/components/ui/{name}.contract.ts
 * Do not import this file from runtime code.
 */
import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.1.0" as const;

/** Stable id for metadata binding / diagnostics registries. */
export const EXAMPLE_PRIMITIVE_ID = "shadcn-studio.ui.example" as const;
export type ExamplePrimitiveId = typeof EXAMPLE_PRIMITIVE_ID;

export const EXAMPLE_SLOTS = {
  root: "example",
} as const;

export type ExampleSlotMap = typeof EXAMPLE_SLOTS;
export type ExampleSlot = ExampleSlotMap[keyof ExampleSlotMap];

export const exampleRootClassName = "flex w-full" as const;

export const exampleVariants = cva(exampleRootClassName, {
  variants: {
    size: {
      default: "h-9",
      sm: "h-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type ExampleVariantProps = VariantProps<typeof exampleVariants>;

/** JSON-serializable metadata payload for binding registries. */
export function examplePrimitiveMetadata() {
  return {
    id: EXAMPLE_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: EXAMPLE_SLOTS,
  } as const;
}
