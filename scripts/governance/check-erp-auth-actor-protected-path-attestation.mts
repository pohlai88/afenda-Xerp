#!/usr/bin/env tsx
/**
 * PAS-001A R1b — auth actor protected-path consumer attestation gate (B110 skeleton).
 *
 * Verifies ERP protected spine modules on the ADR-0027 skeleton resolve actor identity
 * through governed @afenda/auth wire ingress.
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

const authActorWirePath = join(
  repoRoot,
  "packages/auth/src/auth.actor-wire.ts"
);

export interface AuthActorProtectedPathAttestationViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

const GOVERNED_ACTOR_RESOLVERS = [
  "resolveProtectedPathActorUserIdFromSession",
  "resolveWireActorUserIdFromAfendaAuthSession",
] as const;

const FORBIDDEN_ACTOR_INGRESS_PATTERNS = [
  /actorUserId:\s*identity\.userId/,
  /const\s+actorUserId\s*=\s*identity\.userId/,
] as const;

/** Skeleton-only protected paths (ADR-0027 minimal tree). */
const REQUIRED_PROTECTED_PATH_MARKERS: readonly {
  readonly file: string;
  readonly markers: readonly string[];
}[] = [
  {
    file: "app/(protected)/layout.tsx",
    markers: ["resolveProtectedPathActorUserIdFromSession"],
  },
  {
    file: "app/(protected)/metadata-workspace/page.tsx",
    markers: [
      "resolveMetadataActorUserIdFromAfendaAuthSession",
      "resolveProtectedPathActorUserIdFromSession",
      "resolveWireActorUserIdFromAfendaAuthSession",
    ],
  },
  {
    file: "lib/api/authorize-api-route.ts",
    markers: ["resolveWireActorUserIdFromAfendaAuthSession"],
  },
  {
    file: "lib/server-actions/resolve-action-operating-context.server.ts",
    markers: ["resolveWireActorUserIdFromAfendaAuthSession"],
  },
  {
    file: "lib/metadata/resolve-metadata-auth-actor.server.ts",
    markers: GOVERNED_ACTOR_RESOLVERS,
  },
];

function parseAuthActorBridgeWiring(
  source: string
): readonly { readonly id: string; readonly module: string; readonly delegate: string }[] {
  const match = source.match(
    /export const AUTH_ACTOR_BRIDGE_WIRING\s*=\s*(\[[\s\S]*?\])\s*as const;/
  );

  if (match === null) {
    return [];
  }

  const entries: {
    id: string;
    module: string;
    delegate: string;
  }[] = [];

  const entryPattern =
    /\{\s*id:\s*"([^"]+)"[\s\S]*?module:\s*"([^"]+)"[\s\S]*?delegate:\s*"([^"]+)"/g;

  for (const entry of match[1].matchAll(entryPattern)) {
    entries.push({
      id: entry[1],
      module: entry[2],
      delegate: entry[3],
    });
  }

  return entries;
}

function sourceIncludesAnyMarker(
  source: string,
  markers: readonly string[]
): boolean {
  return markers.some((marker) => source.includes(marker));
}

export function checkAuthActorProtectedPathAttestation(): AuthActorProtectedPathAttestationViolation[] {
  const violations: AuthActorProtectedPathAttestationViolation[] = [];

  if (!existsSync(authActorWirePath)) {
    violations.push({
      rule: "auth-wire-missing",
      file: authActorWirePath,
      message: "Missing @afenda/auth actor wire ingress (PAS-001 §4.1.11).",
    });
  } else {
    const authWireSource = readFileSync(authActorWirePath, "utf8");
    for (const fn of [
      "parseAuthActorIdentityFromAfendaAuthSession",
      "resolveWireActorUserIdFromAfendaAuthSession",
    ]) {
      if (!authWireSource.includes(fn)) {
        violations.push({
          rule: "auth-wire-marker-missing",
          file: authActorWirePath,
          message: `Missing governed auth actor export "${fn}".`,
        });
      }
    }
  }

  for (const requirement of REQUIRED_PROTECTED_PATH_MARKERS) {
    const absolutePath = join(erpSrcRoot, requirement.file);

    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "protected-path-missing",
        file: absolutePath,
        message: `Missing protected-path module: ${requirement.file}`,
      });
      continue;
    }

    const source = readFileSync(absolutePath, "utf8");

    if (!sourceIncludesAnyMarker(source, requirement.markers)) {
      violations.push({
        rule: "protected-path-marker-missing",
        file: absolutePath,
        message: `Protected path must use governed auth actor resolver (${requirement.markers.join(" | ")}).`,
      });
    }

    for (const pattern of FORBIDDEN_ACTOR_INGRESS_PATTERNS) {
      if (pattern.test(source)) {
        violations.push({
          rule: "forbidden-actor-ingress",
          file: absolutePath,
          message:
            "Forbidden raw identity.userId actor ingress — use resolveProtectedPathActorUserIdFromSession.",
        });
      }
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
  const authActorBridgeWiring = parseAuthActorBridgeWiring(registrySource);

  if (authActorBridgeWiring.length === 0) {
    violations.push({
      rule: "auth-actor-bridge-wiring-missing",
      file: registryPath,
      message:
        "AUTH_ACTOR_BRIDGE_WIRING must declare protected-path auth actor entries.",
    });
    return violations;
  }

  const seenIds = new Set<string>();

  for (const entry of authActorBridgeWiring) {
    if (seenIds.has(entry.id)) {
      violations.push({
        rule: "auth-actor-bridge-duplicate",
        file: registryPath,
        message: `Duplicate AUTH_ACTOR_BRIDGE_WIRING id: ${entry.id}`,
      });
    }
    seenIds.add(entry.id);

    const modulePath = join(erpSrcRoot, entry.module);

    if (!existsSync(modulePath)) {
      violations.push({
        rule: "auth-actor-bridge-module-missing",
        file: modulePath,
        message: `AUTH_ACTOR_BRIDGE_WIRING entry ${entry.id} missing module ${entry.module}`,
      });
      continue;
    }

    const moduleSource = readFileSync(modulePath, "utf8");
    if (!moduleSource.includes(entry.delegate)) {
      violations.push({
        rule: "auth-actor-bridge-delegate-missing",
        file: modulePath,
        message: `${entry.module} must reference ${entry.delegate} (${entry.id}).`,
      });
    }
  }

  const protectedSurfaceRegistryPath = join(
    erpSrcRoot,
    "lib/auth/auth-protected-surface.registry.ts"
  );

  if (!existsSync(protectedSurfaceRegistryPath)) {
    violations.push({
      rule: "auth-protected-surface-registry-missing",
      file: protectedSurfaceRegistryPath,
      message: "auth-protected-surface.registry.ts is required for R1b.",
    });
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
      entry.endsWith("check-erp-auth-actor-protected-path-attestation.mts")
    );
  } catch {
    return entry.endsWith("check-erp-auth-actor-protected-path-attestation.mts");
  }
})();

if (isDirectRun) {
  const violations = checkAuthActorProtectedPathAttestation();

  if (violations.length > 0) {
    for (const violation of violations) {
      process.stderr.write(
        `${violation.file} [${violation.rule}]: ${violation.message}\n`
      );
    }
    process.exit(1);
  }

  process.stdout.write(
    "ERP auth actor protected-path attestation gate passed (PAS-001A R1b / B110 skeleton).\n"
  );
}
