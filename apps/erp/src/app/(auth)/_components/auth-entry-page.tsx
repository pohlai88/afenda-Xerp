"use client";

import {
  AuthShellBrandHeader,
  AuthShellEntryPage,
  type AuthShellEntryPageProps,
} from "@afenda/appshell/auth-shell";
import type { CSSProperties, ReactNode } from "react";

import {
  type AuthRouteId,
  resolveAuthRouteCopy,
} from "@/lib/auth/auth-route.registry";
import type { TenantAuthBrand } from "@/lib/auth/tenant-auth-brand.contract";

import { useAuthBrand } from "./auth-brand-context";
import { AuthPageFooter } from "./auth-page-footer";

export type AuthEntryPageProps = Pick<AuthShellEntryPageProps, "children"> & {
  readonly alternateAction?: ReactNode;
  readonly brand?: TenantAuthBrand | null;
  readonly legalNotice?: ReactNode;
  readonly route: AuthRouteId;
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

/**
 * App adapter — composes @afenda/appshell/auth-shell centered card layout.
 */
export function AuthEntryPage({
  alternateAction,
  brand: brandOverride,
  children,
  legalNotice,
  route,
}: AuthEntryPageProps) {
  const layoutBrand = useAuthBrand();
  const brand = brandOverride ?? layoutBrand;
  const { description, lane, title } = resolveAuthRouteCopy(route);

  const resolvedLegalNotice =
    legalNotice === undefined ? <AuthPageFooter route={route} /> : legalNotice;

  const shellStyle = brand
    ? ({ "--primary": brand.primaryColor } as CSSProperties)
    : undefined;

  const brandHeader = resolveBrandHeader(brand);

  return (
    <AuthShellEntryPage
      alternateAction={alternateAction}
      description={description}
      lane={lane}
      legalNotice={resolvedLegalNotice}
      {...(shellStyle ? { shellStyle } : {})}
      title={title}
      {...(brandHeader === undefined ? {} : { visual: brandHeader })}
    >
      {children}
    </AuthShellEntryPage>
  );
}
