import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/verify-email/success");

export default function VerifyEmailSuccessPage() {
  return renderAuthIngressPage("/verify-email/success");
}
