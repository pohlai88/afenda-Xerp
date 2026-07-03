import type { Metadata } from "next";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

export const metadata: Metadata = {
  title: "One-time passcode",
};

export default function OtpPage() {
  const data = loadAuthIngressSurfacePage("/otp");

  return <AuthIngressSurfacePage data={data} />;
}
