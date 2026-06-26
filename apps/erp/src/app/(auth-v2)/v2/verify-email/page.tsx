import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2VerifyEmailState } from "@/app/(auth-v2)/_components/auth-v2-verify-email-state";
import { AUTH_V2_ROUTE_REGISTRY } from "@/lib/auth-v2/auth-v2-route.registry";

export const metadata = AUTH_V2_ROUTE_REGISTRY.verifyEmail.metadata;

export default function AuthV2VerifyEmailPage() {
  return (
    <AuthV2EntryPage route="verifyEmail">
      <AuthV2VerifyEmailState />
    </AuthV2EntryPage>
  );
}
