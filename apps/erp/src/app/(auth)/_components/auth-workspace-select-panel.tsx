import type { ApplicationShellContextSwitchTarget } from "@afenda/kernel";

import { AuthWorkspaceSelectPanel as AuthWorkspaceSelectPanelCore } from "@/lib/auth/auth-workspace-select-panel";

export function AuthWorkspaceSelectPanel({
  targets,
}: {
  readonly targets: readonly ApplicationShellContextSwitchTarget[];
}) {
  return (
    <AuthWorkspaceSelectPanelCore
      linkClassName="erp-auth-form__link"
      targets={targets}
    />
  );
}
