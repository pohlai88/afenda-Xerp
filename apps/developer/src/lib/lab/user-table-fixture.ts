import type { LabUserRow } from "./contracts";

export const labUserTableColumns = [
  { header: "User", id: "user" },
  { header: "Email", id: "email" },
  { header: "Role", id: "role" },
  { header: "Status", id: "status" },
] as const;

export function mapLabUsersToTableSurface(users: readonly LabUserRow[]) {
  return {
    caption: "Lab user directory fixtures shaped like future ERP records.",
    columns: labUserTableColumns.map((column) => ({
      header: column.header,
      id: column.id,
    })),
    description:
      "Presentation-only table surface — no transport layer or operator actions.",
    rows: users.map((user) => ({
      cells: {
        email: user.email,
        role: user.role,
        status: user.status,
        user: user.user,
      },
      id: user.id,
    })),
    title: "User directory",
  } as const;
}
