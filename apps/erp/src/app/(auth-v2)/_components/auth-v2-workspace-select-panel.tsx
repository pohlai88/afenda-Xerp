import type { ApplicationShellContextSwitchTarget } from "@afenda/kernel";

import { AuthWorkspaceSelectPanel } from "@/lib/auth/auth-workspace-select-panel";

export function AuthV2WorkspaceSelectPanel({
  targets,
}: {
  readonly targets: readonly ApplicationShellContextSwitchTarget[];
}) {
  return (
    <AuthWorkspaceSelectPanel
      linkClassName="erp-auth-v2-form__link"
      targets={targets}
    />
  );
}
