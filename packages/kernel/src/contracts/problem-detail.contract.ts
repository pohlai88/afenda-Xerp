/**
 * RFC 9457 problem detail wire shape — API-facing adapter vocabulary only.
 *
 * Separate from AppError. HTTP status mapping belongs to API governance, not kernel.
 */
export interface ProblemDetail {
  readonly detail?: string;
  readonly instance?: string;
  readonly title: string;
  readonly type: string;
}
