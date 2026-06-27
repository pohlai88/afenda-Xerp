export type ArchitectureExceptionStatus =
  | "active"
  | "completed"
  | "waived"
  | "rejected";

export interface ArchitectureException {
  readonly adr: string;
  readonly approvedBy: string;
  readonly evidence: readonly string[];
  readonly expiresAt: string;
  readonly id: string;
  readonly owner: string;
  readonly packageName: string;
  readonly reason: string;
  readonly resolution?: string;
  readonly status: ArchitectureExceptionStatus;
  readonly subject: string;
}

export interface ExceptionContract {
  readonly exceptions: readonly ArchitectureException[];
}
