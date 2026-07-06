import { AuthWorkspaceSelection } from "@/components/auth/auth-workspace-selection.client";
import { requireAuthenticatedAuthPage } from "@/lib/auth/require-authenticated-auth-page.server";

export const metadata = {
  title: "Select organization",
};

export default async function OrganizationSelectPage() {
  await requireAuthenticatedAuthPage();

  return <AuthWorkspaceSelection kind="organization" />;
}
