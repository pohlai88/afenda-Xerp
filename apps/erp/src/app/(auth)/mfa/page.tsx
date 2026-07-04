import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/mfa");

export default function MfaPage() {
  return renderAuthIngressPage("/mfa");
}
