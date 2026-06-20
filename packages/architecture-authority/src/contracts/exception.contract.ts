export interface ArchitectureException {
  readonly adr: string;
  readonly approvedBy: string;
  readonly expiresAt: string;
  readonly packageName: string;
  readonly reason: string;
  readonly subject: string;
}

export interface ExceptionContract {
  readonly exceptions: readonly ArchitectureException[];
}
