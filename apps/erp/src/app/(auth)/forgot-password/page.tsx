import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/forgot-password");

export default function ForgotPasswordPage() {
  return renderAuthIngressPage("/forgot-password");
}
