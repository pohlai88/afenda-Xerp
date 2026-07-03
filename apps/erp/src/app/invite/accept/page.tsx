import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Accept invitation",
};

export default function InviteAcceptPage() {
  const data = loadAuthIngressSurfacePage("/invite/accept");

  return <AuthIngressSurfacePage data={data} />;
}
