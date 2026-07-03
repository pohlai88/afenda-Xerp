import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Authentication error",
};

export default function AuthErrorPage() {
  const data = loadAuthIngressSurfacePage("/error");

  return <AuthIngressSurfacePage data={data} />;
}
