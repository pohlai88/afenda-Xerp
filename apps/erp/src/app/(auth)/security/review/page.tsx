import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/security/review");

export default function SecurityReviewPage() {
  return renderAuthIngressPage("/security/review");
}
