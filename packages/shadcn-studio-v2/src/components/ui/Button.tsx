// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends ComponentProps<"button"> {
  readonly size?: ButtonSize;
  readonly variant?: ButtonVariant;
}

const BUTTON_BASE_CLASS =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const BUTTON_VARIANT_CLASSES = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "h-auto p-0 text-primary underline-offset-4 hover:underline",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
} satisfies Record<ButtonVariant, string>;

const BUTTON_SIZE_CLASSES = {
  default: "h-10 px-4 py-2",
  icon: "size-10",
  lg: "h-11 rounded-md px-8",
  sm: "h-9 rounded-md px-3",
} satisfies Record<ButtonSize, string>;

export function buttonClassName({
  className,
  size = "default",
  variant = "default",
}: Pick<ButtonProps, "className" | "size" | "variant"> = {}): string {
  return cn(
    BUTTON_BASE_CLASS,
    BUTTON_VARIANT_CLASSES[variant],
    BUTTON_SIZE_CLASSES[size],
    className
  );
}

export function Button({
  className,
  size = "default",
  type = "button",
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={buttonClassName({ className, size, variant })}
      data-slot="button"
      type={type}
    />
  );
}
