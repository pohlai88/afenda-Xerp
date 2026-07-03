import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Check your email",
};

export default function VerifyEmailSentPage() {
  const data = loadAuthIngressSurfacePage("/verify-email/sent");

  return <AuthIngressSurfacePage data={data} />;
}
