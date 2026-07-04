import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/invite/consumed");

export default function InviteConsumedPage() {
  return renderAuthIngressPage("/invite/consumed");
}
