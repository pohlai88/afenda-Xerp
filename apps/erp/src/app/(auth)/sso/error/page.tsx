import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/sso/error");

export default function SsoErrorPage() {
  return renderAuthIngressPage("/sso/error");
}
