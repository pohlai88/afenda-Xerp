import type { ApplicationShellOperatingContext } from "@afenda/appshell";
import {
  formatWorkspaceDisplayLabel,
  type OperatingContext,
} from "@afenda/kernel";

export function toApplicationShellOperatingContext(
  context: OperatingContext
): ApplicationShellOperatingContext {
  const organizationUnitLabel = context.organizationUnit?.displayName;

  return {
    tenantLabel: context.tenant.displayName,
    legalEntityLabel: context.legalEntity.displayName,
    workspaceLabel: formatWorkspaceDisplayLabel({
      legalEntityLabel: context.legalEntity.displayName,
      ...(organizationUnitLabel ? { organizationUnitLabel } : {}),
    }),
    ...(context.entityGroup?.displayName
      ? { entityGroupLabel: context.entityGroup.displayName }
      : {}),
    ...(organizationUnitLabel ? { organizationUnitLabel } : {}),
  };
}
