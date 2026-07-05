// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type FieldOrientation = "vertical" | "horizontal";
export type FieldState = "default" | "invalid";

export interface FieldProps extends ComponentProps<"div"> {
  readonly orientation?: FieldOrientation;
  readonly state?: FieldState;
}

export interface FieldLabelProps
  extends Omit<ComponentProps<"label">, "htmlFor"> {
  readonly htmlFor: string;
  readonly required?: boolean;
  readonly requiredIndicator?: string;
}

export interface FieldMessageProps extends ComponentProps<"p"> {
  readonly state?: FieldState;
}

export type FieldErrorProps = Omit<FieldMessageProps, "state">;

const FIELD_BASE_CLASS = "grid gap-2";

const FIELD_ORIENTATION_CLASSES = {
  horizontal: "items-start md:grid-cols-[minmax(8rem,12rem)_1fr]",
  vertical: "",
} satisfies Record<FieldOrientation, string>;

const FIELD_STATE_CLASSES = {
  default: "",
  invalid: "text-destructive",
} satisfies Record<FieldState, string>;

export function fieldClassName({
  className,
  orientation = "vertical",
  state = "default",
}: Pick<FieldProps, "className" | "orientation" | "state"> = {}): string {
  return cn(
    FIELD_BASE_CLASS,
    FIELD_ORIENTATION_CLASSES[orientation],
    FIELD_STATE_CLASSES[state],
    className
  );
}

export function Field({
  className,
  orientation = "vertical",
  state = "default",
  ...props
}: FieldProps) {
  return (
    <div
      {...props}
      className={fieldClassName({ className, orientation, state })}
      data-invalid={state === "invalid" ? "" : undefined}
      data-slot="field"
      data-state={state}
    />
  );
}

export function FieldLabel({
  children,
  className,
  htmlFor,
  required = false,
  requiredIndicator = "*",
  ...props
}: FieldLabelProps) {
  return (
    <label
      {...props}
      className={cn(
        "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      data-required={required ? "" : undefined}
      data-slot="field-label"
      htmlFor={htmlFor}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="ml-1 text-destructive">
          {requiredIndicator}
        </span>
      ) : null}
    </label>
  );
}

export function FieldControl({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("min-w-0", className)}
      data-slot="field-control"
    />
  );
}

export function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="field-description"
    />
  );
}

export function FieldMessage({
  className,
  role,
  state = "default",
  ...props
}: FieldMessageProps) {
  return (
    <p
      {...props}
      className={cn("text-sm", FIELD_STATE_CLASSES[state], className)}
      data-slot="field-message"
      data-state={state}
      role={role}
    />
  );
}

export function FieldError({ className, role, ...props }: FieldErrorProps) {
  return (
    <p
      {...props}
      className={cn("text-sm", FIELD_STATE_CLASSES.invalid, className)}
      data-slot="field-error"
      role={role ?? "alert"}
    />
  );
}
