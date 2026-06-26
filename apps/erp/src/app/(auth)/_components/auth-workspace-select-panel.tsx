import type { ApplicationShellContextSwitchTarget } from "@afenda/kernel";

import { AuthWorkspaceSelectPanel } from "@/lib/auth/auth-workspace-select-panel";

export function AuthWorkspaceSelectPanelLegacy({
  targets,
}: {
  readonly targets: readonly ApplicationShellContextSwitchTarget[];
}) {
  return (
    <AuthWorkspaceSelectPanel
      linkClassName="erp-auth-form__link"
      targets={targets}
    />
  );
}
