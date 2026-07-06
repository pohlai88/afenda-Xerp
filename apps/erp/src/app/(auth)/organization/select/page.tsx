import {
  createAuthIngressMetadata,
  renderAuthWorkspaceSelectIngressPage,
} from "@/lib/auth/auth-ingress-page.server";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import { requireAuthenticatedAuthPage } from "@/lib/auth/require-authenticated-auth-page.server";

export const metadata = createAuthIngressMetadata(
  AUTH_PATHS.organizationSelect
);

export default async function OrganizationSelectPage() {
  await requireAuthenticatedAuthPage();

  return renderAuthWorkspaceSelectIngressPage(
    AUTH_PATHS.organizationSelect,
    "organization"
  );
}
