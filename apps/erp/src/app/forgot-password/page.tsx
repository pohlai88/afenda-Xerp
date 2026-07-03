import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ForgotPasswordPage() {
  const data = loadAuthIngressSurfacePage("/forgot-password");

  return <AuthIngressSurfacePage data={data} />;
}
