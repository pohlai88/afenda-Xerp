export interface SystemAdminAuditTableRow {
  readonly action: string;
  readonly correlationId: string;
  readonly createdAt: string;
  readonly id: string;
  readonly result: string;
  readonly target: string;
}
