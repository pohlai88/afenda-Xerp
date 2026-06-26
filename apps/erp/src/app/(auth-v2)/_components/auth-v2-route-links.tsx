import Link from "next/link";

import { buildAuthV2Path } from "@/lib/auth-v2/auth-v2-path.registry";
import type { AuthV2RouteId } from "@/lib/auth-v2/auth-v2-route.registry";

type AuthV2RouteLink = {
  readonly href: string;
  readonly label: string;
};

const AUTH_V2_ROUTE_LINKS: Partial<
  Record<AuthV2RouteId, readonly AuthV2RouteLink[]>
> = {
  signUp: [
    {
      href: buildAuthV2Path("signIn"),
      label: "Already have an account? Sign in",
    },
  ],
  forgotPassword: [
    { href: buildAuthV2Path("signIn"), label: "Back to sign in" },
  ],
  resetPassword: [
    {
      href: buildAuthV2Path("forgotPassword"),
      label: "Request a new reset link",
    },
    { href: buildAuthV2Path("signIn"), label: "Back to sign in" },
  ],
  verifyEmailSent: [
    { href: buildAuthV2Path("signIn"), label: "Return to sign in" },
  ],
  verifyEmail: [
    { href: buildAuthV2Path("signIn"), label: "Return to sign in" },
  ],
  verifyEmailExpired: [
    { href: buildAuthV2Path("signIn"), label: "Return to sign in" },
  ],
  verifyEmailSuccess: [
    { href: buildAuthV2Path("signIn"), label: "Continue to sign in" },
  ],
  resetPasswordSuccess: [
    {
      href: buildAuthV2Path("signIn", { notice: "password-reset" }),
      label: "Continue to sign in",
    },
  ],
  mfa: [{ href: buildAuthV2Path("signIn"), label: "Back to sign in" }],
  mfaRecovery: [
    { href: buildAuthV2Path("mfa"), label: "Use another verification method" },
  ],
  sessionExpired: [{ href: buildAuthV2Path("signIn"), label: "Sign in again" }],
  accessDenied: [
    { href: buildAuthV2Path("signIn"), label: "Return to sign in" },
  ],
};

export function AuthV2RouteLinks({ route }: { readonly route: AuthV2RouteId }) {
  const links = AUTH_V2_ROUTE_LINKS[route];
  if (links === undefined || links.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Related authentication links"
      className="erp-auth-v2-route-links"
    >
      <ul className="erp-auth-v2-route-links__list">
        {links.map((link) => (
          <li key={link.href}>
            <Link className="erp-auth-v2-route-links__link" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
