import type {
  MetadataActionCategory,
  MetadataActionContract,
} from "../contracts/metadata-action.contract";

const GOVERNED_SENSITIVE_ACTION_CATEGORIES = [
  "destructive",
  "financial",
  "export",
  "ai",
  "approval",
] as const satisfies readonly MetadataActionCategory[];

const sensitiveActionCategories: readonly MetadataActionCategory[] =
  GOVERNED_SENSITIVE_ACTION_CATEGORIES;

export interface MetadataActionValidationResult {
  readonly errors: readonly string[];
  readonly valid: boolean;
}

export const isSensitiveMetadataAction = (
  category: MetadataActionCategory
): boolean => sensitiveActionCategories.includes(category);

export const validateMetadataAction = (
  action: MetadataActionContract
): MetadataActionValidationResult => {
  const errors: string[] = [];

  if (!action.permission.permissionKey) {
    errors.push(`Action "${action.id}" must include a permission key.`);
  }

  if (!(action.audit.action && action.audit.targetType)) {
    errors.push(`Action "${action.id}" must include audit action and target.`);
  }

  if (isSensitiveMetadataAction(action.category)) {
    const hasConfirmation = action.policy?.confirmationRequired === true;
    const hasPolicyKey = Boolean(action.policy?.policyKey);

    if (!(hasConfirmation || hasPolicyKey)) {
      errors.push(
        `Sensitive action "${action.id}" must include confirmation or policy metadata.`
      );
    }
  }

  return {
    errors,
    valid: errors.length === 0,
  };
};
