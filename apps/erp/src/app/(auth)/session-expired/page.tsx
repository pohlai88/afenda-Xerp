import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/session-expired");

export default function SessionExpiredPage() {
  return renderAuthIngressPage("/session-expired");
}
