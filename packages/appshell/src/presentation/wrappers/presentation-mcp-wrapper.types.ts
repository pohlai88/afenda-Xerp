/**
 * PAS-005A B42i — presentation MCP wrapper vocabulary.
 * Serializable strangler map: public export → bridge twin → wrapper status.
 */

export type PresentationMcpWrapperStatus =
  | "delegating"
  | "governed-compose"
  | "afenda-only";

export interface PresentationMcpWrapperEntry {
  readonly bridgeExportName?: string;
  readonly mcpBlockId?: string;
  readonly publicExportName: string;
  readonly status: PresentationMcpWrapperStatus;
  readonly wrapperPath: string;
}

export interface PresentationMcpWrapperRegistrySummary {
  readonly afendaOnlyCount: number;
  readonly delegatingCount: number;
  readonly entryCount: number;
  readonly governedComposeCount: number;
}
