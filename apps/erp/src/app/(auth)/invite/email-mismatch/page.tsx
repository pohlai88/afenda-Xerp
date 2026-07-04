import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/invite/email-mismatch");

export default function InviteEmailMismatchPage() {
  return renderAuthIngressPage("/invite/email-mismatch");
}
