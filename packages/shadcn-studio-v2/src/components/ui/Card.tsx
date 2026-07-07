import type { ComponentProps, ElementType } from "react";
import { cn } from "../../lib/cn";

export type CardVariant = "default" | "muted";

export interface CardProps extends ComponentProps<"div"> {
  readonly variant?: CardVariant;
}

const CARD_BASE_CLASS =
  "rounded-lg border border-border bg-card text-card-foreground shadow-sm";

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

export type CardTitleElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface CardTitleProps
  extends Omit<ComponentProps<"h3">, "data-slot"> {
  readonly as?: CardTitleElement;
  readonly "data-slot"?: string;
}

export function CardTitle({
  as: TitleTag = "h3",
  className,
  "data-slot": dataSlot = "card-title",
  ...props
}: CardTitleProps) {
  const Tag = TitleTag as ElementType;

  return (
    <Tag
      {...props}
      className={cn("font-semibold leading-none", className)}
      data-slot={dataSlot}
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
