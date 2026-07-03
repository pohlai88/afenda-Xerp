import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Invitation already used",
};

export default function InviteConsumedPage() {
  const data = loadAuthIngressSurfacePage("/invite/consumed");

  return <AuthIngressSurfacePage data={data} />;
}
