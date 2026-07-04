import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/reset-password/success");

export default function ResetPasswordSuccessPage() {
  return renderAuthIngressPage("/reset-password/success");
}
