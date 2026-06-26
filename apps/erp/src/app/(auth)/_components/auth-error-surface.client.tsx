"use client";

import {
  AuthShellBrandHeader,
  AuthShellErrorEntryPage,
  type AuthShellErrorEntryPageProps,
} from "@afenda/appshell/auth-shell";
import Link from "next/link";
import type { CSSProperties } from "react";

import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import type { TenantAuthBrand } from "@/lib/auth/tenant-auth-brand.contract";

import { useAuthBrand } from "./auth-brand-context";

export type AuthSegmentErrorShellProps = Omit<
  AuthShellErrorEntryPageProps,
  "visual" | "shellStyle"
> & {
  readonly brand?: TenantAuthBrand | null;
};

function resolveBrandHeader(brand: TenantAuthBrand | null | undefined) {
  if (!brand) {
    return;
  }

  return (
    <AuthShellBrandHeader
      logoAlt={`${brand.productLabel} logo`}
      {...(brand.logoUrl ? { logoUrl: brand.logoUrl } : {})}
      productLabel={brand.productLabel}
    />
  );
}

export function AuthSegmentErrorShell({
  brand: brandOverride,
  escapeAction,
  ...errorProps
}: AuthSegmentErrorShellProps) {
  const layoutBrand = useAuthBrand();
  const brand = brandOverride ?? layoutBrand;

  const shellStyle = brand
    ? ({ "--primary": brand.primaryColor } as CSSProperties)
    : undefined;

  const resolvedEscape = escapeAction ?? <AuthSignInEscape />;
  const brandHeader = resolveBrandHeader(brand);

  return (
    <div className="erp-auth-error-page">
      <AuthShellErrorEntryPage
        {...errorProps}
        escapeAction={resolvedEscape}
        {...(shellStyle ? { shellStyle } : {})}
        {...(brandHeader === undefined ? {} : { visual: brandHeader })}
      />
    </div>
  );
}

export function AuthSignInEscape() {
  return (
    <p className="erp-auth-error-page__escape-notice">
      <Link className="erp-auth-form__link" href={AUTH_PATHS.signIn}>
        Return to sign in
      </Link>
    </p>
  );
}
