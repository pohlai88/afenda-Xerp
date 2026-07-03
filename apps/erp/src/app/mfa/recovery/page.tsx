import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Recovery code",
};

export default function MfaRecoveryPage() {
  const data = loadAuthIngressSurfacePage("/mfa/recovery");

  return <AuthIngressSurfacePage data={data} />;
}
