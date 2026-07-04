import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/invite/invalid");

export default function InviteInvalidPage() {
  return renderAuthIngressPage("/invite/invalid");
}
