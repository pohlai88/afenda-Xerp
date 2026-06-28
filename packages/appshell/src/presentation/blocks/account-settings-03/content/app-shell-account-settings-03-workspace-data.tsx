"use client";

import {
  Button,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { DownloadIcon } from "lucide-react";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings03ExportRow {
  readonly dateLabel: string;
  readonly id: string;
  readonly progress?: number;
  readonly status: "completed" | "processing";
  readonly typeLabel: string;
}

export interface AppShellAccountSettings03WorkspaceDataProps {
  readonly exports: readonly AppShellAccountSettings03ExportRow[];
  readonly onDownload?: (exportId: string) => void;
  readonly onExport?: () => void;
  readonly pending?: boolean;
}

export function AppShellAccountSettings03WorkspaceData({
  exports: exportRows,
  onDownload,
  onExport,
  pending = false,
}: AppShellAccountSettings03WorkspaceDataProps) {
  const sectionId = useId();

  return (
    <AppShellAccountSettingsPanelSection
      description="Export workspace data and download previous exports."
      title="Workspace data"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-03__data-toolbar">
        <Button
          aria-busy={pending}
          disabled={pending || !onExport}
          emphasis="solid"
          intent="primary"
          onClick={onExport}
          presentation="default"
          size="md"
          type="button"
        >
          Export workspace data
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {exportRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.typeLabel}</TableCell>
              <TableCell>{row.dateLabel}</TableCell>
              <TableCell>
                {row.status === "processing" && row.progress !== undefined ? (
                  <Progress value={row.progress} />
                ) : (
                  row.status
                )}
              </TableCell>
              <TableCell>
                {row.status === "completed" && onDownload ? (
                  <Button
                    aria-label={`Download ${row.typeLabel}`}
                    disabled={pending}
                    emphasis="ghost"
                    intent="secondary"
                    onClick={() => onDownload(row.id)}
                    presentation="icon"
                    size="sm"
                    type="button"
                  >
                    <DownloadIcon aria-hidden />
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings03WorkspaceDataGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Button"
  | "Progress"
  | "Table"
  | "TableBody"
  | "TableCell"
  | "TableHead"
  | "TableHeader"
  | "TableRow"
>;
