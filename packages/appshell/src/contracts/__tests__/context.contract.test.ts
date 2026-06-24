import { describe, expect, it } from "vitest";

import type {
  ApplicationShellIdentity as TypesIdentity,
  ApplicationShellOperatingContext as TypesOperatingContext,
} from "../../app-shell.types.js";
import {
  APPSHELL_APPROVED_RUNTIME_DEPENDENCIES as REGISTRY_APPROVED_RUNTIME_DEPENDENCIES,
  APPSHELL_CONTEXT_CONSUMPTION_MODULES as REGISTRY_CONTEXT_CONSUMPTION_MODULES,
  APPSHELL_CONTEXT_SURFACE_RULE as REGISTRY_CONTEXT_SURFACE_RULE,
  APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES as REGISTRY_FORBIDDEN_AUTHORITY_DEPENDENCIES,
  APPSHELL_FORBIDDEN_AUTHORITY_SYMBOLS as REGISTRY_FORBIDDEN_AUTHORITY_SYMBOLS,
} from "../../context/appshell-context-surface-registry.js";
import {
  APPSHELL_APPROVED_RUNTIME_DEPENDENCIES,
  APPSHELL_CONTEXT_CONSUMPTION_MODULES,
  APPSHELL_CONTEXT_SURFACE_RULE,
  APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES,
  APPSHELL_FORBIDDEN_AUTHORITY_SYMBOLS,
  type ApplicationShellIdentity,
  type ApplicationShellOperatingContext,
} from "../context.contract.js";
import type {
  AssertAssignableToContract,
  AssertMutuallyAssignable,
} from "./type-assignability.js";

type _OperatingContextAligned = AssertMutuallyAssignable<
  TypesOperatingContext,
  ApplicationShellOperatingContext
>;

type _IdentityAligned = AssertMutuallyAssignable<
  TypesIdentity,
  ApplicationShellIdentity
>;

type _TypesOperatingContextAssignableToContract = AssertAssignableToContract<
  TypesOperatingContext,
  ApplicationShellOperatingContext
>;

describe("context.contract", () => {
  it("declares consume-only context surface rule", () => {
    expect(APPSHELL_CONTEXT_SURFACE_RULE).toBe(
      "consume-context-only; never-resolve-tenant-or-database-authority"
    );
    expect(REGISTRY_CONTEXT_SURFACE_RULE).toBe(APPSHELL_CONTEXT_SURFACE_RULE);
  });

  it("matches context consumption module registry paths", () => {
    expect(APPSHELL_CONTEXT_CONSUMPTION_MODULES).toEqual(
      REGISTRY_CONTEXT_CONSUMPTION_MODULES
    );
    expect(
      APPSHELL_CONTEXT_CONSUMPTION_MODULES.some(
        (module) => module.path === "app-shell-header.tsx"
      )
    ).toBe(true);
  });

  it("forbids authority packages and resolution symbols", () => {
    expect(APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES).toEqual(
      REGISTRY_FORBIDDEN_AUTHORITY_DEPENDENCIES
    );
    expect(APPSHELL_FORBIDDEN_AUTHORITY_SYMBOLS).toEqual(
      REGISTRY_FORBIDDEN_AUTHORITY_SYMBOLS
    );
    expect(APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES).toContain(
      "@afenda/database"
    );
    expect(APPSHELL_FORBIDDEN_AUTHORITY_SYMBOLS).toContain(
      "resolveOperatingContext"
    );
  });

  it("approves kernel and ui runtime dependencies only", () => {
    expect(APPSHELL_APPROVED_RUNTIME_DEPENDENCIES).toEqual(
      REGISTRY_APPROVED_RUNTIME_DEPENDENCIES
    );
    expect(APPSHELL_APPROVED_RUNTIME_DEPENDENCIES).toEqual([
      "@afenda/kernel",
      "@afenda/ui",
    ]);
  });

  it("accepts boundary-safe operating context and identity samples", () => {
    const operatingContext: ApplicationShellOperatingContext = {
      tenantLabel: "Acme Tenant",
      legalEntityLabel: "Acme Legal",
      workspaceLabel: "Default Workspace",
    };
    const identity: ApplicationShellIdentity = {
      displayName: "Alex Operator",
      email: "alex@example.com",
      userId: "user-1" as ApplicationShellIdentity["userId"],
    };

    expect(operatingContext.tenantLabel).toBe("Acme Tenant");
    expect(identity.displayName).toBe("Alex Operator");
  });
});
