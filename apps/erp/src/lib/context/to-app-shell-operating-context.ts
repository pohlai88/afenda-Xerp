import type { AppShellOperatingContextWire } from "@afenda/shadcn-studio";

import type { PresentationShellOperatingContext } from "./to-presentation-shell-operating-context";

export function toAppShellOperatingContextWire(
  context: PresentationShellOperatingContext
): AppShellOperatingContextWire {
  return {
    tenantLabel: context.tenantLabel,
    legalEntityLabel: context.legalEntityLabel,
    workspaceLabel: context.workspaceLabel,
  };
}
