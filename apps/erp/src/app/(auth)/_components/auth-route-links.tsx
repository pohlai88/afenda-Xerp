import Link from "next/link";

import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import type { AuthRouteId } from "@/lib/auth/auth-route.registry";

type AuthRouteLink = {
  readonly href: string;
  readonly label: string;
};

const AUTH_ROUTE_LINKS: Partial<Record<AuthRouteId, readonly AuthRouteLink[]>> =
  {
    signUp: [
      {
        href: buildAuthPath("signIn"),
        label: "Already have an account? Sign in",
      },
    ],
    forgotPassword: [
      { href: buildAuthPath("signIn"), label: "Back to sign in" },
    ],
    resetPassword: [
      {
        href: buildAuthPath("forgotPassword"),
        label: "Request a new reset link",
      },
      { href: buildAuthPath("signIn"), label: "Back to sign in" },
    ],
    verifyEmailSent: [
      { href: buildAuthPath("signIn"), label: "Return to sign in" },
    ],
    verifyEmail: [
      { href: buildAuthPath("signIn"), label: "Return to sign in" },
    ],
    verifyEmailExpired: [
      { href: buildAuthPath("signIn"), label: "Return to sign in" },
    ],
    verifyEmailSuccess: [
      { href: buildAuthPath("signIn"), label: "Continue to sign in" },
    ],
    resetPasswordSuccess: [
      {
        href: buildAuthPath("signIn", { notice: "password-reset" }),
        label: "Continue to sign in",
      },
    ],
    mfa: [{ href: buildAuthPath("signIn"), label: "Back to sign in" }],
    mfaRecovery: [
      { href: buildAuthPath("mfa"), label: "Use another verification method" },
    ],
    sessionExpired: [{ href: buildAuthPath("signIn"), label: "Sign in again" }],
    accessDenied: [
      { href: buildAuthPath("signIn"), label: "Return to sign in" },
    ],
  };

export function AuthRouteLinks({ route }: { readonly route: AuthRouteId }) {
  const links = AUTH_ROUTE_LINKS[route];
  if (links === undefined || links.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Related authentication links"
      className="erp-auth-route-links"
    >
      <ul className="erp-auth-route-links__list">
        {links.map((link) => (
          <li key={link.href}>
            <Link className="erp-auth-route-links__link" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
