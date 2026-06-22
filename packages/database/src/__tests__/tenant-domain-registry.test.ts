import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  DATABASE_TENANT_DOMAIN_MODULES,
  type DatabaseTenantDomainModule,
} from "../tenant-domain/tenant-domain-registry.js";

const databaseSrcRoot = join(import.meta.dirname, "..");

describe("@afenda/database tenant-domain registry", () => {
  it("includes every module from multi-tenancy.md", () => {
    const directories = DATABASE_TENANT_DOMAIN_MODULES.map(
      (module) => module.directory
    );

    expect(directories).toEqual([
      "tenant",
      "entity-group",
      "legal-entity",
      "ownership-interest",
      "organization-unit",
      "team",
      "project",
      "grant-scope",
      "tenant-domain",
    ] satisfies DatabaseTenantDomainModule[]);
  });

  it("exposes index.ts barrels for each domain directory", () => {
    for (const module of DATABASE_TENANT_DOMAIN_MODULES) {
      expect(
        existsSync(join(databaseSrcRoot, module.directory, "index.ts")),
        `${module.directory}/index.ts`
      ).toBe(true);
    }
  });

  it("aliases legal entity over company without renaming writes", () => {
    const source = readFileSync(
      join(databaseSrcRoot, "legal-entity/index.ts"),
      "utf8"
    );

    expect(source).toContain("../company/company.service.js");
    expect(source).toContain("LegalEntityLookupRow");
    expect(source).toContain("LegalEntityWriteInput");
    expect(source).toContain("InsertLegalEntityInput");
  });

  it("aliases organization unit over organization", () => {
    const source = readFileSync(
      join(databaseSrcRoot, "organization-unit/index.ts"),
      "utf8"
    );

    expect(source).toContain("../organization/organization.service.js");
    expect(source).toContain("OrganizationUnitLookupRow");
  });

  it("marks project as planned stub only", () => {
    const source = readFileSync(
      join(databaseSrcRoot, "project/project.contract.ts"),
      "utf8"
    );

    expect(source).toContain("PROJECT_DOMAIN_STATUS");
    expect(source).not.toContain("insertProject");
  });
});

type AssertSerializable<T> = T extends string | number | boolean | null
  ? true
  : T extends readonly (infer U)[]
    ? AssertSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _ProjectAuthoritySerializable = AssertSerializable<
  import("../project/project.contract.js").ProjectAuthorityRecord
>;
