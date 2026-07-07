import {
  createAuthIngressMetadata,
  renderAuthCompleteIngressPage,
} from "@/lib/auth/auth-ingress-page.server";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import { requireAuthenticatedAuthPage } from "@/lib/auth/require-authenticated-auth-page.server";

export const metadata = createAuthIngressMetadata(AUTH_PATHS.postAuthComplete);

export default async function AuthCompletePage() {
  await requireAuthenticatedAuthPage();

  return renderAuthCompleteIngressPage();
}
