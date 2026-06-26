export const BETTER_AUTH_SECRET_ENV = "BETTER_AUTH_SECRET";
export const BETTER_AUTH_URL_ENV = "BETTER_AUTH_URL";

export class UnauthenticatedError extends Error {
  constructor(message = "Authentication is required.") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

export function isUnauthenticatedError(
  error: unknown
): error is UnauthenticatedError {
  return error instanceof UnauthenticatedError;
}

export class MissingBetterAuthSecretError extends Error {
  constructor() {
    super(
      `${BETTER_AUTH_SECRET_ENV} is required (min 32 chars). Generate with: openssl rand -base64 32`
    );
    this.name = "MissingBetterAuthSecretError";
  }
}

export class MissingBetterAuthUrlError extends Error {
  constructor() {
    super(
      `${BETTER_AUTH_URL_ENV} is required (e.g. http://localhost:3000 for local ERP).`
    );
    this.name = "MissingBetterAuthUrlError";
  }
}

export class UnlinkedPlatformUserError extends Error {
  constructor(
    message = "Authenticated identity is not linked to a platform user."
  ) {
    super(message);
    this.name = "UnlinkedPlatformUserError";
  }
}

export function isUnlinkedPlatformUserError(
  error: unknown
): error is UnlinkedPlatformUserError {
  return error instanceof UnlinkedPlatformUserError;
}
