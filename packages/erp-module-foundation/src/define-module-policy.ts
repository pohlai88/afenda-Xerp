import type {
  ModulePolicyDefinition,
  ModulePolicyRule,
} from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertNonEmptyString,
  assertPermissionKeyFormat,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModulePolicyInput {
  readonly approveRules?: readonly ModulePolicyRule[];
  readonly blockedOperations?: readonly string[];
  readonly createRules: readonly ModulePolicyRule[];
  readonly kvId: string;
  readonly module: string;
  readonly postRules?: readonly ModulePolicyRule[];
}

export function defineModulePolicy(
  input: DefineModulePolicyInput
): ModulePolicyDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  if (input.createRules.length === 0) {
    throw new Error("defineModulePolicy: createRules must not be empty");
  }

  const validateRules = (rules: readonly ModulePolicyRule[], kind: string) => {
    for (const rule of rules) {
      assertNonEmptyString(rule.action, `${kind}.action`);
      assertPermissionKeyFormat(rule.permissionKey);
      if (!rule.action.startsWith(`${input.module}.`)) {
        throw new Error(
          `${kind} action must be prefixed with "${input.module}." — got "${rule.action}"`
        );
      }
    }
  };

  validateRules(input.createRules, "createRules");
  const approveRules = input.approveRules ?? [];
  const postRules = input.postRules ?? [];
  validateRules(approveRules, "approveRules");
  validateRules(postRules, "postRules");

  const blockedOperations = input.blockedOperations ?? [];
  assertUniqueStrings(blockedOperations, "blockedOperation");

  return {
    module: input.module,
    kvId: input.kvId,
    createRules: input.createRules,
    approveRules,
    postRules,
    blockedOperations,
  } as const;
}
