import { AuthWorkspaceSelection } from "@/components/auth/auth-workspace-selection.client";
import { requireAuthenticatedAuthPage } from "@/lib/auth/require-authenticated-auth-page.server";

export const metadata = {
  title: "Select workspace",
};

export default async function WorkspaceSelectPage() {
  await requireAuthenticatedAuthPage();

  return <AuthWorkspaceSelection kind="workspace" />;
}
