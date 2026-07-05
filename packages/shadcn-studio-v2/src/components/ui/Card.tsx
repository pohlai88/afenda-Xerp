// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type CardVariant = "default" | "muted";

export interface CardProps extends ComponentProps<"div"> {
  readonly variant?: CardVariant;
}

const CARD_BASE_CLASS =
  "rounded-xl border bg-card text-card-foreground shadow-sm";

const CARD_VARIANT_CLASSES = {
  default: "",
  muted: "bg-muted text-muted-foreground",
} satisfies Record<CardVariant, string>;

export function cardClassName({
  className,
  variant = "default",
}: Pick<CardProps, "className" | "variant"> = {}): string {
  return cn(CARD_BASE_CLASS, CARD_VARIANT_CLASSES[variant], className);
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cardClassName({ className, variant })}
      data-slot="card"
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      data-slot="card-header"
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      {...props}
      className={cn("font-semibold leading-none tracking-tight", className)}
      data-slot="card-title"
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="card-description"
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("p-6 pt-0", className)}
      data-slot="card-content"
    />
  );
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex items-center p-6 pt-0", className)}
      data-slot="card-footer"
    />
  );
}
