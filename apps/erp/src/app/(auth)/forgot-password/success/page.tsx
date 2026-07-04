import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/forgot-password/success");

export default function ForgotPasswordSuccessPage() {
  return renderAuthIngressPage("/forgot-password/success");
}
