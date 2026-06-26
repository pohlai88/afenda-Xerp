"use client";

import { createContext, type ReactNode, use } from "react";

import type { TenantAuthBrand } from "@/lib/auth/tenant-auth-brand.contract";

const AuthBrandContext = createContext<TenantAuthBrand | null>(null);

export function AuthBrandProvider({
  brand,
  children,
}: {
  readonly brand: TenantAuthBrand | null;
  readonly children: ReactNode;
}) {
  return (
    <AuthBrandContext.Provider value={brand}>
      {children}
    </AuthBrandContext.Provider>
  );
}

export function useAuthBrand(): TenantAuthBrand | null {
  return use(AuthBrandContext);
}
