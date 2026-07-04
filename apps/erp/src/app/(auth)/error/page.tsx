import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/error");

export default function AuthErrorPage() {
  return renderAuthIngressPage("/error");
}
