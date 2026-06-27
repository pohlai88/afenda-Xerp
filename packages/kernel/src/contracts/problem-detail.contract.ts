/**
 * RFC 9457 problem detail wire shape — API-facing adapter vocabulary only.
 *
 * Separate from AppError. HTTP status mapping belongs to API governance, not kernel.
 * Kernel defines the shape; the API layer decides when and how it is returned.
 */
export interface ProblemDetail {
  readonly detail?: string;
  readonly instance?: string;
  readonly status?: number;
  readonly title: string;
  readonly type: string;
}
