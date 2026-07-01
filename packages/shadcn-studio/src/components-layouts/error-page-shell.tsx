"use client";

import type { ReactNode } from "react";

import { DotGrid } from "../components-ui/bg-dot-grid.js";
import { Button } from "../components-ui/button.js";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import { cn } from "../utils/utils.js";

import {
  ERROR_PAGE_COPY_REGISTRY,
  type ErrorPageCopyWire,
} from "./error-page-shell.contract.js";
import { MorphingText } from "./morphing-text.js";

type ErrorPageShellProps = ErrorPageCopyWire & {
  readonly action?: ReactNode;
  readonly className?: string;
};

function ErrorPageShell({
  headline,
  title,
  description,
  morphingTexts,
  actionLabel,
  actionHref,
  action,
  className,
}: ErrorPageShellProps) {
  return (
    <div
      className={cn("grid min-h-dvh grid-cols-1 lg:grid-cols-2", className)}
      data-testid="error-page-shell"
    >
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <h1
          {...blockSlotDomMarkerProps("error.title")}
          className="mb-6 font-semibold text-5xl"
        >
          {headline}
        </h1>
        <h2 className="mb-1.5 font-semibold text-3xl">{title}</h2>
        <p
          {...blockSlotDomMarkerProps("error.message")}
          className="mb-6 max-w-sm text-muted-foreground"
        >
          {description}
        </p>
        <div {...blockSlotDomMarkerProps("error.action")}>
          {action ?? (
            <Button
              nativeButton={false}
              render={<a href={actionHref} />}
              size="lg"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="relative max-h-dvh w-full p-2 max-lg:hidden">
        <div className="relative h-full min-h-[24rem] w-full overflow-hidden rounded-2xl bg-black">
          <DotGrid
            activeColor="#10B981"
            baseColor="var(--muted-foreground)"
            displacement={14}
            dotSize={1.9}
            gap={22}
            maxScale={4}
            radius={160}
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <MorphingText
              className="font-bold text-7xl text-white xl:text-9xl"
              texts={morphingTexts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorPageShellBlock() {
  return <ErrorPageShell {...ERROR_PAGE_COPY_REGISTRY["404"]} />;
}

export type { ErrorPageShellProps };
export { ErrorPageShell, ErrorPageShellBlock };
export default ErrorPageShellBlock;
