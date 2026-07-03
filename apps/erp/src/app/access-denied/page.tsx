import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Access denied",
};

export default function AccessDeniedPage() {
  const data = loadAuthIngressSurfacePage("/access-denied");

  return <AuthIngressSurfacePage data={data} />;
}
