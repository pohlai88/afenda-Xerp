import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/passkey");

export default function PasskeyPage() {
  return renderAuthIngressPage("/passkey");
}
