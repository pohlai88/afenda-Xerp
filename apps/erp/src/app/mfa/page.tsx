import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Multi-factor verification",
};

export default function MfaPage() {
  const data = loadAuthIngressSurfacePage("/mfa");

  return <AuthIngressSurfacePage data={data} />;
}
