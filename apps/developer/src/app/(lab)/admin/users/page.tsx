import type { Metadata } from "next";
import { loadAdminUsersPage } from "@/lib/lab/load-admin-users-page.server";
import { AdminUsersPanel } from "./_components/admin-users-panel";

export const metadata: Metadata = {
  title: "Users",
};

export default async function AdminUsersPage() {
  const model = await loadAdminUsersPage();
  return <AdminUsersPanel model={model} />;
}
