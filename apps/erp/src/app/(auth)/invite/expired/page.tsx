import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/invite/expired");

export default function InviteExpiredPage() {
  return renderAuthIngressPage("/invite/expired");
}
