"use client";

import type { ReactNode } from "react";

import {
  ERROR_PAGE_COPY_REGISTRY,
  ErrorPageShell,
  type ErrorPageVariant,
} from "@afenda/shadcn-studio/error-ui";

type ErpErrorPageProps = {
  readonly action?: ReactNode;
  readonly variant: ErrorPageVariant;
};

export function ErpErrorPage({ action, variant }: ErpErrorPageProps) {
  return <ErrorPageShell {...ERROR_PAGE_COPY_REGISTRY[variant]} action={action} />;
}
