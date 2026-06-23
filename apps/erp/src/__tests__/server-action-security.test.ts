import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseActionInput } from "@/lib/server-actions/parse-action-input";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function readAppSource(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("server-action-security — static contract", () => {
  const actionSource = readAppSource(
    "src/app/(protected)/actions/demo-auth-action.ts"
  );

  it("re-verifies operating context before validation and mutation", () => {
    const contextIndex = actionSource.indexOf(
      "await resolveActionOperatingContext()"
    );
    const parseIndex = actionSource.indexOf("parseProtectedActionInput(");
    const auditIndex = actionSource.indexOf("await recordActionAudit(");

    expect(contextIndex).toBeGreaterThan(-1);
    expect(parseIndex).toBeGreaterThan(contextIndex);
    expect(auditIndex).toBeGreaterThan(parseIndex);
  });

  it("accepts untrusted unknown input", () => {
    expect(actionSource).toMatch(/input:\s*unknown/);
  });

  it("does not throw to the client", () => {
    expect(actionSource).not.toMatch(/\bthrow\b/);
  });

  it("uses object schema rather than trusting raw parameters", () => {
    expect(actionSource).toContain("z.object");
    expect(actionSource).toContain("message:");
  });

  it("returns serializable shaped success data only", () => {
    expect(actionSource).toContain("ProtectedDemoActionData");
    expect(actionSource).toMatch(
      /export type ProtectedDemoActionData = \{[\s\S]*?readonly message: string;[\s\S]*?\};/
    );
    expect(actionSource).not.toMatch(/serverActionSuccess\(\{[\s\S]*userId/);
  });
});

describe("server-action-security — parseActionInput", () => {
  it("maps invalid unknown input to VALIDATION_ERROR", () => {
    const schema = z.object({ message: z.string().min(1) });
    const result = parseActionInput(schema, { message: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
    }
  });
});

describe("server-action-security — module hygiene", () => {
  it("does not retain legacy map-zod-to-app-error module", () => {
    expect(() =>
      readAppSource("src/lib/server-actions/map-zod-to-app-error.ts")
    ).toThrow();
  });

  it("centralizes session resolution for actions", () => {
    const source = readAppSource(
      "src/lib/server-actions/resolve-action-session.ts"
    );
    expect(source).toContain("getAfendaAuthSession");
    expect(source).not.toContain("requireAfendaAuthSession");
  });
});
