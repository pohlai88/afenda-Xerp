"use client";

import {
  AuthShellErrorSurface,
  type AuthShellErrorSurfaceProps,
} from "@afenda/appshell/auth-shell";
import Link from "next/link";
import type { ReactNode } from "react";

import { AUTH_FORM_SIGN_IN_LINK } from "@/app/(auth)/_components/auth-form.copy";

export type AuthErrorSurfaceProps = AuthShellErrorSurfaceProps & {
  readonly children?: ReactNode;
};

export function AuthErrorSurface({
  children,
  ...surfaceProps
}: AuthErrorSurfaceProps) {
  return (
    <div className="erp-auth-error-page">
      <AuthShellErrorSurface {...surfaceProps} />
      {children}
    </div>
  );
}

export function AuthErrorSignInEscape() {
  return (
    <footer className="erp-auth-error-page__escape">
      <p className="erp-auth-form__alternates-label">Need a different path?</p>
      <p className="erp-auth-form__notice">
        <Link className="erp-auth-form__link" href={AUTH_FORM_SIGN_IN_LINK}>
          Return to sign in
        </Link>
      </p>
    </footer>
  );
}
