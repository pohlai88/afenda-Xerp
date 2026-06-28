/**
 * Canonical application error vocabulary for platform services and app boundaries.
 *
 * Callers switch on `code` — never compare ad-hoc strings or inspect Error subclasses.
 */

export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

/** Canonical AppErrorCode list — keep in sync with the union for cross-package parity tests. */
export const APP_ERROR_CODES = [
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "INTERNAL_ERROR",
] as const satisfies readonly AppErrorCode[];

export type ValidationFieldError = {
  readonly path: string;
  readonly message: string;
};

export type AppError =
  | {
      readonly code: "VALIDATION_ERROR";
      readonly userMessage: string;
      readonly fields?: readonly ValidationFieldError[];
    }
  | { readonly code: "UNAUTHORIZED"; readonly userMessage: string }
  | { readonly code: "FORBIDDEN"; readonly userMessage: string }
  | {
      readonly code: "NOT_FOUND";
      readonly userMessage: string;
      readonly resource?: string;
    }
  | {
      readonly code: "CONFLICT";
      readonly userMessage: string;
      readonly conflictOn?: string;
    }
  | {
      readonly code: "INTERNAL_ERROR";
      readonly userMessage: string;
      readonly cause?: unknown;
    };

export const AppErrors = {
  validation: (fields?: readonly ValidationFieldError[]): AppError => ({
    code: "VALIDATION_ERROR",
    userMessage: "Please check the highlighted fields.",
    ...(fields !== undefined && { fields }),
  }),

  unauthorized: (userMessage = "Sign in to continue."): AppError => ({
    code: "UNAUTHORIZED",
    userMessage,
  }),

  forbidden: (
    userMessage = "You do not have permission to perform this action."
  ): AppError => ({
    code: "FORBIDDEN",
    userMessage,
  }),

  notFound: (resource: string): AppError => ({
    code: "NOT_FOUND",
    userMessage: `${resource} not found.`,
    resource,
  }),

  conflict: (conflictOn: string): AppError => ({
    code: "CONFLICT",
    userMessage: "This record conflicts with an existing value.",
    conflictOn,
  }),

  internal: (cause?: unknown): AppError => ({
    code: "INTERNAL_ERROR",
    userMessage: "Something went wrong. Please try again.",
    ...(cause !== undefined && { cause }),
  }),
} as const;

/** JSON-safe AppError — omits non-serializable `cause` on INTERNAL_ERROR. */
export type AppErrorWire =
  | {
      readonly code: "VALIDATION_ERROR";
      readonly userMessage: string;
      readonly fields?: readonly ValidationFieldError[];
    }
  | { readonly code: "UNAUTHORIZED"; readonly userMessage: string }
  | { readonly code: "FORBIDDEN"; readonly userMessage: string }
  | {
      readonly code: "NOT_FOUND";
      readonly userMessage: string;
      readonly resource?: string;
    }
  | {
      readonly code: "CONFLICT";
      readonly userMessage: string;
      readonly conflictOn?: string;
    }
  | {
      readonly code: "INTERNAL_ERROR";
      readonly userMessage: string;
    };

/** Strip server-side diagnostic fields for wire egress. */
export function toAppErrorWire(error: AppError): AppErrorWire {
  switch (error.code) {
    case "VALIDATION_ERROR":
      return {
        code: error.code,
        userMessage: error.userMessage,
        ...(error.fields !== undefined && { fields: error.fields }),
      };
    case "UNAUTHORIZED":
    case "FORBIDDEN":
      return { code: error.code, userMessage: error.userMessage };
    case "NOT_FOUND":
      return {
        code: error.code,
        userMessage: error.userMessage,
        ...(error.resource !== undefined && { resource: error.resource }),
      };
    case "CONFLICT":
      return {
        code: error.code,
        userMessage: error.userMessage,
        ...(error.conflictOn !== undefined && { conflictOn: error.conflictOn }),
      };
    case "INTERNAL_ERROR":
      return { code: error.code, userMessage: error.userMessage };
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
}
