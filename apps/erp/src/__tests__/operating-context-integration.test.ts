import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { UNTRUSTED_CLIENT_AUTHORITY_FIELD_KEYS } from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY } from "@/lib/context/operating-context-protected-surface.registry";
import { rejectUntrustedAuthorityFields } from "@/lib/context/reject-untrusted-authority-fields";
import { parseProtectedActionInput } from "@/lib/server-actions/parse-protected-action-input";
import {
  ApiRouteError,
  parseRequestBody,
} from "@/server/api/runtime/api-validation";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function readAppSource(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

function listSourceFiles(directory: string, prefix: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relativePath = `${prefix}/${entry.name}`;
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listSourceFiles(fullPath, relativePath));
      continue;
    }

    if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      !entry.name.includes(".test.")
    ) {
      files.push(relativePath);
    }
  }

  return files;
}

function listProtectedServerActionFiles(): string[] {
  const srcRoot = join(appRoot, "src");
  return listSourceFiles(srcRoot, "src").filter((relativePath) => {
    const source = readAppSource(relativePath);
    return source.includes('"use server"');
  });
}

describe("operating-context integration — protected surface registry", () => {
  it("registry cites server-action binding and context switch delegates", () => {
    const actionSurfaces = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.filter(
      (entry) => entry.kind === "action"
    );

    expect(actionSurfaces.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        "protected-server-action-binding",
        "context-switch-action",
      ])
    );
    expect(
      actionSurfaces.every(
        (entry) => entry.delegate === "resolveActionOperatingContext"
      )
    ).toBe(true);
  });

  it("protected API authorization surface cites verified route resolver", () => {
    const apiSurface = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.find(
      (entry) => entry.id === "protected-api-authorization"
    );
    expect(apiSurface?.delegate).toBe(
      "resolveVerifiedApiRouteOperatingContext"
    );
  });
});

describe("operating-context integration — protected server actions", () => {
  const protectedServerActions = listProtectedServerActionFiles();

  it("discovers every server action module under apps/erp/src", () => {
    expect(protectedServerActions.length).toBeGreaterThanOrEqual(4);
    expect(protectedServerActions).toEqual(
      expect.arrayContaining([
        "src/app/(protected)/actions/demo-auth-action.ts",
        "src/lib/context/context-switch.action.ts",
        "src/lib/system-admin/refresh-accounting-readiness-gate-full.action.ts",
        "src/lib/system-admin/update-system-admin-settings.action.ts",
      ])
    );
  });

  for (const relativePath of protectedServerActions) {
    it(`${relativePath} resolves operating context via resolveActionOperatingContext`, () => {
      const source = readAppSource(relativePath);
      expect(source).toContain("resolveActionOperatingContext");
    });

    it(`${relativePath} does not trust session for tenant scope`, () => {
      const source = readAppSource(relativePath);
      expect(source).not.toMatch(/session\.user\.tenantId/);
      expect(source).not.toMatch(/session\.user\.companyId/);
    });
  }

  for (const relativePath of protectedServerActions.filter((path) =>
    path.includes("/actions/")
  )) {
    it(`${relativePath} uses protected action input parsing`, () => {
      const source = readAppSource(relativePath);
      expect(source).toContain("parseProtectedActionInput");
    });
  }
});

describe("operating-context integration — API handler boundary", () => {
  it("createApiHandler rejects untrusted authority fields before zod parse", () => {
    const source = readAppSource("src/server/api/runtime/api-validation.ts");
    expect(source).toContain("rejectUntrustedAuthorityFields");
    expect(source).toContain("parseRequestBody");
  });

  it("tenant-scoped API authorization resolves verified operating context", () => {
    const source = readAppSource("src/lib/api/authorize-api-route.ts");
    expect(source).toContain("resolveVerifiedApiRouteOperatingContext");
    expect(source).toContain("isAfendaAuthSessionLinked");
    expect(source).toContain("operatingContext:");
  });

  it("forbidden authority keys match multi-tenancy spec", () => {
    expect(UNTRUSTED_CLIENT_AUTHORITY_FIELD_KEYS).toEqual([
      "tenantId",
      "entityGroupId",
      "legalEntityId",
      "companyId",
      "organizationUnitId",
      "organizationId",
      "teamId",
      "projectId",
    ]);
  });
});

describe("operating-context integration — context switch action", () => {
  const actionSource = readAppSource(
    "src/lib/context/context-switch.action.ts"
  );
  const schemaSource = readAppSource(
    "src/lib/context/operating-context-selection.schema.ts"
  );

  it("accepts slug hints only via strict schema", () => {
    expect(actionSource).toContain("operatingContextSelectionHintsSchema");
    expect(schemaSource).toContain(".strict()");
    expect(schemaSource).not.toContain("companyId");
    expect(schemaSource).not.toContain("tenantId");
  });
});

describe("rejectUntrustedAuthorityFields", () => {
  it("returns validation error for tenant and company IDs in body", () => {
    const error = rejectUntrustedAuthorityFields({
      tenantId: "tenant-001",
      companyId: "company-001",
      message: "hello",
    });

    expect(error?.code).toBe("VALIDATION_ERROR");
    if (error?.code === "VALIDATION_ERROR") {
      expect(error.fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: "tenantId" }),
          expect.objectContaining({ path: "companyId" }),
        ])
      );
    }
  });

  it("allows payloads without authority fields", () => {
    expect(rejectUntrustedAuthorityFields({ message: "hello" })).toBeNull();
  });
});

describe("parseProtectedActionInput", () => {
  const schema = z.object({ message: z.string().min(1) });

  it("rejects authority fields before schema validation", () => {
    const result = parseProtectedActionInput(schema, {
      message: "hello",
      projectId: "project-001",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
    }
  });
});

describe("parseRequestBody authority guard", () => {
  const schema = z.object({ layout: z.literal(1) });

  it("rejects authority fields in API JSON bodies", () => {
    expect(() =>
      parseRequestBody(schema, {
        layout: 1,
        legalEntityId: "company-001",
      })
    ).toThrow(ApiRouteError);

    try {
      parseRequestBody(schema, {
        layout: 1,
        organizationUnitId: "org-001",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ApiRouteError);
      if (error instanceof ApiRouteError) {
        expect(error.code).toBe("validation_failed");
      }
    }
  });
});
