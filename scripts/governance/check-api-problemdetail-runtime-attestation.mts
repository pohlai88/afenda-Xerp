#!/usr/bin/env tsx
/**
 * Enterprise Runtime criterion 2 — governed API errors use ProblemDetail-class envelopes.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpApiRoot = join(repoRoot, "apps/erp/src/server/api");

export interface ApiProblemDetailAttestationViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

const REQUIRED_RUNTIME_MARKERS: readonly {
  readonly file: string;
  readonly markers: readonly string[];
}[] = [
  {
    file: "runtime/create-api-handler.ts",
    markers: ["jsonErrorResponse", "assertApiRouteAuthPolicy"],
  },
  {
    file: "runtime/api-response.ts",
    markers: ["createErrorEnvelope", "getApiErrorDefinition"],
  },
  {
    file: "contracts/api-error.contract.ts",
    markers: ["projectProblemDetailClass", "API_ERROR_DEFINITIONS"],
  },
];

export function checkApiProblemDetailRuntimeAttestation(): ApiProblemDetailAttestationViolation[] {
  const violations: ApiProblemDetailAttestationViolation[] = [];

  for (const marker of REQUIRED_RUNTIME_MARKERS) {
    const absolutePath = join(erpApiRoot, marker.file);

    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "problemdetail-module-missing",
        file: absolutePath,
        message: `Required module missing: ${marker.file}`,
      });
      continue;
    }

    const source = readFileSync(absolutePath, "utf8");

    for (const required of marker.markers) {
      if (!source.includes(required)) {
        violations.push({
          rule: "problemdetail-marker-missing",
          file: absolutePath,
          message: `${marker.file} must reference ${required}.`,
        });
      }
    }
  }

  const handlerPath = join(erpApiRoot, "runtime/create-api-handler.ts");
  if (existsSync(handlerPath)) {
    const handlerSource = readFileSync(handlerPath, "utf8");
    if (!/jsonErrorResponse\s*\(/.test(handlerSource)) {
      violations.push({
        rule: "handler-error-envelope",
        file: handlerPath,
        message:
          "create-api-handler.ts must serialize governed errors via jsonErrorResponse.",
      });
    }

    if (/Response\.json\s*\(\s*\{[^}]*ok:\s*false/.test(handlerSource)) {
      violations.push({
        rule: "handler-inline-error-response",
        file: handlerPath,
        message:
          "create-api-handler.ts must not inline ad-hoc error Response.json bodies.",
      });
    }
  }

  return violations;
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  return entry.endsWith("check-api-problemdetail-runtime-attestation.mts");
})();

if (isDirectRun) {
  const violations = checkApiProblemDetailRuntimeAttestation();

  if (violations.length > 0) {
    for (const violation of violations) {
      process.stderr.write(
        `${violation.file} [${violation.rule}]: ${violation.message}\n`
      );
    }
    process.exit(1);
  }

  process.stdout.write(
    "API ProblemDetail runtime attestation gate passed (Enterprise Runtime criterion 2).\n"
  );
}
