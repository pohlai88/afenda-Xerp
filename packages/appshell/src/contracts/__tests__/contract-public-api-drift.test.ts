import { describe, expect, it } from "vitest";
import type {
  ApplicationShellIdentity as TypesIdentity,
  ApplicationShellOperatingContext as TypesOperatingContext,
} from "../../app-shell.types.js";
import { APPSHELL_CONTEXT_SURFACE_RULE as REGISTRY_SURFACE_RULE } from "../../context/appshell-context-surface-registry.js";
import type {
  ApplicationShellIdentity as PackageIdentity,
  ManifestModuleId as PackageManifestModuleId,
  ApplicationShellOperatingContext as PackageOperatingContext,
} from "../../index.js";
import * as packageExports from "../../index.js";
import { MANIFEST_MODULE_IDS as BUILDER_MODULE_IDS } from "../../navigation/build-nav-from-manifest.js";
import {
  type ApplicationShellIdentity,
  type ApplicationShellOperatingContext,
  APPSHELL_CONTEXT_SURFACE_RULE as CONTRACT_SURFACE_RULE,
} from "../context.contract.js";
import {
  MANIFEST_MODULE_IDS as CONTRACT_MODULE_IDS,
  type ManifestModuleId,
} from "../navigation.contract.js";
import type {
  AssertContractAligned,
  AssertRegistryAssignable,
} from "./contract-type-assertions.js";

type _PackageOperatingContextMatchesContract = AssertContractAligned<
  PackageOperatingContext,
  ApplicationShellOperatingContext
>;

type _TypesOperatingContextMatchesContract = AssertContractAligned<
  TypesOperatingContext,
  ApplicationShellOperatingContext
>;

type _PackageManifestModuleIdMatchesContract = AssertContractAligned<
  PackageManifestModuleId,
  ManifestModuleId
>;

type _BuilderModuleIdsAssignableToContract = AssertRegistryAssignable<
  typeof BUILDER_MODULE_IDS,
  ManifestModuleId
>;

describe("contract public API drift guard", () => {
  it("re-exports context authority constants from contracts via package index", () => {
    expect(packageExports.APPSHELL_CONTEXT_SURFACE_RULE).toBe(
      CONTRACT_SURFACE_RULE
    );
    expect(REGISTRY_SURFACE_RULE).toBe(CONTRACT_SURFACE_RULE);
  });

  it("re-exports manifest module ids from contracts through nav builder", () => {
    expect(packageExports.MANIFEST_MODULE_IDS).toBe(CONTRACT_MODULE_IDS);
    expect(BUILDER_MODULE_IDS).toBe(CONTRACT_MODULE_IDS);
  });

  it("accepts boundary-safe operating context through public package types", () => {
    const operatingContext: PackageOperatingContext = {
      tenantLabel: "Acme Tenant",
      legalEntityLabel: "Acme Legal",
      workspaceLabel: "Default Workspace",
    };
    const identity: PackageIdentity = {
      displayName: "Alex Operator",
      email: "alex@example.com",
      userId: "user-1" as ApplicationShellIdentity["userId"],
    };

    const typedOperatingContext: TypesOperatingContext = operatingContext;
    const typedIdentity: TypesIdentity = identity;

    expect(typedOperatingContext.tenantLabel).toBe("Acme Tenant");
    expect(typedIdentity.displayName).toBe("Alex Operator");
  });
});
