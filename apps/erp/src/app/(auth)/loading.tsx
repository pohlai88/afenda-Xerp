import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthFormFallback } from "@/app/(auth)/_components/auth-form-fallback";

export default function AuthLoading() {
  return (
    <AuthEntryPage route="signIn">
      <AuthFormFallback route="signIn" />
    </AuthEntryPage>
  );
}
