import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Email verified",
};

export default function VerifyEmailSuccessPage() {
  const data = loadAuthIngressSurfacePage("/verify-email/success");

  return <AuthIngressSurfacePage data={data} />;
}
