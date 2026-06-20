import type { ReactNode } from "react";

type Gap = "xs" | "sm" | "md" | "lg";
type Align = "start" | "center" | "end";

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

const justifyClass: Record<Align, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

/** Constrains width so governed primitives are not infinitely wide in canvas. */
export function StoryFrame({
  children,
  width = "md",
}: {
  readonly children: ReactNode;
  readonly width?: "sm" | "md" | "lg" | "xl";
}) {
  const widthClass =
    width === "sm"
      ? "max-w-sm"
      : width === "md"
        ? "max-w-md"
        : width === "lg"
          ? "max-w-lg"
          : "max-w-xl";

  return <div className={`w-full ${widthClass}`}>{children}</div>;
}

/**
 * Horizontal row of items. Raw layout classes are centralised here so
 * story composite examples do not teach copy-pasting bare Tailwind.
 */
export function StoryRow({
  children,
  gap = "sm",
  align = "center",
  justify = "start",
  wrap = false,
}: {
  readonly children: ReactNode;
  readonly gap?: Gap;
  readonly align?: Align;
  readonly justify?: Align;
  readonly wrap?: boolean;
}) {
  const classes = [
    "flex",
    wrap ? "flex-wrap" : "",
    alignClass[align],
    justifyClass[justify],
    gapClass[gap],
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
  gap = "sm",
}: {
  readonly children: ReactNode;
  readonly gap?: Gap;
}) {
  return <div className={`flex flex-col ${gapClass[gap]}`}>{children}</div>;
}
