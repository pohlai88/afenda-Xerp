import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Invitation invalid",
};

export default function InviteInvalidPage() {
  const data = loadAuthIngressSurfacePage("/invite/invalid");

  return <AuthIngressSurfacePage data={data} />;
}
