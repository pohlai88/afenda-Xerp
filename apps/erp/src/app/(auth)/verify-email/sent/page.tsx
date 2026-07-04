import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/verify-email/sent");

export default function VerifyEmailSentPage() {
  return renderAuthIngressPage("/verify-email/sent");
}
