"use client";

import {
  AuthShellBrandPanel,
  AuthShellErrorEntryPage,
  type AuthShellErrorEntryPageProps,
  AuthShellVisualPanel,
} from "@afenda/appshell/auth-shell-v2";
import Link from "next/link";
import type { CSSProperties } from "react";

import { AUTH_V2_PATHS } from "@/lib/auth-v2/auth-v2-path.registry";
import type { TenantAuthBrand } from "@/lib/auth-v2/tenant-auth-brand.contract";

import { useAuthV2Brand } from "./auth-v2-brand-context";

export type AuthV2SegmentErrorShellProps = Omit<
  AuthShellErrorEntryPageProps,
  "visual" | "shellStyle"
> & {
  readonly brand?: TenantAuthBrand | null;
};

function resolveBrandVisual(brand: TenantAuthBrand | null | undefined) {
  if (!brand) {
    return;
  }

  return (
    <AuthShellVisualPanel>
      <AuthShellBrandPanel
        brandColor={brand.primaryColor}
        headline={brand.headline}
        logoAlt={`${brand.productLabel} logo`}
        {...(brand.logoUrl ? { logoUrl: brand.logoUrl } : {})}
        productLabel={brand.productLabel}
        supportingText={brand.supportingText}
      />
    </AuthShellVisualPanel>
  );
}

export function AuthV2SegmentErrorShell({
  brand: brandOverride,
  escapeAction,
  ...errorProps
}: AuthV2SegmentErrorShellProps) {
  const layoutBrand = useAuthV2Brand();
  const brand = brandOverride ?? layoutBrand;

  const shellStyle = brand
    ? ({ "--af-auth-v2-brand": brand.primaryColor } as CSSProperties)
    : undefined;

  const resolvedEscape = escapeAction ?? <AuthV2SignInEscape />;

  return (
    <div className="erp-auth-v2-error-page">
      <AuthShellErrorEntryPage
        {...errorProps}
        escapeAction={resolvedEscape}
        {...(shellStyle ? { shellStyle } : {})}
        visual={resolveBrandVisual(brand)}
      />
    </div>
  );
}

export function AuthV2SignInEscape() {
  return (
    <p className="erp-auth-v2-error-page__escape-notice">
      <Link className="erp-auth-v2-form__link" href={AUTH_V2_PATHS.signIn}>
        Return to sign in
      </Link>
    </p>
  );
}
