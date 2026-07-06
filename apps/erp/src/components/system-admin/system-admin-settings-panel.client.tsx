"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@afenda/shadcn-studio-v2/clients";
import type { SystemAdminModuleSettingRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

export interface SystemAdminSettingsPanelProps {
  readonly modules: readonly SystemAdminModuleSettingRowDto[];
}

export function SystemAdminSettingsPanel({
  modules,
}: SystemAdminSettingsPanelProps) {
  if (modules.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No module domains are registered in the permission catalog yet.
      </p>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Module</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Permissions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map((module) => (
            <TableRow key={module.domain}>
              <TableCell className="font-medium">{module.label}</TableCell>
              <TableCell className="font-mono text-xs">{module.domain}</TableCell>
              <TableCell>{module.permissionCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
