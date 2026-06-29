import type {
  ErpModuleFoundationBundle,
  ErpRuntimeModuleStatus,
} from "../erp-module-foundation.types.js";

const RUNTIME_AUTHORIZED_STATUSES: readonly ErpRuntimeModuleStatus[] = [
  "runtime_authorized",
  "runtime_verified",
];

const FOUNDATION_VERIFIED_STATUSES: readonly ErpRuntimeModuleStatus[] = [
  "foundation_verified",
  ...RUNTIME_AUTHORIZED_STATUSES,
];

function includesStatus(
  status: ErpRuntimeModuleStatus,
  allowed: readonly ErpRuntimeModuleStatus[]
): boolean {
  return allowed.includes(status);
}

function collectFoundationAuthorizedFailures(
  bundle: ErpModuleFoundationBundle
): readonly string[] {
  const failures: string[] = [];

  if (!bundle.ownership) {
    failures.push("foundation_authorized requires ownership artifact");
  }
  if (!bundle.knowledge) {
    failures.push("foundation_authorized requires knowledge artifact");
  }
  if (!bundle.readiness) {
    failures.push("foundation_authorized requires readiness artifact");
  }

  return failures;
}

function collectFoundationVerifiedFailures(
  bundle: ErpModuleFoundationBundle,
  status: ErpRuntimeModuleStatus
): readonly string[] {
  const failures: string[] = [];

  if (!bundle.contextSpineConsumer) {
    failures.push(
      `${status} requires contextSpineConsumer artifact (PAS-001A)`
    );
  }

  if (bundle.permissionBinding.permissionParity === "deferred") {
    failures.push(
      `${status} requires permissionParity subset_allowed or exact — got deferred`
    );
  }

  return failures;
}

function collectRuntimeAuthorizedFailures(
  bundle: ErpModuleFoundationBundle,
  status: ErpRuntimeModuleStatus
): readonly string[] {
  const failures: string[] = [];

  if (!bundle.databaseBoundary) {
    failures.push(`${status} requires databaseBoundary artifact`);
  }
  if (!bundle.operationCatalog) {
    failures.push(`${status} requires operationCatalog artifact`);
  }
  if (bundle.permissionBinding.permissionParity !== "exact") {
    failures.push(`${status} requires permissionParity exact`);
  }
  if (!bundle.permissionBinding.registryPermissionKeys) {
    failures.push(
      `${status} requires registryPermissionKeys when permissionParity is exact`
    );
  }

  return failures;
}

function collectRuntimeVerifiedFailures(
  bundle: ErpModuleFoundationBundle
): readonly string[] {
  const failures: string[] = [];

  if (!bundle.runtimeContract) {
    failures.push("runtime_verified requires runtimeContract artifact");
  }
  if (!bundle.policy) {
    failures.push("runtime_verified requires policy artifact");
  }

  return failures;
}

export function collectAllStatusRequirementFailures(
  bundle: ErpModuleFoundationBundle
): readonly string[] {
  const status = bundle.module.runtimeStatus;

  if (
    status === "blocked" ||
    status === "deprecated" ||
    status === "wire_only"
  ) {
    return [];
  }

  const failures: string[] = [];

  if (
    status === "foundation_authorized" ||
    includesStatus(status, FOUNDATION_VERIFIED_STATUSES)
  ) {
    failures.push(...collectFoundationAuthorizedFailures(bundle));
  }

  if (includesStatus(status, FOUNDATION_VERIFIED_STATUSES)) {
    failures.push(...collectFoundationVerifiedFailures(bundle, status));
  }

  if (includesStatus(status, RUNTIME_AUTHORIZED_STATUSES)) {
    failures.push(...collectRuntimeAuthorizedFailures(bundle, status));
  }

  if (status === "runtime_verified") {
    failures.push(...collectRuntimeVerifiedFailures(bundle));
  }

  return failures;
}
