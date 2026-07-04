import {
  createAuthIngressMetadata,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/otp");

export default function OtpPage() {
  return renderAuthIngressPage("/otp");
}
