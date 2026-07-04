import { getAfendaAuthSession } from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthWorkspaceSelection } from "@/components/auth/auth-workspace-selection.client";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";

export const metadata = {
  title: "Select organization",
};

export default async function OrganizationSelectPage() {
  const session = await getAfendaAuthSession(await headers());

  if (session === null) {
    redirect(AUTH_PATHS.signIn);
  }

  return <AuthWorkspaceSelection kind="organization" />;
}
