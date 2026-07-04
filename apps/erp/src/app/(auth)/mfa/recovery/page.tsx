import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/mfa/recovery");

export default function MfaRecoveryPage() {
  return renderAuthIngressPage("/mfa/recovery");
}
