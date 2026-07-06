"use client";

import { SettingsSurface } from "@afenda/shadcn-studio-v2/clients";
import type { SystemAdminModuleSettingRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

export interface SystemAdminSettingsPanelProps {
  readonly modules: readonly SystemAdminModuleSettingRowDto[];
}

export function SystemAdminSettingsPanel({
  modules,
}: SystemAdminSettingsPanelProps) {
  return (
    <SettingsSurface
      description="Module domains registered in the governed permission catalog."
      sections={[
        {
          description: "Permission counts per module domain.",
          id: "module-catalog",
          items: modules.map((module) => ({
            control: (
              <span className="font-mono text-sm">
                {module.permissionCount}
              </span>
            ),
            description: module.domain,
            id: module.domain,
            label: module.label,
          })),
          title: "Module domains",
        },
      ]}
      state={modules.length === 0 ? "empty" : "ready"}
      stateMessages={{
        empty: {
          description:
            "No module domains are registered in the permission catalog yet.",
          title: "No module settings",
        },
      }}
      title="Configuration"
    />
  );
}
