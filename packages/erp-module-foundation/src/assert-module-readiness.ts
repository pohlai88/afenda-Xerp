import { listRequiredReadinessDimensions } from "./define-module-readiness.js";
import type {
  ErpModuleFoundationBundle,
  ModuleReadinessAssertionResult,
} from "./erp-module-foundation.types.js";
import { ModuleReadinessAssertionError } from "./erp-module-foundation.types.js";
import { assertModuleKvParity } from "./internal/validation.js";

function collectParityFailures(bundle: ErpModuleFoundationBundle): string[] {
  const root = bundle.module.slug;
  const kvId = bundle.module.kvId;
  const failures: string[] = [];

  const artifacts: Array<{ module: string; kvId: string; name: string }> = [
    {
      module: bundle.knowledge.module,
      kvId: bundle.knowledge.kvId,
      name: "knowledge",
    },
    {
      module: bundle.permissionBinding.module,
      kvId: bundle.permissionBinding.kvId,
      name: "permissionBinding",
    },
    {
      module: bundle.auditMap.module,
      kvId: bundle.auditMap.kvId,
      name: "auditMap",
    },
    {
      module: bundle.metadataBinding.module,
      kvId: bundle.metadataBinding.kvId,
      name: "metadataBinding",
    },
    {
      module: bundle.readiness.module,
      kvId: bundle.readiness.kvId,
      name: "readiness",
    },
  ];

  for (const artifact of artifacts) {
    const failure = assertModuleKvParity(
      artifact.module,
      artifact.kvId,
      root,
      kvId,
      artifact.name
    );
    if (failure) {
      failures.push(failure);
    }
  }

  const slugArtifacts = [
    { module: bundle.eventCatalog.module, name: "eventCatalog" },
    { module: bundle.outboxContract.module, name: "outboxContract" },
  ];

  for (const artifact of slugArtifacts) {
    if (artifact.module !== root) {
      failures.push(
        `${artifact.name}: module "${artifact.module}" !== "${root}"`
      );
    }
  }

  return failures;
}

function collectKnowledgeFailures(bundle: ErpModuleFoundationBundle): string[] {
  const failures: string[] = [];
  for (const term of bundle.knowledge.terms) {
    if (term.status === "accepted" && !term.atomId) {
      failures.push(
        `knowledge term "${term.term}" is accepted but missing atomId`
      );
    }
    if (term.status === "wire_only" && !term.wireArtifact) {
      failures.push(
        `knowledge term "${term.term}" is wire_only but missing wireArtifact`
      );
    }
  }
  return failures;
}

function collectOutboxFailures(bundle: ErpModuleFoundationBundle): string[] {
  const failures: string[] = [];
  const catalogEvents = new Set(bundle.eventCatalog.events);

  for (const entry of bundle.outboxContract.entries) {
    if (!catalogEvents.has(entry.event)) {
      failures.push(`outbox event "${entry.event}" missing from event catalog`);
    }
  }

  return failures;
}

function collectMetadataFailures(bundle: ErpModuleFoundationBundle): string[] {
  const failures: string[] = [];
  const permissionKeys = new Set(bundle.permissionBinding.kernelPermissionKeys);

  for (const surface of bundle.metadataBinding.surfaces) {
    if (!permissionKeys.has(surface.permissionKey)) {
      failures.push(
        `metadata surface "${surface.surfaceId}" permission "${surface.permissionKey}" missing from permission binding`
      );
    }
    if (!surface.operatingContextRequired) {
      failures.push(
        `metadata surface "${surface.surfaceId}" must require operating context (PAS-001A)`
      );
    }
  }

  return failures;
}

function collectEvidenceFailures(bundle: ErpModuleFoundationBundle): string[] {
  const failures: string[] = [];
  const required = listRequiredReadinessDimensions(bundle.readiness);

  for (const dimension of required) {
    const evidence = bundle.evidence?.[dimension];
    if (!evidence || evidence.trim().length === 0) {
      failures.push(
        `readiness dimension "${dimension}" is required but evidence path is missing`
      );
    }
  }

  return failures;
}

function collectOwnershipFailures(bundle: ErpModuleFoundationBundle): string[] {
  const failures: string[] = [];
  const { module, ownership } = bundle;

  if (!module.wirePackage.startsWith(`${ownership.wireVocabulary}/`)) {
    failures.push(
      `ownership.wireVocabulary "${ownership.wireVocabulary}" does not prefix wirePackage "${module.wirePackage}"`
    );
  }

  if (ownership.runtimeBehavior !== module.ownerPackage) {
    failures.push(
      `ownership.runtimeBehavior "${ownership.runtimeBehavior}" !== module.ownerPackage "${module.ownerPackage}"`
    );
  }

  if (ownership.databaseSchema !== module.databaseOwner) {
    failures.push(
      `ownership.databaseSchema "${ownership.databaseSchema}" !== module.databaseOwner "${module.databaseOwner}"`
    );
  }

  if (ownership.permissionRegistry !== module.permissionOwner) {
    failures.push(
      `ownership.permissionRegistry "${ownership.permissionRegistry}" !== module.permissionOwner "${module.permissionOwner}"`
    );
  }

  return failures;
}

export function assertModuleReadiness(
  bundle: ErpModuleFoundationBundle
): ModuleReadinessAssertionResult {
  const failures = [
    ...collectParityFailures(bundle),
    ...collectOwnershipFailures(bundle),
    ...collectKnowledgeFailures(bundle),
    ...collectOutboxFailures(bundle),
    ...collectMetadataFailures(bundle),
    ...collectEvidenceFailures(bundle),
  ];

  if (failures.length > 0) {
    throw new ModuleReadinessAssertionError(failures);
  }

  return {
    ok: true,
    module: bundle.module.slug,
    kvId: bundle.module.kvId,
    checkedAt: new Date().toISOString(),
  } as const;
}

export function collectModuleReadinessFailures(
  bundle: ErpModuleFoundationBundle
): readonly string[] {
  return [
    ...collectParityFailures(bundle),
    ...collectOwnershipFailures(bundle),
    ...collectKnowledgeFailures(bundle),
    ...collectOutboxFailures(bundle),
    ...collectMetadataFailures(bundle),
    ...collectEvidenceFailures(bundle),
  ];
}
