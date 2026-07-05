"use client";

import {
  ERROR_PAGE_COPY_REGISTRY,
  ErrorPageShell,
  type ErrorPageVariant,
} from "@afenda/shadcn-studio";
import type { ReactNode } from "react";

type ErpErrorPageProps = {
  readonly action?: ReactNode;
  readonly variant: ErrorPageVariant;
};

export function ErpErrorPage({ action, variant }: ErpErrorPageProps) {
  return (
    <ErrorPageShell {...ERROR_PAGE_COPY_REGISTRY[variant]} action={action} />
  );
}
