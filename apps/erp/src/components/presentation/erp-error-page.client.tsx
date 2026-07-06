"use client";

import { ErpErrorPageShell } from "@/components/presentation/erp-error-page-shell.client";
import {
  ERROR_PAGE_COPY_REGISTRY,
  type ErrorPageVariant,
} from "@/lib/presentation/error-page.contract";
import type { ReactNode } from "react";

type ErpErrorPageProps = {
  readonly action?: ReactNode;
  readonly variant: ErrorPageVariant;
};

export function ErpErrorPage({ action, variant }: ErpErrorPageProps) {
  return (
    <ErpErrorPageShell
      {...ERROR_PAGE_COPY_REGISTRY[variant]}
      action={action}
    />
  );
}
