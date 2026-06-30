import type { ErpShellOperatingContextWire } from "@afenda/shadcn-studio";

import type { PresentationShellOperatingContext } from "./to-presentation-shell-operating-context";

export function toErpShellOperatingContextWire(
  context: PresentationShellOperatingContext
): ErpShellOperatingContextWire {
  return {
    tenantLabel: context.tenantLabel,
    legalEntityLabel: context.legalEntityLabel,
    workspaceLabel: context.workspaceLabel,
  };
}
