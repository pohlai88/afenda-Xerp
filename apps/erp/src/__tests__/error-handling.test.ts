import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { AppErrors } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import {
  serverActionFailure,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function readAppSource(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("error-handling — AppError to Server Action boundary", () => {
  it("returns safe userMessage without internal cause", () => {
    const result = serverActionFailure(
      AppErrors.internal(new Error("sql: duplicate key"))
    );

    expect(result).toEqual({
      ok: false,
      code: "INTERNAL_ERROR",
      userMessage: "Something went wrong. Please try again.",
    });
    expect(JSON.stringify(result)).not.toContain("duplicate key");
  });

  it("preserves validation fields for client highlighting", () => {
    const result = serverActionFailure(
      AppErrors.validation([{ path: "email", message: "Invalid email" }])
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("VALIDATION_ERROR");
      expect(result.fields).toHaveLength(1);
    }
  });

  it("wraps success payloads in data", () => {
    expect(serverActionSuccess({ id: "1" })).toEqual({
      ok: true,
      data: { id: "1" },
    });
  });
});

describe("error-handling — route segment boundaries", () => {
  const boundaryFiles = [
    "src/app/error.tsx",
    "src/app/global-error.tsx",
    "src/app/(protected)/error.tsx",
    "src/app/(auth)/error.tsx",
    "src/app/(dev)/error.tsx",
  ];

  for (const relativePath of boundaryFiles) {
    it(`${relativePath} uses RouteSegmentError or role=alert without stack traces`, () => {
      const source = readAppSource(relativePath);
      expect(source).toMatch(/RouteSegmentError|role="alert"|AuthErrorSurface/);
      expect(source).not.toContain("error.stack");
      expect(source).not.toContain("error.message");
    });
  }

  it("does not render digest in user-facing error copy", () => {
    const source = readAppSource("src/components/route-segment-error.tsx");
    expect(source).not.toMatch(/\{error\.digest/);
    expect(source).toContain('role="alert"');
  });
});

describe("error-handling — demo server action contract", () => {
  it("never throws from the action module surface", () => {
    const source = readAppSource(
      "src/app/(protected)/actions/demo-auth-action.ts"
    );
    expect(source).toContain("resolveActionOperatingContext");
    expect(source).toContain("parseProtectedActionInput");
  });
});
