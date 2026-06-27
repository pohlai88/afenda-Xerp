import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/85 disabled:bg-fd-secondary disabled:text-fd-secondary-foreground",
  outline:
    "border border-fd-border bg-transparent hover:bg-fd-accent hover:text-fd-accent-foreground",
  ghost: "hover:bg-fd-accent hover:text-fd-accent-foreground",
  secondary:
    "border border-fd-border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground",
} as const;

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background",
  {
    variants: {
      variant: variants,
      // fumadocs use `color` instead of `variant`
      color: variants,
      size: {
        default: "h-10 gap-2 px-4 py-2 text-sm",
        sm: "h-9 gap-1 px-3 py-1.5 text-xs",
        icon: "size-9 p-0 [&_svg]:size-5",
        "icon-sm": "size-8 p-0 [&_svg]:size-4.5",
        "icon-xs": "size-7 p-0 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "default",
    },
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  color,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, color, size, className }))}
      type={type}
      {...props}
    />
  );
}
