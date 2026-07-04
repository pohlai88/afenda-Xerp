import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/oauth/error");

export default function OauthErrorPage() {
  return renderAuthIngressPage("/oauth/error");
}
