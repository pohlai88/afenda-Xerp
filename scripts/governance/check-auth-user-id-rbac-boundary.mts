#!/usr/bin/env tsx
/**
 * ARCH-AUTH-001 Slice 16 — AC-02 static gate.
 *
 * Forbids Better Auth `authUserId` from feeding authorization checks.
 * Platform `users.id` is the sole permission actor (PKG002_AUTH registry rule).
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const CONSUMER_SCAN_ROOTS = [
  join(repoRoot, "apps/erp/src"),
  join(repoRoot, "packages/appshell/src"),
  join(repoRoot, "packages/metadata-ui/src"),
  join(repoRoot, "packages/permissions/src"),
  join(repoRoot, "packages/kernel/src"),
] as const;

const ALLOWED_PATH_SEGMENTS = ["__tests__", "__mocks__"] as const;

/** Permission entrypoints that must never receive authUserId as actor. */
const PERMISSION_CALL_RE =
  /\b(?:checkPermission|requirePermission|assertPermission)\s*\(/;

const AUTH_USER_ID_RE = /\bauthUserId\b/;

const FORBIDDEN_ACTOR_PATTERNS = [
  {
    rule: "actor-id-auth-user-id",
    pattern: /actor\s*:\s*\{[^}]*actorId\s*:\s*[^}]*authUserId/s,
    message:
      "Permission actor.actorId must use platform users.id — never authUserId.",
  },
  {
    rule: "session-auth-user-id-permission",
    pattern: /session\.user\.authUserId[^;\n]{0,120}?(?:checkPermission|requirePermission)/s,
    message:
      "Do not derive permission actors from session.user.authUserId.",
  },
  {
    rule: "permission-session-auth-user-id",
    pattern: /(?:checkPermission|requirePermission)[^;]{0,200}?session\.user\.authUserId/s,
    message:
      "Do not pass session.user.authUserId into permission checks.",
  },
  {
    rule: "auth-user-id-permission-proximity",
    pattern:
      /(?:checkPermission|requirePermission)\([\s\S]{0,400}?authUserId|[\s\S]{0,400}?authUserId[\s\S]{0,400}?(?:checkPermission|requirePermission)/,
    message:
      "authUserId must not appear in the same permission-check call region.",
  },
] as const;

export interface AuthUserIdRbacViolation {
  readonly file: string;
  readonly line: number;
  readonly message: string;
  readonly rule: string;
}

function listSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") {
        continue;
      }
      files.push(...listSourceFiles(fullPath));
      continue;
    }

    if (!/\.(?:tsx?|mts)$/.test(entry.name)) {
      continue;
    }

    if (ALLOWED_PATH_SEGMENTS.some((segment) => fullPath.includes(segment))) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function lineNumberForIndex(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

export function checkAuthUserIdRbacBoundary(): AuthUserIdRbacViolation[] {
  const violations: AuthUserIdRbacViolation[] = [];

  for (const scanRoot of CONSUMER_SCAN_ROOTS) {
    for (const file of listSourceFiles(scanRoot)) {
      const source = readFileSync(file, "utf8");

      if (!PERMISSION_CALL_RE.test(source) && !AUTH_USER_ID_RE.test(source)) {
        continue;
      }

      for (const { rule, pattern, message } of FORBIDDEN_ACTOR_PATTERNS) {
        const match = pattern.exec(source);
        if (match) {
          violations.push({
            rule,
            file,
            line: lineNumberForIndex(source, match.index),
            message,
          });
        }
        pattern.lastIndex = 0;
      }
    }
  }

  return violations;
}

export function formatAuthUserIdRbacViolations(
  violations: readonly AuthUserIdRbacViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}:${v.line}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkAuthUserIdRbacBoundary();
  if (violations.length > 0) {
    console.error(formatAuthUserIdRbacViolations(violations));
    process.exit(1);
  }

  console.log("Auth user-id RBAC boundary gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }

  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-auth-user-id-rbac-boundary.mts")
    );
  } catch {
    return entry.endsWith("check-auth-user-id-rbac-boundary.mts");
  }
})();

if (isDirectRun) {
  main();
}
