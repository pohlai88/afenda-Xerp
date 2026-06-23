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
    ...(fields === undefined ? {} : { fields }),
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
    ...(cause === undefined ? {} : { cause }),
  }),
} as const;
