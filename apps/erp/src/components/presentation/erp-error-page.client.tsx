"use client";

import {
  ERROR_PAGE_COPY_REGISTRY,
  ErrorPageShell,
  type ErrorPageVariant,
} from "@afenda/shadcn-studio/error-ui";

type ErpErrorPageProps = {
  readonly variant: ErrorPageVariant;
};

export function ErpErrorPage({ variant }: ErpErrorPageProps) {
  return <ErrorPageShell {...ERROR_PAGE_COPY_REGISTRY[variant]} />;
}
