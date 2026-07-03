import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Social sign-in failed",
};

export default function OauthErrorPage() {
  const data = loadAuthIngressSurfacePage("/oauth/error");

  return <AuthIngressSurfacePage data={data} />;
}
