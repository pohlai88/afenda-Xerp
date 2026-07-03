import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page.js";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server.js";

export const metadata = {
  title: "Check your email | Afenda ERP",
  description: "Reset instructions were sent if the account exists.",
} as const;

export default function ForgotPasswordSuccessPage() {
  const data = loadAuthIngressSurfacePage("/forgot-password/success");

  return <AuthIngressSurfacePage data={data} />;
}
