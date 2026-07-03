import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Verification expired",
};

export default function VerifyEmailExpiredPage() {
  const data = loadAuthIngressSurfacePage("/verify-email/expired");

  return <AuthIngressSurfacePage data={data} />;
}
