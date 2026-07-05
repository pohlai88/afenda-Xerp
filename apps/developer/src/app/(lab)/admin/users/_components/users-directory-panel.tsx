import { SystemAdminUsersTableBlock } from "@afenda/shadcn-studio";
import type { AdminUsersPageData } from "@/lib/lab/contracts";

interface UsersDirectoryPanelProps {
  readonly pageData: AdminUsersPageData;
}

export function UsersDirectoryPanel({ pageData }: UsersDirectoryPanelProps) {
  return <SystemAdminUsersTableBlock data={pageData.users} />;
}
