"use client";

import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

void resolvePrimitiveGovernance({
  componentName: "Form",
  recipeName: "form-control",
  slot: "root",
});

/** shadcn v4 base-nova form aliases — Field primitives with legacy Form naming. */
export {
  Field,
  Field as FormItem,
  FieldContent,
  FieldContent as FormControl,
  FieldDescription,
  FieldDescription as FormDescription,
  FieldError,
  FieldError as FormMessage,
  FieldGroup,
  FieldGroup as Form,
  FieldLabel,
  FieldLabel as FormLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field";
