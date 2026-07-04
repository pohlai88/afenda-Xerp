import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/reset-password");

export default function ResetPasswordPage() {
  return renderAuthIngressPage("/reset-password");
}
