import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/invite");

export default function InvitePage() {
  return renderAuthIngressPage("/invite");
}
