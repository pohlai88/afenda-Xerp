import {
  findTenantBySlug,
  getTenantSettingsByTenantId,
  type TenantAppearanceSettings,
} from "@afenda/database";
import { cache } from "react";

import { resolvePostAuthTenantSlug } from "@/lib/auth/resolve-post-auth-tenant-slug.server";
import { resolveObjectStorageService } from "@/lib/storage/resolve-object-storage-service.server";

import type { TenantAuthBrand } from "./tenant-auth-brand.contract";

const LOGO_DOWNLOAD_TTL_SECONDS = 60;

function mapAppearanceToBrand(
  appearance: TenantAppearanceSettings,
  logoUrl: string | null
): TenantAuthBrand {
  return {
    headline: appearance.headline,
    logoUrl,
    primaryColor: appearance.primaryColor,
    productLabel: appearance.productLabel,
    supportingText: appearance.supportingText,
  };
}

async function resolveLogoDownloadUrl(input: {
  readonly logoObjectId: string;
  readonly tenantId: string;
}): Promise<string | null> {
  const storageService = resolveObjectStorageService();

  if (storageService === null) {
    return null;
  }

  const expiresAt = new Date(
    Date.now() + LOGO_DOWNLOAD_TTL_SECONDS * 1000
  ).toISOString();

  const downloadResult = await storageService.generateDownloadUrl({
    expiresAt,
    objectId: input.logoObjectId,
    tenantId: input.tenantId,
  });

  if (downloadResult.status !== "success") {
    return null;
  }

  return downloadResult.value.url;
}

async function resolveTenantAuthBrandUncached(): Promise<TenantAuthBrand | null> {
  try {
    const tenantSlug = await resolvePostAuthTenantSlug();

    if (tenantSlug === null || tenantSlug.length === 0) {
      return null;
    }

    const tenant = await findTenantBySlug(tenantSlug);

    if (tenant === null || tenant.status !== "active") {
      return null;
    }

    const settings = await getTenantSettingsByTenantId(tenant.id);
    const appearance = settings?.appearance;

    if (!appearance?.enabled) {
      return null;
    }

    const logoUrl =
      appearance.logoObjectId === null
        ? null
        : await resolveLogoDownloadUrl({
            logoObjectId: appearance.logoObjectId,
            tenantId: tenant.id,
          });

    return mapAppearanceToBrand(appearance, logoUrl);
  } catch {
    // Degrade to package default brand when settings are unavailable (e.g. pending migration).
    return null;
  }
}

export const resolveTenantAuthBrand = cache(resolveTenantAuthBrandUncached);
