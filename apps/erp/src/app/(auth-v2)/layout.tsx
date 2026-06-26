import type { Metadata } from "next";
import type { ReactNode } from "react";

import { resolveTenantAuthBrand } from "@/lib/auth-v2/resolve-tenant-auth-brand.server";
import { authMetadata } from "@/lib/metadata/site-metadata";

import { AuthV2BrandProvider } from "./_components/auth-v2-brand-context";
import "./auth-v2.css";

export const metadata: Metadata = authMetadata;

export default async function AuthV2Layout({
  children,
}: {
  children: ReactNode;
}) {
  const brand = await resolveTenantAuthBrand();

  return (
    <AuthV2BrandProvider brand={brand}>
      <div className="erp-auth-v2-segment">{children}</div>
    </AuthV2BrandProvider>
  );
}
