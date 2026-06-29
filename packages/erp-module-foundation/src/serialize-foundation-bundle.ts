import { collectModuleReadinessFailures } from "./assert-module-readiness.js";
import type {
  AssertModuleReadinessOptions,
  ErpModuleFoundationBundle,
} from "./erp-module-foundation.types.js";
import { ModuleReadinessAssertionError } from "./erp-module-foundation.types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`ErpModuleFoundationBundle: ${label} must be an object`);
  }
  return value;
}

function assertString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `ErpModuleFoundationBundle: ${label} must be a non-empty string`
    );
  }
  return value;
}

function assertStringArray(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value)) {
    throw new Error(`ErpModuleFoundationBundle: ${label} must be an array`);
  }
  for (const item of value) {
    if (typeof item !== "string") {
      throw new Error(
        `ErpModuleFoundationBundle: ${label} must contain only strings`
      );
    }
  }
  return value;
}

function isErpModuleFoundationBundle(
  value: unknown
): value is ErpModuleFoundationBundle {
  if (!isRecord(value)) {
    return false;
  }

  const requiredKeys = [
    "module",
    "ownership",
    "knowledge",
    "permissionBinding",
    "auditMap",
    "eventCatalog",
    "outboxContract",
    "metadataBinding",
    "readiness",
  ] as const;

  for (const key of requiredKeys) {
    if (!(key in value)) {
      return false;
    }
    if (!isRecord(value[key])) {
      return false;
    }
  }

  try {
    const module = assertRecord(value["module"], "module");
    assertString(module["slug"], "module.slug");
    assertString(module["kvId"], "module.kvId");

    const permissionBinding = assertRecord(
      value["permissionBinding"],
      "permissionBinding"
    );
    assertString(permissionBinding["module"], "permissionBinding.module");
    assertStringArray(
      permissionBinding["kernelPermissionKeys"],
      "permissionBinding.kernelPermissionKeys"
    );

    const auditMap = assertRecord(value["auditMap"], "auditMap");
    assertString(auditMap["module"], "auditMap.module");
    assertStringArray(auditMap["actions"], "auditMap.actions");

    const eventCatalog = assertRecord(value["eventCatalog"], "eventCatalog");
    assertString(eventCatalog["module"], "eventCatalog.module");
    assertStringArray(eventCatalog["events"], "eventCatalog.events");

    const outboxContract = assertRecord(
      value["outboxContract"],
      "outboxContract"
    );
    assertString(outboxContract["module"], "outboxContract.module");
    if (!Array.isArray(outboxContract["entries"])) {
      return false;
    }

    const metadataBinding = assertRecord(
      value["metadataBinding"],
      "metadataBinding"
    );
    assertString(metadataBinding["module"], "metadataBinding.module");
    if (!Array.isArray(metadataBinding["surfaces"])) {
      return false;
    }

    const readiness = assertRecord(value["readiness"], "readiness");
    assertString(readiness["module"], "readiness.module");
    if (!isRecord(readiness["matrix"])) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function parseErpModuleFoundationBundleFromUnknown(
  value: unknown
): ErpModuleFoundationBundle {
  if (!isErpModuleFoundationBundle(value)) {
    throw new Error("ErpModuleFoundationBundle: invalid bundle shape");
  }
  return value;
}

export function serializeErpModuleFoundationBundle(
  bundle: ErpModuleFoundationBundle
): string {
  return JSON.stringify(bundle);
}

export function parseErpModuleFoundationBundle(
  json: string
): ErpModuleFoundationBundle {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json) as unknown;
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`ErpModuleFoundationBundle: invalid JSON — ${message}`);
  }
  return parseErpModuleFoundationBundleFromUnknown(parsed);
}

export function parseAndValidateErpModuleFoundationBundle(
  json: string,
  options?: AssertModuleReadinessOptions
): ErpModuleFoundationBundle {
  const bundle = parseErpModuleFoundationBundle(json);
  const failures = collectModuleReadinessFailures(bundle, options);
  if (failures.length > 0) {
    throw new ModuleReadinessAssertionError(failures);
  }
  return bundle;
}
