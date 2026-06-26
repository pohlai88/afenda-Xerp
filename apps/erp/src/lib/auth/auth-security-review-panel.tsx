"use client";

import { Button } from "@afenda/ui";
import Link from "next/link";
import { AUTH_SECURITY_COPY } from "@/lib/auth/auth-copy.registry";
import { getAuthSupportLink } from "@/lib/auth/auth-link.registry";
import { acknowledgeSecurityReviewAction } from "@/lib/auth/security-review.action";

export type AuthSecurityReviewPanelProps = {
  readonly formClassName: string;
  readonly linkClassName: string;
  readonly listClassName: string;
  readonly signInPath: string;
  readonly signOutPath?: string;
};

export function AuthSecurityReviewPanel({
  formClassName,
  linkClassName,
  listClassName,
  signInPath,
  signOutPath = "/api/auth/sign-out",
}: AuthSecurityReviewPanelProps) {
  const support = getAuthSupportLink("contactSupport");

  return (
    <div className={formClassName}>
      <ol className={listClassName}>
        {AUTH_SECURITY_COPY.securityReviewSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <form action={acknowledgeSecurityReviewAction}>
        <Button emphasis="solid" intent="primary" size="lg" type="submit">
          I reviewed this activity — continue
        </Button>
      </form>
      <p>
        <a className={linkClassName} href={support.href}>
          {support.label}
        </a>
      </p>
      <p>
        <Link className={linkClassName} href={signInPath}>
          Return to sign in
        </Link>
      </p>
      {signOutPath.length > 0 ? (
        <p>
          <a className={linkClassName} href={signOutPath}>
            Sign out
          </a>
        </p>
      ) : null}
    </div>
  );
}
