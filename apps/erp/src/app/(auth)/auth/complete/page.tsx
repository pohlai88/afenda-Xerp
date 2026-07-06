import { AuthCompleteResolver } from "@/components/auth/auth-complete-resolver.client";
import { requireAuthenticatedAuthPage } from "@/lib/auth/require-authenticated-auth-page.server";

export const metadata = {
  title: "Completing sign-in",
};

export default async function AuthCompletePage() {
  await requireAuthenticatedAuthPage();

  return <AuthCompleteResolver />;
}
