import type {
  AuditNamespaceMode,
  ModuleAuditMapDefinition,
} from "./erp-module-foundation.types.js";
import { AUDIT_NAMESPACE_MODES } from "./erp-module-foundation.types.js";
import {
  assertAuditActionNamespace,
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModuleAuditMapInput {
  readonly actions: readonly string[];
  readonly auditNamespaceMode?: AuditNamespaceMode;
  readonly kvId: string;
  readonly module: string;
}

function assertAuditNamespaceMode(value: AuditNamespaceMode): void {
  if (!AUDIT_NAMESPACE_MODES.includes(value)) {
    throw new Error(`invalid auditNamespaceMode: "${value}"`);
  }
}

export function defineModuleAuditMap(
  input: DefineModuleAuditMapInput
): ModuleAuditMapDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  const auditNamespaceMode = input.auditNamespaceMode ?? "module_prefixed";
  assertAuditNamespaceMode(auditNamespaceMode);

  if (input.actions.length === 0) {
    throw new Error("defineModuleAuditMap: actions must not be empty");
  }

  assertUniqueStrings(input.actions, "audit action");

  for (const action of input.actions) {
    assertAuditActionNamespace({
      action,
      module: input.module,
      auditNamespaceMode,
    });
  }

  return {
    module: input.module,
    kvId: input.kvId,
    actions: input.actions,
    auditNamespaceMode,
  } as const;
}
