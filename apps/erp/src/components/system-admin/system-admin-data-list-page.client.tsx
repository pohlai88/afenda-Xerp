"use client";

import type { ReactNode } from "react";
import { ErpPageSurfaceLayout } from "@/components/presentation/erp-page-surface-layout.client";
import { SystemAdminListToolbar } from "@/components/system-admin/system-admin-list-toolbar.client";

export interface SystemAdminDataListPageProps {
  readonly children: ReactNode;
  readonly createLabel: string;
  readonly description: string;
  readonly searchLabel: string;
  readonly title: string;
}

/** System-admin data-list format — PageSurface shell + list toolbar + DataTableSurface child. */
export function SystemAdminDataListPage({
  children,
  createLabel,
  description,
  searchLabel,
  title,
}: SystemAdminDataListPageProps) {
  return (
    <ErpPageSurfaceLayout
      description={description}
      state="ready"
      title={title}
      toolbar={
        <SystemAdminListToolbar
          createLabel={createLabel}
          searchLabel={searchLabel}
        />
      }
    >
      {children}
    </ErpPageSurfaceLayout>
  );
}
