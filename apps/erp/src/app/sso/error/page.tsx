import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "SSO unavailable",
};

export default function SsoErrorPage() {
  const data = loadAuthIngressSurfacePage("/sso/error");

  return <AuthIngressSurfacePage data={data} />;
}
