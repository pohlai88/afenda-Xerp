import type { ReactNode } from "react";

type Gap = "xs" | "sm" | "md" | "lg";
type Align = "start" | "center" | "end";
type Justify = Align | "between";
type Padding = "xs" | "sm" | "md" | "lg";
type PaddingX = "xs" | "sm" | "md" | "lg";
type PaddingY = "xs" | "sm" | "md" | "lg";

const gapClass: Record<Gap, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

const alignClass: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

const justifyClass: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

const paddingClass: Record<Padding, string> = {
  xs: "p-1",
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
};

const paddingXClass: Record<PaddingX, string> = {
  xs: "px-1",
  sm: "px-2",
  md: "px-3",
  lg: "px-4",
};

const paddingYClass: Record<PaddingY, string> = {
  xs: "py-1",
  sm: "py-2",
  md: "py-3",
  lg: "py-4",
};

/** Constrains width so governed primitives are not infinitely wide in canvas. */
export function StoryFrame({
  children,
  width = "md",
  padding,
}: {
  readonly children: ReactNode;
  readonly width?: "sm" | "md" | "lg" | "xl";
  readonly padding?: Padding;
}) {
  const widthClass =
    width === "sm"
      ? "max-w-sm"
      : width === "md"
        ? "max-w-md"
        : width === "lg"
          ? "max-w-lg"
          : "max-w-xl";

  const classes = ["w-full", widthClass, padding ? paddingClass[padding] : ""]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

/**
 * Horizontal row of items. Raw layout classes are centralised here so
 * story composite examples do not teach copy-pasting bare Tailwind.
 */
export function StoryRow({
  children,
  className,
  gap = "sm",
  align = "center",
  justify = "start",
  wrap = false,
  padding,
  paddingX,
  paddingY,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly gap?: Gap;
  readonly align?: Align;
  readonly justify?: Justify;
  readonly wrap?: boolean;
  readonly padding?: Padding;
  readonly paddingX?: PaddingX;
  readonly paddingY?: PaddingY;
}) {
  const classes = [
    "flex",
    wrap ? "flex-wrap" : "",
    alignClass[align],
    justifyClass[justify],
    gapClass[gap],
    padding ? paddingClass[padding] : "",
    paddingX ? paddingXClass[paddingX] : "",
    paddingY ? paddingYClass[paddingY] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

/**
 * Vertical stack of items. Raw layout classes are centralised here so
 * story composite examples do not teach copy-pasting bare Tailwind.
 */
export function StoryStack({
  children,
  className,
  gap = "sm",
  padding,
  paddingX,
  paddingY,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly gap?: Gap;
  readonly padding?: Padding;
  readonly paddingX?: PaddingX;
  readonly paddingY?: PaddingY;
}) {
  const classes = [
    "flex",
    "flex-col",
    gapClass[gap],
    padding ? paddingClass[padding] : "",
    paddingX ? paddingXClass[paddingX] : "",
    paddingY ? paddingYClass[paddingY] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
