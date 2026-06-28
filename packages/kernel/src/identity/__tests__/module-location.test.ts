import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  IDENTITY_MODULE_BRAND_FILES,
  IDENTITY_MODULE_FAMILY_FILES,
  IDENTITY_MODULE_LAYOUT_POLICY,
  IDENTITY_MODULE_POSTGRES_FILES,
  IDENTITY_MODULE_PRIMITIVE_FILES,
  IDENTITY_MODULE_ROOT_BARREL,
  IDENTITY_MODULE_SUBFOLDERS,
  IDENTITY_MODULE_TENANT_HUMAN_REFERENCE_FILES,
  isIdentityModuleBrandFile,
  isIdentityModuleFamilyFile,
  isIdentityModulePostgresFile,
  isIdentityModulePrimitiveFile,
  isIdentityModuleSubfolder,
  isIdentityModuleTenantHumanReferenceFile,
  RETIRED_KERNEL_PLATFORM_ID_PATHS,
} from "../governance/identity-module-layout.contract.js";

const kernelRoot = fileURLToPath(new URL("../../..", import.meta.url));
const identityDir = join(kernelRoot, "src/identity");
const brandDir = join(identityDir, "brand");
const familiesDir = join(identityDir, "families");
const postgresDir = join(identityDir, "postgres");
const primitivesDir = join(identityDir, "primitives");
const tenantHumanReferenceDir = join(identityDir, "tenant-human-reference");

describe("identity module location (PAS-001 §4.1.2)", () => {
  it("exports layout policy aligned with PAS §4.1.2", () => {
    expect(IDENTITY_MODULE_LAYOUT_POLICY.pasSection).toBe("4.1.2");
    expect(IDENTITY_MODULE_LAYOUT_POLICY.subfolders).toHaveLength(10);
    expect(IDENTITY_MODULE_LAYOUT_POLICY.prohibitedPatterns).toContain(
      "duplicate platform-id*.ts paths"
    );
  });

  it("narrows subfolder, family, brand, and primitive file names at the boundary", () => {
    expect(isIdentityModuleSubfolder("wire")).toBe(true);
    expect(isIdentityModuleSubfolder("contracts")).toBe(false);
    expect(isIdentityModuleFamilyFile("tenant-hierarchy-id.contract.ts")).toBe(
      true
    );
    expect(isIdentityModuleFamilyFile("hierarchy-id.contract.ts")).toBe(false);
    expect(isIdentityModuleBrandFile("brand.contract.ts")).toBe(true);
    expect(isIdentityModuleBrandFile("legacy-brand.contract.ts")).toBe(false);
    expect(isIdentityModulePrimitiveFile("locale-code.contract.ts")).toBe(true);
    expect(isIdentityModulePrimitiveFile("legacy-locale.contract.ts")).toBe(
      false
    );
    expect(isIdentityModulePostgresFile("uuid-v7-format.contract.ts")).toBe(
      true
    );
    expect(isIdentityModulePostgresFile("legacy-uuid.contract.ts")).toBe(false);
    expect(
      isIdentityModuleTenantHumanReferenceFile(
        "tenant-human-reference.contract.ts"
      )
    ).toBe(true);
    expect(
      isIdentityModuleTenantHumanReferenceFile(
        "tenant-human-reference.parser.ts"
      )
    ).toBe(true);
    expect(
      isIdentityModuleTenantHumanReferenceFile(
        "tenant-human-reference.generation.ts"
      )
    ).toBe(false);
  });

  it("keeps only index.ts at identity root", () => {
    const rootEntries = readdirSync(identityDir);
    const rootFiles = rootEntries.filter((entry) =>
      statSync(join(identityDir, entry)).isFile()
    );

    expect(rootFiles).toEqual([IDENTITY_MODULE_ROOT_BARREL]);
  });

  it("lands every approved subfolder on disk", () => {
    const directories = readdirSync(identityDir).filter((entry) =>
      statSync(join(identityDir, entry)).isDirectory()
    );

    for (const subfolder of IDENTITY_MODULE_SUBFOLDERS) {
      expect(directories, subfolder).toContain(subfolder);
    }
  });

  it("rejects unexpected identity subfolders", () => {
    const directories = new Set(
      readdirSync(identityDir).filter((entry) =>
        statSync(join(identityDir, entry)).isDirectory()
      )
    );

    for (const directory of directories) {
      expect(
        isIdentityModuleSubfolder(directory),
        `unexpected folder: ${directory}`
      ).toBe(true);
    }
  });

  it("keeps approved brand contract files only", () => {
    const files = readdirSync(brandDir).filter((entry) =>
      statSync(join(brandDir, entry)).isFile()
    );

    expect(files.sort()).toEqual([...IDENTITY_MODULE_BRAND_FILES].sort());

    for (const fileName of files) {
      expect(isIdentityModuleBrandFile(fileName), fileName).toBe(true);
    }
  });

  it("keeps approved family contract files only", () => {
    const files = readdirSync(familiesDir).filter((entry) =>
      statSync(join(familiesDir, entry)).isFile()
    );

    expect(files.sort()).toEqual([...IDENTITY_MODULE_FAMILY_FILES].sort());

    for (const fileName of files) {
      expect(isIdentityModuleFamilyFile(fileName), fileName).toBe(true);
    }
  });

  it("keeps approved primitive module files only", () => {
    const files = readdirSync(primitivesDir).filter((entry) =>
      statSync(join(primitivesDir, entry)).isFile()
    );

    expect(files.sort()).toEqual([...IDENTITY_MODULE_PRIMITIVE_FILES].sort());

    for (const fileName of files) {
      expect(isIdentityModulePrimitiveFile(fileName), fileName).toBe(true);
    }
  });

  it("keeps approved postgres module files only", () => {
    const files = readdirSync(postgresDir).filter((entry) =>
      statSync(join(postgresDir, entry)).isFile()
    );

    expect(files.sort()).toEqual([...IDENTITY_MODULE_POSTGRES_FILES].sort());

    for (const fileName of files) {
      expect(isIdentityModulePostgresFile(fileName), fileName).toBe(true);
    }
  });

  it("keeps approved tenant human reference module files only", () => {
    const files = readdirSync(tenantHumanReferenceDir).filter((entry) =>
      statSync(join(tenantHumanReferenceDir, entry)).isFile()
    );

    expect(files.sort()).toEqual(
      [...IDENTITY_MODULE_TENANT_HUMAN_REFERENCE_FILES].sort()
    );

    for (const fileName of files) {
      expect(isIdentityModuleTenantHumanReferenceFile(fileName), fileName).toBe(
        true
      );
    }
  });

  it("retires legacy contracts/platform-id* paths", () => {
    for (const repoRelative of RETIRED_KERNEL_PLATFORM_ID_PATHS) {
      const kernelRelative = repoRelative.replace(/^packages\/kernel\//, "");
      expect(existsSync(join(kernelRoot, kernelRelative)), repoRelative).toBe(
        false
      );
    }
  });
});
