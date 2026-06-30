#!/usr/bin/env tsx
/**
 * PAS-001A R2 — service / delegated_application S2S attestation gate.
 *
 * Verifies internal API protected paths parse service actor identity through
 * kernel AuthActorIdentity ingress (E12 · B113 vocabulary).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpSrcRoot = join(repoRoot, "apps/erp/src");
const registryPath = join(
  erpSrcRoot,
  "lib/context/context-integration-registry.ts"
);

export interface ServiceActorS2sAttestationViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

const GOVERNED_SERVICE_RESOLVERS = [
  "parseServiceActorIdentityFromRequestHeaders",
  "resolveApiRouteAuthActor",
] as const;

const REQUIRED_S2S_MARKERS: readonly {
  readonly file: string;
  readonly markers: readonly string[];
}[] = [
  {
    file: "lib/auth/resolve-service-actor.server.ts",
    markers: [
      "parseAuthActorIdentity",
      "parseServiceActorIdentityFromRequestHeaders",
      "verifyServiceActorS2sBearerToken",
    ],
  },
  {
    file: "lib/auth/resolve-api-route-auth-actor.server.ts",
    markers: [
      "parseServiceActorIdentityFromRequestHeaders",
      "resolveApiRouteAuthActor",
    ],
  },
  {
    file: "lib/auth/verify-service-actor-s2s-token.server.ts",
    markers: ["verifyServiceActorS2sBearerToken", "timingSafeEqual"],
  },
  {
    file: "lib/api/resolve-api-route-operating-context.ts",
    markers: [
      "resolveApiRouteAuthActor",
      "resolveApiRouteOperatingContext",
      "resolveOperatingContextOrchestrator",
    ],
  },
];

function parseServiceActorBridgeWiring(source: string): readonly {
  readonly id: string;
  readonly module: string;
  readonly delegate: string;
}[] {
  const match = source.match(
    /export const SERVICE_ACTOR_BRIDGE_WIRING\s*=\s*(\[[\s\S]*?\])\s*as const;/
  );

  if (match === null) {
    return [];
  }

  const entries: { id: string; module: string; delegate: string }[] = [];
  const entryPattern =
    /id:\s*"([^"]+)"[\s\S]*?module:\s*"([^"]+)"[\s\S]*?delegate:\s*"([^"]+)"/g;

  for (const entryMatch of match[1].matchAll(entryPattern)) {
    const id = entryMatch[1];
    const module = entryMatch[2];
    const delegate = entryMatch[3];
    if (id && module && delegate) {
      entries.push({ id, module, delegate });
    }
  }

  return entries;
}

export function checkServiceActorS2sAttestation(): ServiceActorS2sAttestationViolation[] {
  const violations: ServiceActorS2sAttestationViolation[] = [];

  const serviceActorWirePath = join(
    repoRoot,
    "packages/kernel/src/identity/wire/auth-actor-identity.contract.ts"
  );

  if (!existsSync(serviceActorWirePath)) {
    violations.push({
      rule: "kernel-auth-actor-wire-missing",
      file: serviceActorWirePath,
      message:
        "AuthActorIdentity wire contract is required for S2S attestation.",
    });
  }

  for (const marker of REQUIRED_S2S_MARKERS) {
    const absolutePath = join(erpSrcRoot, marker.file);

    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "s2s-module-missing",
        file: absolutePath,
        message: `Required S2S module missing: ${marker.file}`,
      });
      continue;
    }

    const source = readFileSync(absolutePath, "utf8");

    for (const required of marker.markers) {
      if (!source.includes(required)) {
        violations.push({
          rule: "s2s-marker-missing",
          file: absolutePath,
          message: `${marker.file} must reference ${required}.`,
        });
      }
    }
  }

  const handlerPath = join(
    erpSrcRoot,
    "server/api/runtime/create-api-handler.ts"
  );
  if (existsSync(handlerPath)) {
    const handlerSource = readFileSync(handlerPath, "utf8");
    if (!handlerSource.includes("assertApiRouteAuthPolicy")) {
      violations.push({
        rule: "handler-auth-policy-enforcement",
        file: handlerPath,
        message:
          "create-api-handler.ts must enforce assertApiRouteAuthPolicy (ADR-0035).",
      });
    }
  }

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "context-integration-registry.ts is required.",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  const serviceActorBridgeWiring =
    parseServiceActorBridgeWiring(registrySource);

  if (serviceActorBridgeWiring.length === 0) {
    violations.push({
      rule: "service-actor-bridge-wiring-missing",
      file: registryPath,
      message:
        "SERVICE_ACTOR_BRIDGE_WIRING must declare S2S service actor entries.",
    });
    return violations;
  }

  const seenIds = new Set<string>();

  for (const entry of serviceActorBridgeWiring) {
    if (seenIds.has(entry.id)) {
      violations.push({
        rule: "service-actor-bridge-duplicate",
        file: registryPath,
        message: `Duplicate SERVICE_ACTOR_BRIDGE_WIRING id: ${entry.id}`,
      });
    }
    seenIds.add(entry.id);

    const modulePath = join(erpSrcRoot, entry.module);

    if (!existsSync(modulePath)) {
      violations.push({
        rule: "service-actor-bridge-module-missing",
        file: modulePath,
        message: `SERVICE_ACTOR_BRIDGE_WIRING entry ${entry.id} missing module ${entry.module}`,
      });
      continue;
    }

    const moduleSource = readFileSync(modulePath, "utf8");
    if (!moduleSource.includes(entry.delegate)) {
      violations.push({
        rule: "service-actor-bridge-delegate-missing",
        file: modulePath,
        message: `${entry.module} must reference ${entry.delegate} (${entry.id}).`,
      });
    }

    if (
      !GOVERNED_SERVICE_RESOLVERS.some((resolver) =>
        moduleSource.includes(resolver)
      )
    ) {
      violations.push({
        rule: "service-actor-governed-resolver-missing",
        file: modulePath,
        message: `${entry.module} must use a governed service actor resolver.`,
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
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-erp-service-actor-s2s-attestation.mts")
    );
  } catch {
    return entry.endsWith("check-erp-service-actor-s2s-attestation.mts");
  }
})();

if (isDirectRun) {
  const violations = checkServiceActorS2sAttestation();

  if (violations.length > 0) {
    for (const violation of violations) {
      process.stderr.write(
        `${violation.file} [${violation.rule}]: ${violation.message}\n`
      );
    }
    process.exit(1);
  }

  process.stdout.write(
    "ERP service actor S2S attestation gate passed (PAS-001A R2 · E12).\n"
  );
}
