"use client";

import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

void resolvePrimitiveGovernance({
  componentName: "Form",
  recipeName: "form-control",
  slot: "root",
});

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field";

/** shadcn v4 base-nova form aliases — Field primitives with legacy Form naming. */
export {
  FieldGroup as Form,
  Field as FormItem,
  FieldLabel as FormLabel,
  FieldDescription as FormDescription,
  FieldError as FormMessage,
  FieldContent as FormControl,
} from "./field";
