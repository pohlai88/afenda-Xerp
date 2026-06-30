"use client";

import type { MotionStyle, Transition } from "motion/react";
import { motion } from "motion/react";
import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

type BorderBeamProps = WithoutGovernedDataSlot<{
  borderWidth?: number;
  className?: string;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  duration?: number;
  initialOffset?: number;
  reverse?: boolean;
  size?: number;
  style?: React.CSSProperties;
  transition?: Transition;
}>;

function BorderBeam({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "var(--destructive)",
  colorTo = "var(--primary)",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) {
  return (
    <div
      className="border-(length:--border-beam-width) mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect pointer-events-none absolute inset-0 rounded-[inherit] border-transparent [mask-clip:padding-box,border-box]"
      style={
        {
          "--border-beam-width": `${borderWidth}px`,
        } as React.CSSProperties
      }
    >
      <motion.div
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        className={cn(
          "absolute aspect-square",
          "rounded-full bg-linear-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent",
          className
        )}
        initial={{ offsetDistance: `${initialOffset}%` }}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            ...style,
          } as MotionStyle
        }
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
}

export type { BorderBeamSlot } from "./border-beam.contract.js";
export type { BorderBeamProps };
export { BorderBeam };
