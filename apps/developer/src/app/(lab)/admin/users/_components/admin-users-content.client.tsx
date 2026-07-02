"use client";

import { DatatableUserBlock } from "@afenda/shadcn-studio";

import type { AdminUsersPageModel } from "@/lib/lab/load-admin-users-page.server";

export interface AdminUsersContentProps {
  readonly model: AdminUsersPageModel;
}

export function AdminUsersContent({ model }: AdminUsersContentProps) {
  return <DatatableUserBlock data={[...model.page.rows]} />;
}
