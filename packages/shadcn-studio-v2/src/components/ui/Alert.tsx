// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type AlertVariant = "default" | "destructive";

export interface AlertProps extends ComponentProps<"div"> {
  readonly variant?: AlertVariant;
}

const ALERT_BASE_CLASS = "relative w-full rounded-lg border px-4 py-3 text-sm";

const ALERT_VARIANT_CLASSES = {
  default: "bg-background text-foreground",
  destructive:
    "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
} satisfies Record<AlertVariant, string>;

export function alertClassName({
  className,
  variant = "default",
}: Pick<AlertProps, "className" | "variant"> = {}): string {
  return cn(ALERT_BASE_CLASS, ALERT_VARIANT_CLASSES[variant], className);
}

export function Alert({
  className,
  role,
  variant = "default",
  ...props
}: AlertProps) {
  return (
    <div
      {...props}
      className={alertClassName({ className, variant })}
      data-slot="alert"
      role={role ?? (variant === "destructive" ? "alert" : "status")}
    />
  );
}

export function AlertTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("font-medium leading-none tracking-tight", className)}
      data-slot="alert-title"
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("mt-2 text-sm [&_p]:leading-relaxed", className)}
      data-slot="alert-description"
    />
  );
}
