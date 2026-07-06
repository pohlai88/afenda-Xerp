"use client";

import {
  PageSurface,
  type PageSurfaceProps,
} from "@afenda/shadcn-studio-v2/clients";
import type { ReactNode } from "react";

export interface ErpPageSurfaceLayoutProps
  extends Omit<PageSurfaceProps, "children"> {
  readonly children: ReactNode;
}

/** ERP route shell — projects PageSurface inside the protected app shell main region. */
export function ErpPageSurfaceLayout({
  children,
  state = "ready",
  ...props
}: ErpPageSurfaceLayoutProps) {
  return (
    <PageSurface state={state} {...props}>
      {children}
    </PageSurface>
  );
}
