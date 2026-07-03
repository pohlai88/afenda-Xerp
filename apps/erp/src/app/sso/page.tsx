import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Continue with SSO",
};

export default function SsoPage() {
  const data = loadAuthIngressSurfacePage("/sso");

  return <AuthIngressSurfacePage data={data} />;
}
