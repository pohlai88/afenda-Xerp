import React from "react";
/**
 * Storybook layout helpers for `@afenda/ui` primitive stories.
 *
 * Centralises flex spacing and canvas width so story files do not scatter raw
 * Tailwind gap/padding utilities (see component-source-governance.test.ts).
 *
 * Author layer only — not exported from the public `@afenda/ui` package API.
 */

import { cn } from "@afenda/ui/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export type StorySpacing = "xs" | "sm" | "md" | "lg";
export type StoryAlign = "start" | "center" | "end";
export type StoryJustify = StoryAlign | "between";
export type StoryFrameWidth = "sm" | "md" | "lg" | "xl" | "full";
export type StoryRowWidth = "auto" | "full" | "max";

const STORY_GAP_CLASS: Record<StorySpacing, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

const STORY_ALIGN_CLASS: Record<StoryAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

const STORY_JUSTIFY_CLASS: Record<StoryJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

const STORY_PADDING_CLASS: Record<StorySpacing, string> = {
  xs: "p-1",
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
};

const STORY_PADDING_X_CLASS: Record<StorySpacing, string> = {
  xs: "px-1",
  sm: "px-2",
  md: "px-3",
  lg: "px-4",
};

const STORY_PADDING_Y_CLASS: Record<StorySpacing, string> = {
  xs: "py-1",
  sm: "py-2",
  md: "py-3",
  lg: "py-4",
};

const STORY_FRAME_WIDTH_CLASS: Record<Exclude<StoryFrameWidth, "full">, string> =
  {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

const STORY_ROW_WIDTH_CLASS: Record<StoryRowWidth, string> = {
  auto: "w-auto",
  full: "w-full",
  max: "w-max",
};

export interface StoryLayoutProps {
  readonly padding?: StorySpacing;
  readonly paddingX?: StorySpacing;
  readonly paddingY?: StorySpacing;
}

function storyPaddingClasses(
  padding?: StorySpacing,
  paddingX?: StorySpacing,
  paddingY?: StorySpacing
): string {
  return cn(
    padding !== undefined ? STORY_PADDING_CLASS[padding] : undefined,
    paddingX !== undefined ? STORY_PADDING_X_CLASS[paddingX] : undefined,
    paddingY !== undefined ? STORY_PADDING_Y_CLASS[paddingY] : undefined
  );
}

export interface StoryFrameProps
  extends StoryLayoutProps,
    Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  readonly children: ReactNode;
  readonly align?: StoryAlign;
  readonly className?: string;
  readonly width?: StoryFrameWidth;
}

/** Constrains canvas width so governed primitives are not infinitely wide. */
export function StoryFrame({
  align,
  children,
  className,
  padding,
  paddingX,
  paddingY,
  width = "md",
  ...props
}: StoryFrameProps) {
  return (
    <div
      {...props}
      className={cn(
        "w-full",
        width === "full" ? "max-w-full" : STORY_FRAME_WIDTH_CLASS[width],
        align !== undefined && "flex flex-col",
        align !== undefined && STORY_ALIGN_CLASS[align],
        storyPaddingClasses(padding, paddingX, paddingY),
        className
      )}
      data-story-layout="frame"
    >
      {children}
    </div>
  );
}

StoryFrame.displayName = "StoryFrame";

export interface StoryRowProps
  extends StoryLayoutProps,
    Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  readonly align?: StoryAlign;
  readonly children: ReactNode;
  readonly className?: string;
  readonly gap?: StorySpacing;
  readonly grow?: boolean;
  readonly justify?: StoryJustify;
  readonly shrink?: boolean;
  readonly width?: StoryRowWidth;
  readonly wrap?: boolean;
}

/**
 * Horizontal row of story items. Prefer `gap`, `align`, and `justify` props over
 * raw Tailwind in story composition.
 */
export function StoryRow({
  align = "center",
  children,
  className,
  gap = "sm",
  grow = false,
  justify = "start",
  padding,
  paddingX,
  paddingY,
  shrink = false,
  width,
  wrap = false,
  ...props
}: StoryRowProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex",
        wrap && "flex-wrap",
        STORY_ALIGN_CLASS[align],
        STORY_JUSTIFY_CLASS[justify],
        STORY_GAP_CLASS[gap],
        grow && "flex-1",
        shrink && "min-w-0",
        width !== undefined && STORY_ROW_WIDTH_CLASS[width],
        storyPaddingClasses(padding, paddingX, paddingY),
        className
      )}
      data-story-layout="row"
    >
      {children}
    </div>
  );
}

StoryRow.displayName = "StoryRow";

export interface StoryStackProps
  extends StoryLayoutProps,
    Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  readonly align?: StoryAlign;
  readonly children: ReactNode;
  readonly className?: string;
  readonly gap?: StorySpacing;
  readonly grow?: boolean;
  readonly justify?: StoryJustify;
  readonly shrink?: boolean;
}

/**
 * Vertical stack of story items. Prefer `gap`, `align`, and `justify` props over
 * raw Tailwind in story composition.
 */
export function StoryStack({
  align,
  children,
  className,
  gap = "sm",
  grow = false,
  justify,
  padding,
  paddingX,
  paddingY,
  shrink = false,
  ...props
}: StoryStackProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col",
        STORY_GAP_CLASS[gap],
        align !== undefined && STORY_ALIGN_CLASS[align],
        justify !== undefined && STORY_JUSTIFY_CLASS[justify],
        grow && "flex-1",
        shrink && "min-w-0",
        storyPaddingClasses(padding, paddingX, paddingY),
        className
      )}
      data-story-layout="stack"
    >
      {children}
    </div>
  );
}

StoryStack.displayName = "StoryStack";

export interface StoryInsetProps
  extends StoryLayoutProps,
    Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  readonly border?: boolean;
  readonly children: ReactNode;
  readonly className?: string;
  readonly overflow?: "auto" | "hidden" | "visible";
  readonly rounded?: boolean;
}

/**
 * Bordered story surface for demos that need a card-like canvas without
 * composing governed Card primitives for chrome alone.
 */
export function StoryInset({
  border = true,
  children,
  className,
  overflow = "visible",
  padding,
  paddingX,
  paddingY,
  rounded = true,
  ...props
}: StoryInsetProps) {
  return (
    <div
      {...props}
      className={cn(
        border && "border border-border",
        rounded && "rounded-lg",
        overflow === "hidden" && "overflow-hidden",
        overflow === "auto" && "overflow-auto",
        storyPaddingClasses(padding, paddingX, paddingY),
        className
      )}
      data-story-layout="inset"
    >
      {children}
    </div>
  );
}

StoryInset.displayName = "StoryInset";

export interface StoryCaptionProps {
  readonly children: ReactNode;
  readonly width?: "sm" | "md";
}

/** Monospace row label for variant matrix stories (intent, density, state, …). */
export function StoryCaption({ children, width = "sm" }: StoryCaptionProps) {
  const widthClass = width === "sm" ? "w-24" : "w-32";

  return (
    <span
      className={cn(
        widthClass,
        "shrink-0 font-mono text-muted-foreground text-xs"
      )}
    >
      {children}
    </span>
  );
}

StoryCaption.displayName = "StoryCaption";
