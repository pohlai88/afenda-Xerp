"use client";

import { ErpPresentationProviders } from "@afenda/shadcn-studio/theme";
import type { ReactNode } from "react";

export function LabPresentationProviders({
  children,
}: {
  children: ReactNode;
}) {
  return <ErpPresentationProviders>{children}</ErpPresentationProviders>;
}
