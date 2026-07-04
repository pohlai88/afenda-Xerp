import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/verify-email/expired");

export default function VerifyEmailExpiredPage() {
  return renderAuthIngressPage("/verify-email/expired");
}
