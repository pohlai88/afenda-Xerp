/**
 * Shared Step 6 tenant URL resolver enforcement (multi-tenancy.md §553–559).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  TENANT_URL_RESOLVER_FORBIDDEN_PATTERNS,
  TENANT_URL_RESOLVER_FUNCTIONS,
  TENANT_URL_RESOLVER_HEADER,
  TENANT_URL_RESOLVER_PROXY_PRESERVATIONS,
  MULTI_TENANCY_LEGAL_ENTITY_BOUNDARY_MARKERS,
  MULTI_TENANCY_MIDDLEWARE_PRESERVATION_MARKERS,
  MULTI_TENANCY_RESERVED_SUBDOMAIN_MARKERS,
  MULTI_TENANCY_TENANT_URL_RESOLVER_DIMENSIONS,
  MULTI_TENANCY_TENANT_URL_RESOLVER_FUNCTION_MARKERS,
  TIP_007_012_TENANT_URL_RESOLVER_SECTION,
} from "../multi-tenancy-tenant-url-resolver-registry.mts";
import { TIP_007_012_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";

export interface TenantUrlResolverEnforcementViolation {
  readonly rule: string;
  readonly file: string;
  readonly message: string;
}

function extractSection(content: string, heading: string): string | null {
  const headingIndex = content.indexOf(heading);
  if (headingIndex === -1) {
    return null;
  }

  const afterHeading = content.slice(headingIndex + heading.length);
  const nextSectionMatch = afterHeading.match(/\n## /);
  const sectionEnd =
    nextSectionMatch?.index === undefined
      ? content.length
      : headingIndex + heading.length + nextSectionMatch.index;

  return content.slice(headingIndex, sectionEnd);
}

function collectMissingMarkers(
  content: string,
  markers: readonly string[],
  rule: string,
  file: string,
  label: string
): TenantUrlResolverEnforcementViolation[] {
  const violations: TenantUrlResolverEnforcementViolation[] = [];

  for (const marker of markers) {
    if (!content.includes(marker)) {
      violations.push({
        rule,
        file,
        message: `${label} missing row marker: ${marker}`,
      });
    }
  }

  return violations;
}

function collectResolverFunctionViolations(
  repoRoot: string
): TenantUrlResolverEnforcementViolation[] {
  const violations: TenantUrlResolverEnforcementViolation[] = [];
  const erpSrc = join(repoRoot, "apps/erp/src");

  for (const entry of TENANT_URL_RESOLVER_FUNCTIONS) {
    const modulePath = join(erpSrc, entry.file);

    if (!existsSync(modulePath)) {
      violations.push({
        rule: "resolver-module-missing",
        file: modulePath,
        message: `Tenant URL resolver module missing: ${entry.file}`,
      });
      continue;
    }

    const moduleSource = readFileSync(modulePath, "utf8");
    if (!moduleSource.includes(entry.name)) {
      violations.push({
        rule: "resolver-function-missing",
        file: modulePath,
        message: `Tenant URL resolver function missing: ${entry.name}`,
      });
    }

    if (
      entry.name === "resolveTenantSlugFromHostname" &&
      !moduleSource.includes("isReservedTenantSubdomain")
    ) {
      violations.push({
        rule: "reserved-subdomain-check-missing",
        file: modulePath,
        message:
          "resolveTenantSlugFromHostname must reject reserved subdomains via isReservedTenantSubdomain",
      });
    }
  }

  return violations;
}

function collectProxyViolations(
  repoRoot: string
): TenantUrlResolverEnforcementViolation[] {
  const violations: TenantUrlResolverEnforcementViolation[] = [];
  const proxyPath = join(repoRoot, "apps/erp/src/proxy.ts");

  if (!existsSync(proxyPath)) {
    violations.push({
      rule: "proxy-missing",
      file: proxyPath,
      message: "apps/erp/src/proxy.ts is required for Step 6 tenant URL routing",
    });
    return violations;
  }

  const proxySource = readFileSync(proxyPath, "utf8");

  if (
    !proxySource.includes(TENANT_URL_RESOLVER_HEADER) &&
    !proxySource.includes("TENANT_SLUG_HEADER")
  ) {
    violations.push({
      rule: "proxy-tenant-header-missing",
      file: proxyPath,
      message: `proxy.ts must inject ${TENANT_URL_RESOLVER_HEADER} via TENANT_SLUG_HEADER`,
    });
  }

  if (!proxySource.includes("resolveTenantSlugFromHostname")) {
    violations.push({
      rule: "proxy-hostname-resolution-missing",
      file: proxyPath,
      message: "proxy.ts must resolve tenant slug from hostname",
    });
  }

  for (const preservation of TENANT_URL_RESOLVER_PROXY_PRESERVATIONS) {
    if (!proxySource.includes(preservation)) {
      violations.push({
        rule: "proxy-middleware-preservation-missing",
        file: proxyPath,
        message: `proxy.ts must preserve middleware behavior: ${preservation}`,
      });
    }
  }

  for (const forbidden of TENANT_URL_RESOLVER_FORBIDDEN_PATTERNS) {
    if (proxySource.includes(forbidden)) {
      violations.push({
        rule: "proxy-forbidden-company-from-subdomain",
        file: proxyPath,
        message: `proxy.ts must not select company from subdomain: ${forbidden}`,
      });
    }
  }

  const tenantDomainPath = join(
    repoRoot,
    "apps/erp/src/lib/context/tenant-domain.ts"
  );
  if (existsSync(tenantDomainPath)) {
    const tenantDomainSource = readFileSync(tenantDomainPath, "utf8");
    for (const forbidden of TENANT_URL_RESOLVER_FORBIDDEN_PATTERNS) {
      if (tenantDomainSource.includes(forbidden)) {
        violations.push({
          rule: "tenant-domain-forbidden-company-from-subdomain",
          file: tenantDomainPath,
          message: `tenant-domain.ts must not select company from subdomain: ${forbidden}`,
        });
      }
    }
  }

  return violations;
}

function collectReservedSubdomainViolations(
  repoRoot: string
): TenantUrlResolverEnforcementViolation[] {
  const violations: TenantUrlResolverEnforcementViolation[] = [];
  const constantsPath = join(
    repoRoot,
    "apps/erp/src/lib/context/context.constants.ts"
  );

  if (!existsSync(constantsPath)) {
    violations.push({
      rule: "context-constants-missing",
      file: constantsPath,
      message: "context.constants.ts is required for reserved subdomain list",
    });
    return violations;
  }

  const constantsSource = readFileSync(constantsPath, "utf8");

  if (!constantsSource.includes("RESERVED_TENANT_SUBDOMAINS")) {
    violations.push({
      rule: "reserved-subdomains-constant-missing",
      file: constantsPath,
      message: "RESERVED_TENANT_SUBDOMAINS must be exported from context.constants.ts",
    });
  }

  if (!constantsSource.includes("isReservedTenantSubdomain")) {
    violations.push({
      rule: "reserved-subdomain-helper-missing",
      file: constantsPath,
      message: "isReservedTenantSubdomain must be exported from context.constants.ts",
    });
  }

  for (const reserved of ["www", "app", "api"] as const) {
    if (!constantsSource.includes(`"${reserved}"`)) {
      violations.push({
        rule: "required-reserved-subdomain-missing",
        file: constantsPath,
        message: `RESERVED_TENANT_SUBDOMAINS must include ${reserved}`,
      });
    }
  }

  return violations;
}

function collectErpRegistryViolations(
  repoRoot: string
): TenantUrlResolverEnforcementViolation[] {
  const violations: TenantUrlResolverEnforcementViolation[] = [];
  const erpRegistryPath = join(
    repoRoot,
    "apps/erp/src/lib/context/tenant-url-resolver-registry.ts"
  );

  if (!existsSync(erpRegistryPath)) {
    violations.push({
      rule: "erp-registry-missing",
      file: erpRegistryPath,
      message: "apps/erp tenant-url-resolver-registry.ts is required",
    });
    return violations;
  }

  const erpRegistrySource = readFileSync(erpRegistryPath, "utf8");

  for (const entry of TENANT_URL_RESOLVER_FUNCTIONS) {
    if (!erpRegistrySource.includes(entry.name)) {
      violations.push({
        rule: "erp-registry-function-missing",
        file: erpRegistryPath,
        message: `ERP registry must document resolver function: ${entry.name}`,
      });
    }
  }

  if (!erpRegistrySource.includes(TENANT_URL_RESOLVER_HEADER)) {
    violations.push({
      rule: "erp-registry-header-missing",
      file: erpRegistryPath,
      message: `ERP registry must document header: ${TENANT_URL_RESOLVER_HEADER}`,
    });
  }

  return violations;
}

export function collectTenantUrlResolverViolations(
  repoRoot: string
): TenantUrlResolverEnforcementViolation[] {
  const violations: TenantUrlResolverEnforcementViolation[] = [];
  const deliveryDocPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);

  if (!existsSync(deliveryDocPath)) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryDocPath,
      message: `${TIP_007_012_DELIVERY_DOC} is required for Step 6 tenant URL tables`,
    });
    return violations;
  }

  const deliveryContent = readFileSync(deliveryDocPath, "utf8");
  const sectionHeading = `## ${TIP_007_012_TENANT_URL_RESOLVER_SECTION}`;
  const tenantUrlSection = extractSection(deliveryContent, sectionHeading);

  if (tenantUrlSection === null) {
    violations.push({
      rule: "tenant-url-section-missing",
      file: deliveryDocPath,
      message: `Delivery doc missing section: ${sectionHeading}`,
    });
    return violations;
  }

  for (const dimension of MULTI_TENANCY_TENANT_URL_RESOLVER_DIMENSIONS) {
    if (!tenantUrlSection.includes(dimension.tableMarker)) {
      violations.push({
        rule: "tenant-url-table-missing",
        file: deliveryDocPath,
        message: `Step 6 missing table: ${dimension.tableMarker}`,
      });
    }
  }

  violations.push(
    ...collectMissingMarkers(
      tenantUrlSection,
      MULTI_TENANCY_TENANT_URL_RESOLVER_FUNCTION_MARKERS,
      "resolver-function-row-missing",
      deliveryDocPath,
      "Tenant slug resolution"
    ),
    ...collectMissingMarkers(
      tenantUrlSection,
      MULTI_TENANCY_RESERVED_SUBDOMAIN_MARKERS,
      "reserved-subdomain-row-missing",
      deliveryDocPath,
      "Reserved subdomains"
    ),
    ...collectMissingMarkers(
      tenantUrlSection,
      MULTI_TENANCY_MIDDLEWARE_PRESERVATION_MARKERS,
      "middleware-preservation-row-missing",
      deliveryDocPath,
      "Middleware preservation"
    ),
    ...collectMissingMarkers(
      tenantUrlSection,
      MULTI_TENANCY_LEGAL_ENTITY_BOUNDARY_MARKERS,
      "legal-entity-boundary-row-missing",
      deliveryDocPath,
      "Legal entity boundary"
    )
  );

  violations.push(...collectResolverFunctionViolations(repoRoot));
  violations.push(...collectProxyViolations(repoRoot));
  violations.push(...collectReservedSubdomainViolations(repoRoot));
  violations.push(...collectErpRegistryViolations(repoRoot));

  return violations;
}
