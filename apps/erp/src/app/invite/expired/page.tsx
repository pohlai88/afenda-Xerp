import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Invitation expired",
};

export default function InviteExpiredPage() {
  const data = loadAuthIngressSurfacePage("/invite/expired");

  return <AuthIngressSurfacePage data={data} />;
}
