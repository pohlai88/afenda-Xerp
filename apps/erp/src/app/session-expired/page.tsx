import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Session expired",
};

export default function SessionExpiredPage() {
  const data = loadAuthIngressSurfacePage("/session-expired");

  return <AuthIngressSurfacePage data={data} />;
}
