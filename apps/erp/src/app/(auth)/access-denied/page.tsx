import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/access-denied");

export default function AccessDeniedPage() {
  return renderAuthIngressPage("/access-denied");
}
