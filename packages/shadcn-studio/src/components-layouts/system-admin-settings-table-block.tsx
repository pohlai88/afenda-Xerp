export interface SystemAdminModuleSettingBlockRow {
  readonly domain: string;
  readonly label: string;
  readonly permissionCount: number;
}

export interface SystemAdminSettingsTableBlockProps {
  readonly modules: readonly SystemAdminModuleSettingBlockRow[];
}

export function SystemAdminSettingsTableBlock({
  modules,
}: SystemAdminSettingsTableBlockProps) {
  if (modules.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No module domains are registered in the permission catalog yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Module</th>
            <th className="px-4 py-3 font-medium">Domain</th>
            <th className="px-4 py-3 font-medium">Permissions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr className="border-b last:border-b-0" key={module.domain}>
              <td className="px-4 py-3 font-medium">{module.label}</td>
              <td className="px-4 py-3 font-mono text-xs">{module.domain}</td>
              <td className="px-4 py-3">{module.permissionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
