import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/verify-email");

export default function VerifyEmailPage() {
  return renderAuthIngressPage("/verify-email");
}
