"use client";

import { buttonClassName } from "@afenda/shadcn-studio-v2/clients";
import type { ReactNode } from "react";

import type { ErrorPageCopyWire } from "@/lib/presentation/error-page.contract";

export type ErpErrorPageShellProps = ErrorPageCopyWire & {
  readonly action?: ReactNode;
  readonly className?: string;
};

export function ErpErrorPageShell({
  headline,
  title,
  description,
  actionLabel,
  actionHref,
  action,
  className,
}: ErpErrorPageShellProps) {
  return (
    <div
      className={`flex min-h-dvh flex-col items-center justify-center px-4 py-8 text-center ${className ?? ""}`}
      data-testid="error-page-shell"
    >
      <h1 className="mb-6 font-semibold text-5xl">{headline}</h1>
      <h2 className="mb-1.5 font-semibold text-3xl">{title}</h2>
      <p className="mb-6 max-w-sm text-muted-foreground">{description}</p>
      <div>
        {action ?? (
          <a
            className={buttonClassName({ size: "lg" })}
            href={actionHref}
          >
            {actionLabel}
          </a>
        )}
      </div>
    </div>
  );
}
