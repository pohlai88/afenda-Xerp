import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "Security review required",
};

export default function SecurityReviewPage() {
  const data = loadAuthIngressSurfacePage("/security/review");

  return <AuthIngressSurfacePage data={data} />;
}
