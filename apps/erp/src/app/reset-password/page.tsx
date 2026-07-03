import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Create new password",
};

export default function ResetPasswordPage() {
  const data = loadAuthIngressSurfacePage("/reset-password");

  return <AuthIngressSurfacePage data={data} />;
}
