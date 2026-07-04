import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/sso");

export default function SsoPage() {
  return renderAuthIngressPage("/sso");
}
