"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { TenantAuthBrand } from "@/lib/auth-v2/tenant-auth-brand.contract";

const AuthV2BrandContext = createContext<TenantAuthBrand | null>(null);

export function AuthV2BrandProvider({
  brand,
  children,
}: {
  readonly brand: TenantAuthBrand | null;
  readonly children: ReactNode;
}) {
  return (
    <AuthV2BrandContext.Provider value={brand}>
      {children}
    </AuthV2BrandContext.Provider>
  );
}

export function useAuthV2Brand(): TenantAuthBrand | null {
  return useContext(AuthV2BrandContext);
}
