"use client";

import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

const FORM_RECIPE_NAME = "form-control" as const;

/** Static governance anchor for the Form alias registry entry. */
void resolvePrimitiveGovernance({
  componentName: "Form",
  recipeName: FORM_RECIPE_NAME,
  slot: "root",
});

export type {
  FieldContentProps as FormControlProps,
  FieldGroupProps as FormProps,
  FieldProps as FormItemProps,
} from "./field";
/**
 * shadcn v4 Form aliases — governed Field primitives with legacy naming.
 *
 * | Form alias      | Field source     | Emitted `data-slot` |
 * |-----------------|------------------|---------------------|
 * | `Form`          | `FieldGroup`     | `field-group`       |
 * | `FormItem`      | `Field`          | `field`             |
 * | `FormLabel`     | `FieldLabel`     | `field-label`       |
 * | `FormControl`   | `FieldContent`   | `field-content`     |
 * | `FormDescription` | `FieldDescription` | `field-description` |
 * | `FormMessage`   | `FieldError`     | `field-error`       |
 */
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
