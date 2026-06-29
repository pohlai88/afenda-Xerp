import type {
  ErpRuntimeModuleDefinition,
  ErpRuntimeModuleLifecycle,
  ErpRuntimeModuleStatus,
} from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertNonEmptyString,
  assertPermissionNamespaceFormat,
  assertRouteSlugFormat,
  assertRuntimeModuleKvCatalogParity,
} from "./internal/validation.js";

export interface DefineErpRuntimeModuleInput {
  readonly appOwner: string;
  readonly databaseOwner: string;
  readonly erpDomainModuleKvIds?: Readonly<Record<string, string>>;
  readonly knowledgeOwner: string;
  readonly kvId: string;
  readonly lifecycle: ErpRuntimeModuleLifecycle;
  readonly ownerPackage: string;
  readonly permissionNamespace: string;
  readonly permissionOwner: string;
  readonly routeSlug?: string;
  readonly runtimePackage: string;
  readonly runtimeStatus: ErpRuntimeModuleStatus;
  readonly slug: string;
  readonly wirePackage: string;
}

export function defineErpRuntimeModule(
  input: DefineErpRuntimeModuleInput
): ErpRuntimeModuleDefinition {
  assertModuleSlugFormat(input.slug, "slug");
  assertPermissionNamespaceFormat(
    input.permissionNamespace,
    "permissionNamespace"
  );
  const routeSlug = input.routeSlug ?? input.slug;
  assertRouteSlugFormat(routeSlug, "routeSlug");
  assertKvIdFormat(input.kvId);
  assertNonEmptyString(input.runtimePackage, "runtimePackage");
  assertNonEmptyString(input.wirePackage, "wirePackage");
  assertNonEmptyString(input.ownerPackage, "ownerPackage");
  assertNonEmptyString(input.databaseOwner, "databaseOwner");
  assertNonEmptyString(input.appOwner, "appOwner");
  assertNonEmptyString(input.permissionOwner, "permissionOwner");
  assertNonEmptyString(input.knowledgeOwner, "knowledgeOwner");

  const expectedWireSuffix = `/erp-domain/${input.slug}`;
  if (!input.wirePackage.endsWith(expectedWireSuffix)) {
    throw new Error(
      `wirePackage must end with "${expectedWireSuffix}" — got "${input.wirePackage}"`
    );
  }

  if (input.erpDomainModuleKvIds) {
    assertRuntimeModuleKvCatalogParity({
      slug: input.slug,
      kvId: input.kvId,
      erpDomainModuleKvIds: input.erpDomainModuleKvIds,
    });
  }

  return {
    slug: input.slug,
    kvId: input.kvId,
    permissionNamespace: input.permissionNamespace,
    routeSlug,
    runtimePackage: input.runtimePackage,
    wirePackage: input.wirePackage,
    ownerPackage: input.ownerPackage,
    databaseOwner: input.databaseOwner,
    appOwner: input.appOwner,
    permissionOwner: input.permissionOwner,
    knowledgeOwner: input.knowledgeOwner,
    lifecycle: input.lifecycle,
    runtimeStatus: input.runtimeStatus,
  } as const;
}
