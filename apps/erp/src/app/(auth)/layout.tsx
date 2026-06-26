import type { Metadata } from "next";
import type { ReactNode } from "react";

import { resolveTenantAuthBrand } from "@/lib/auth/resolve-tenant-auth-brand.server";
import { authMetadata } from "@/lib/metadata/site-metadata";

import { AuthBrandProvider } from "./_components/auth-brand-context";
import "./auth.css";

export const metadata: Metadata = authMetadata;

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const brand = await resolveTenantAuthBrand();

  return (
    <AuthBrandProvider brand={brand}>
      <div className="erp-auth-segment">{children}</div>
    </AuthBrandProvider>
  );
}
