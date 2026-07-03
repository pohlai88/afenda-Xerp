import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Verify email",
};

export default function VerifyEmailPage() {
  const data = loadAuthIngressSurfacePage("/verify-email");

  return <AuthIngressSurfacePage data={data} />;
}
