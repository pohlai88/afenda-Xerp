import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/invite/accept");

export default function InviteAcceptPage() {
  return renderAuthIngressPage("/invite/accept");
}
