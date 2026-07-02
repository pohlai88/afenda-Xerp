import type { AdminUsersPageModel } from "@/lib/lab/load-admin-users-page.server";

import { AdminUsersContent } from "./admin-users-content.client";

export interface AdminUsersPanelProps {
  readonly model: AdminUsersPageModel;
}

export function AdminUsersPanel({ model }: AdminUsersPanelProps) {
  const { page } = model;

  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="font-semibold text-2xl tracking-tight">{page.title}</h1>
        <p className="text-muted-foreground text-sm">{page.description}</p>
      </header>
      <AdminUsersContent model={model} />
    </div>
  );
}
