import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Use a passkey",
};

export default function PasskeyPage() {
  const data = loadAuthIngressSurfacePage("/passkey");

  return <AuthIngressSurfacePage data={data} />;
}
