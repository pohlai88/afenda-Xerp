import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Workspace invitation",
};

export default function InvitePage() {
  const data = loadAuthIngressSurfacePage("/invite");

  return <AuthIngressSurfacePage data={data} />;
}
