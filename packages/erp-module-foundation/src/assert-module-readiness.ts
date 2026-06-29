import { collectModuleRuntimeCompletenessFailures } from "./assert-module-runtime-completeness.js";
import {
  collectEvidencePathFailures,
  collectModuleStatusRequirementFailures,
} from "./assert-module-status-requirements.js";
import { listRequiredReadinessDimensions } from "./define-module-readiness.js";
import type {
  AssertModuleReadinessOptions,
  ErpModuleFoundationBundle,
  ModuleReadinessAssertionResult,
  ReadinessDimension,
} from "./erp-module-foundation.types.js";
import { ModuleReadinessAssertionError } from "./erp-module-foundation.types.js";
import {
  errorFinding,
  findingToMessage,
  type ModuleReadinessFinding,
} from "./internal/findings.js";
import { assertModuleKvParity } from "./internal/validation.js";

function collectParityFindings(
  bundle: ErpModuleFoundationBundle
): ModuleReadinessFinding[] {
  const root = bundle.module.slug;
  const kvId = bundle.module.kvId;
  const findings: ModuleReadinessFinding[] = [];

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

  if (bundle.contextSpineConsumer) {
    artifacts.push({
      module: bundle.contextSpineConsumer.module,
      kvId: bundle.contextSpineConsumer.kvId,
      name: "contextSpineConsumer",
    });
  }

  if (bundle.databaseBoundary) {
    artifacts.push({
      module: bundle.databaseBoundary.module,
      kvId: bundle.databaseBoundary.kvId,
      name: "databaseBoundary",
    });
  }

  if (bundle.operationCatalog) {
    artifacts.push({
      module: bundle.operationCatalog.module,
      kvId: bundle.operationCatalog.kvId,
      name: "operationCatalog",
    });
  }

  for (const artifact of artifacts) {
    const failure = assertModuleKvParity(
      artifact.module,
      artifact.kvId,
      root,
      kvId,
      artifact.name
    );
    if (failure) {
      findings.push(errorFinding("authority", "MODULE_KV_PARITY", failure));
    }
  }

  const slugArtifacts = [
    { module: bundle.eventCatalog.module, name: "eventCatalog" },
    { module: bundle.outboxContract.module, name: "outboxContract" },
  ];

  for (const artifact of slugArtifacts) {
    if (artifact.module !== root) {
      findings.push(
        errorFinding(
          "authority",
          "MODULE_SLUG_PARITY",
          `${artifact.name}: module "${artifact.module}" !== "${root}"`
        )
      );
    }
  }

  return findings;
}

function collectRequiredArtifactFindings(
  bundle: ErpModuleFoundationBundle
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const required = listRequiredReadinessDimensions(bundle.readiness);

  if (required.includes("contextSpine") && !bundle.contextSpineConsumer) {
    findings.push(
      errorFinding(
        "contextSpine",
        "CONTEXT_SPINE_MISSING",
        'readiness dimension "contextSpine" is required but contextSpineConsumer is missing'
      )
    );
  }

  if (required.includes("database") && !bundle.databaseBoundary) {
    findings.push(
      errorFinding(
        "database",
        "DATABASE_BOUNDARY_MISSING",
        'readiness dimension "database" is required but databaseBoundary is missing'
      )
    );
  }

  if (required.includes("operations") && !bundle.operationCatalog) {
    findings.push(
      errorFinding(
        "operations",
        "OPERATION_CATALOG_MISSING",
        'readiness dimension "operations" is required but operationCatalog is missing'
      )
    );
  }

  if (
    required.includes("permissions") &&
    bundle.permissionBinding.permissionParity === "exact" &&
    !bundle.permissionBinding.registryPermissionKeys
  ) {
    findings.push(
      errorFinding(
        "permissions",
        "PERMISSION_PARITY_REGISTRY_KEYS",
        "permissionParity exact requires registryPermissionKeys when permissions readiness is required"
      )
    );
  }

  return findings;
}

function collectKnowledgeFindings(
  bundle: ErpModuleFoundationBundle
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  for (const term of bundle.knowledge.terms) {
    if (term.status === "accepted" && !term.atomId) {
      findings.push(
        errorFinding(
          "knowledge",
          "KNOWLEDGE_ACCEPTED_NO_ATOM",
          `knowledge term "${term.term}" is accepted but missing atomId`
        )
      );
    }
    if (term.status === "wire_only" && !term.wireArtifact) {
      findings.push(
        errorFinding(
          "knowledge",
          "KNOWLEDGE_WIRE_ONLY_NO_ARTIFACT",
          `knowledge term "${term.term}" is wire_only but missing wireArtifact`
        )
      );
    }
  }
  return findings;
}

function collectOutboxFindings(
  bundle: ErpModuleFoundationBundle
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const catalogEvents = new Set(bundle.eventCatalog.events);

  for (const entry of bundle.outboxContract.entries) {
    if (!catalogEvents.has(entry.event)) {
      findings.push(
        errorFinding(
          "outbox",
          "OUTBOX_EVENT_NOT_IN_CATALOG",
          `outbox event "${entry.event}" missing from event catalog`
        )
      );
    }
  }

  return findings;
}

function collectMetadataFindings(
  bundle: ErpModuleFoundationBundle
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const permissionKeys = new Set(bundle.permissionBinding.kernelPermissionKeys);

  for (const surface of bundle.metadataBinding.surfaces) {
    if (!permissionKeys.has(surface.permissionKey)) {
      findings.push(
        errorFinding(
          "metadata",
          "METADATA_PERMISSION_MISSING",
          `metadata surface "${surface.surfaceId}" permission "${surface.permissionKey}" missing from permission binding`
        )
      );
    }
    if (!surface.operatingContextRequired) {
      findings.push(
        errorFinding(
          "metadata",
          "METADATA_CONTEXT_REQUIRED",
          `metadata surface "${surface.surfaceId}" must require operating context (PAS-001A)`
        )
      );
    }
  }

  return findings;
}

function collectEvidenceFindings(
  bundle: ErpModuleFoundationBundle
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const required = listRequiredReadinessDimensions(bundle.readiness);

  for (const dimension of required) {
    const evidence = bundle.evidence?.[dimension];
    if (!evidence || evidence.trim().length === 0) {
      findings.push(
        errorFinding(
          dimension,
          "EVIDENCE_PATH_MISSING",
          `readiness dimension "${dimension}" is required but evidence path is missing`
        )
      );
    }
  }

  return findings;
}

function collectOwnershipFindings(
  bundle: ErpModuleFoundationBundle
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const { module, ownership } = bundle;

  if (!module.wirePackage.startsWith(`${ownership.wireVocabulary}/`)) {
    findings.push(
      errorFinding(
        "ownership",
        "OWNERSHIP_WIRE_VOCABULARY",
        `ownership.wireVocabulary "${ownership.wireVocabulary}" does not prefix wirePackage "${module.wirePackage}"`
      )
    );
  }

  if (ownership.runtimeBehavior !== module.ownerPackage) {
    findings.push(
      errorFinding(
        "ownership",
        "OWNERSHIP_RUNTIME_BEHAVIOR",
        `ownership.runtimeBehavior "${ownership.runtimeBehavior}" !== module.ownerPackage "${module.ownerPackage}"`
      )
    );
  }

  if (ownership.databaseSchema !== module.databaseOwner) {
    findings.push(
      errorFinding(
        "ownership",
        "OWNERSHIP_DATABASE_SCHEMA",
        `ownership.databaseSchema "${ownership.databaseSchema}" !== module.databaseOwner "${module.databaseOwner}"`
      )
    );
  }

  if (ownership.permissionRegistry !== module.permissionOwner) {
    findings.push(
      errorFinding(
        "ownership",
        "OWNERSHIP_PERMISSION_REGISTRY",
        `ownership.permissionRegistry "${ownership.permissionRegistry}" !== module.permissionOwner "${module.permissionOwner}"`
      )
    );
  }

  return findings;
}

function mapFailuresToFindings(
  failures: readonly string[],
  dimension: ReadinessDimension,
  code: string
): ModuleReadinessFinding[] {
  return failures.map((message) => errorFinding(dimension, code, message));
}

export function collectModuleReadinessFindings(
  bundle: ErpModuleFoundationBundle,
  options?: AssertModuleReadinessOptions
): readonly ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [
    ...collectParityFindings(bundle),
    ...collectOwnershipFindings(bundle),
    ...collectRequiredArtifactFindings(bundle),
    ...collectKnowledgeFindings(bundle),
    ...collectOutboxFindings(bundle),
    ...collectMetadataFindings(bundle),
    ...collectEvidenceFindings(bundle),
    ...mapFailuresToFindings(
      collectModuleStatusRequirementFailures(bundle),
      "registry",
      "STATUS_REQUIREMENT"
    ),
    ...mapFailuresToFindings(
      collectModuleRuntimeCompletenessFailures(bundle),
      "operations",
      "RUNTIME_COMPLETENESS"
    ),
  ];

  if (options?.validateEvidencePaths && options.evidencePathValidator) {
    findings.push(
      ...mapFailuresToFindings(
        collectEvidencePathFailures(bundle, options.evidencePathValidator),
        "gates",
        "EVIDENCE_PATH_INVALID"
      )
    );
  }

  return findings;
}

export function collectModuleReadinessFailures(
  bundle: ErpModuleFoundationBundle,
  options?: AssertModuleReadinessOptions
): readonly string[] {
  return findingToMessage(collectModuleReadinessFindings(bundle, options));
}

export function assertModuleReadiness(
  bundle: ErpModuleFoundationBundle,
  options?: AssertModuleReadinessOptions
): ModuleReadinessAssertionResult {
  const failures = collectModuleReadinessFailures(bundle, options);

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
