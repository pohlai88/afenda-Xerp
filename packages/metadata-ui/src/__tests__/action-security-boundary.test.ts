import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { destructiveActionMissingConfirm } from "../actions/metadata-action-handler.js";
import { METADATA_ACTION_ERROR_CODES, metadataUiContract } from "../index.js";
import { METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS } from "../runtime/runtime.contract.js";

const packageRoot = join(import.meta.dirname, "../..");
const srcRoot = join(packageRoot, "src");

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__") {
        continue;
      }
      files.push(...collectSourceFiles(absolutePath));
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

describe("metadata-ui server-action security boundary", () => {
  it("does not declare or execute server actions in production source", () => {
    const violations: string[] = [];

    for (const filePath of collectSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      if (
        content.includes('"use server"') ||
        content.includes("'use server'")
      ) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });

  it("forbids database, permissions, and appshell runtime dependencies", () => {
    for (const forbidden of METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS) {
      expect(forbidden).toMatch(/^@afenda\//);
    }

    const packageJson = JSON.parse(
      readFileSync(join(packageRoot, "package.json"), "utf8")
    ) as { dependencies?: Record<string, string> };

    for (const forbidden of METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS) {
      expect(packageJson.dependencies?.[forbidden]).toBeUndefined();
    }
  });

  it("documents that server action execution is prohibited in package governance", () => {
    expect(metadataUiContract.doesNotOwn).toContain("server action execution");
    expect(metadataUiContract.doesNotOwn).toContain("session verification");
    expect(metadataUiContract.prohibits).toContain(
      "executing server actions directly"
    );
  });

  it("aligns handler failure codes with server-action-security vocabulary", () => {
    expect(METADATA_ACTION_ERROR_CODES).toEqual([
      "UNAUTHORIZED",
      "FORBIDDEN",
      "NOT_FOUND",
      "VALIDATION_ERROR",
      "CONFLICT",
      "INTERNAL_ERROR",
    ]);
  });

  it("keeps server surfaces free of interactive action handlers", () => {
    const surfaceActionsSource = readFileSync(
      join(srcRoot, "surfaces/metadata-surface-actions.tsx"),
      "utf8"
    );

    expect(surfaceActionsSource).not.toContain("onAction");
    expect(surfaceActionsSource).not.toContain("onClick");
    expect(surfaceActionsSource).not.toContain('"use client"');
  });

  it("requires destructive metadata actions to declare confirm metadata", () => {
    expect(
      destructiveActionMissingConfirm({
        key: "delete",
        label: "Delete",
        kind: "destructive",
      })
    ).toBe(true);

    expect(
      destructiveActionMissingConfirm({
        key: "delete",
        label: "Delete",
        kind: "destructive",
        confirm: {
          title: "Delete record?",
          description: "This cannot be undone.",
          confirmLabel: "Delete",
        },
      })
    ).toBe(false);
  });
});
