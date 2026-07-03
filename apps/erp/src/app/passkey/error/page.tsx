import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Passkey unavailable",
};

export default function PasskeyErrorPage() {
  const data = loadAuthIngressSurfacePage("/passkey/error");

  return <AuthIngressSurfacePage data={data} />;
}
