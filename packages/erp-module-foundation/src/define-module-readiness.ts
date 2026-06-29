import type {
  ModuleReadinessDefinition,
  ModuleReadinessMatrix,
  ReadinessDimension,
  ReadinessLevel,
} from "./erp-module-foundation.types.js";
import {
  READINESS_DIMENSIONS,
  READINESS_LEVELS,
} from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
} from "./internal/validation.js";

export interface DefineModuleReadinessInput {
  readonly kvId: string;
  readonly matrix: ModuleReadinessMatrix;
  readonly module: string;
}

function assertReadinessLevel(value: ReadinessLevel, dimension: string): void {
  if (!READINESS_LEVELS.includes(value)) {
    throw new Error(`invalid readiness level for ${dimension}: "${value}"`);
  }
}

export function defineModuleReadiness(
  input: DefineModuleReadinessInput
): ModuleReadinessDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  for (const dimension of READINESS_DIMENSIONS) {
    const level = input.matrix[dimension];
    if (level === undefined) {
      throw new Error(
        `defineModuleReadiness: missing readiness dimension "${dimension}"`
      );
    }
    assertReadinessLevel(level, dimension);
  }

  return {
    module: input.module,
    kvId: input.kvId,
    matrix: input.matrix,
  } as const;
}

export function listRequiredReadinessDimensions(
  readiness: ModuleReadinessDefinition
): readonly ReadinessDimension[] {
  return READINESS_DIMENSIONS.filter(
    (dimension) => readiness.matrix[dimension] === "required"
  );
}
