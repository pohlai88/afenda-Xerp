"use client";

import {
  AuthShellBrandPanel,
  AuthShellEntryPage,
  type AuthShellEntryPageProps,
  AuthShellVisualPanel,
} from "@afenda/appshell/auth-shell-v2";
import type { CSSProperties, ReactNode } from "react";

import {
  type AuthV2RouteId,
  resolveAuthV2RouteCopy,
} from "@/lib/auth-v2/auth-v2-route.registry";
import type { TenantAuthBrand } from "@/lib/auth-v2/tenant-auth-brand.contract";

import { useAuthV2Brand } from "./auth-v2-brand-context";
import { AuthV2PageChrome } from "./auth-v2-page-chrome";

export type AuthV2EntryPageProps = Pick<AuthShellEntryPageProps, "children"> & {
  readonly alternateAction?: ReactNode;
  readonly brand?: TenantAuthBrand | null;
  readonly legalNotice?: ReactNode;
  readonly route: AuthV2RouteId;
  readonly showDefaultChrome?: boolean;
  readonly showRouteLinks?: boolean;
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

/**
 * V2 app adapter — composes @afenda/appshell/auth-shell-v2 only.
 * Does not import legacy `(auth)` components.
 */
export function AuthV2EntryPage({
  alternateAction,
  brand: brandOverride,
  children,
  legalNotice,
  route,
  showDefaultChrome = true,
  showRouteLinks = true,
}: AuthV2EntryPageProps) {
  const layoutBrand = useAuthV2Brand();
  const brand = brandOverride ?? layoutBrand;
  const { description, eyebrow, lane, title } = resolveAuthV2RouteCopy(route);

  const resolvedLegalNotice =
    legalNotice ??
    (showDefaultChrome ? (
      <AuthV2PageChrome route={route} showRouteLinks={showRouteLinks} />
    ) : null);

  const shellStyle = brand
    ? ({ "--af-auth-v2-brand": brand.primaryColor } as CSSProperties)
    : undefined;

  return (
    <AuthShellEntryPage
      alternateAction={alternateAction}
      description={description}
      eyebrow={eyebrow}
      lane={lane}
      legalNotice={resolvedLegalNotice}
      {...(shellStyle ? { shellStyle } : {})}
      title={title}
      visual={resolveBrandVisual(brand)}
    >
      {children}
    </AuthShellEntryPage>
  );
}
