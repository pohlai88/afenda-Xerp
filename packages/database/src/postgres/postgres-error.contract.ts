/** PostgreSQL `unique_violation` SQLSTATE. */
export const POSTGRES_UNIQUE_VIOLATION_CODE = "23505";

interface PostgresErrorShape {
  readonly cause?: unknown;
  readonly code?: string;
  readonly constraint?: string;
}

function readPostgresErrorShape(error: unknown): PostgresErrorShape | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  return error as PostgresErrorShape;
}

export function resolvePostgresErrorCause(error: unknown): unknown {
  const shape = readPostgresErrorShape(error);

  if (shape?.cause !== undefined && shape.cause !== error) {
    return resolvePostgresErrorCause(shape.cause);
  }

  return error;
}

export function readPostgresErrorCode(error: unknown): string | null {
  const resolved = resolvePostgresErrorCause(error);
  const shape = readPostgresErrorShape(resolved);

  return typeof shape?.code === "string" ? shape.code : null;
}

export function readPostgresConstraintName(error: unknown): string | null {
  const resolved = resolvePostgresErrorCause(error);
  const shape = readPostgresErrorShape(resolved);

  return typeof shape?.constraint === "string" ? shape.constraint : null;
}

export function isPostgresUniqueViolation(error: unknown): boolean {
  return readPostgresErrorCode(error) === POSTGRES_UNIQUE_VIOLATION_CODE;
}

export function isPostgresUniqueViolationForConstraint(
  error: unknown,
  constraintName: string
): boolean {
  return (
    isPostgresUniqueViolation(error) &&
    readPostgresConstraintName(error) === constraintName
  );
}

/**
 * Maps a Postgres unique violation to a domain error when the constraint matches.
 * Re-throws the original error when no handler applies.
 */
export function rethrowPostgresUniqueViolation(
  error: unknown,
  handlers: Readonly<Record<string, () => Error>>
): never {
  if (!isPostgresUniqueViolation(error)) {
    throw error;
  }

  const constraintName = readPostgresConstraintName(error);

  if (constraintName !== null) {
    const createDomainError = handlers[constraintName];

    if (createDomainError !== undefined) {
      throw createDomainError();
    }
  }

  throw error;
}
