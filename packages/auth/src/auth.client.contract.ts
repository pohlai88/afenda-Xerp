/** Serializable device session row — `createdAt` is ISO-8601 when normalized. */
export interface AfendaAuthDeviceSession {
  readonly session: {
    readonly createdAt?: string;
    readonly id: string;
    readonly ipAddress?: string | null;
    readonly token: string;
    readonly userAgent?: string | null;
  };
}

function normalizeDeviceSessionCreatedAt(value: unknown): string | undefined {
  if (value === undefined) {
    return;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return typeof value === "string" ? value : undefined;
}

function normalizeAfendaAuthDeviceSession(
  value: AfendaAuthDeviceSession
): AfendaAuthDeviceSession {
  const createdAt = normalizeDeviceSessionCreatedAt(value.session.createdAt);

  if (createdAt === undefined) {
    return value;
  }

  return {
    session: {
      ...value.session,
      createdAt,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isAfendaAuthDeviceSession(
  value: unknown
): value is AfendaAuthDeviceSession {
  if (!isRecord(value)) {
    return false;
  }

  const session = value["session"];
  if (!isRecord(session)) {
    return false;
  }

  return (
    typeof session["id"] === "string" &&
    typeof session["token"] === "string" &&
    (session["createdAt"] === undefined ||
      session["createdAt"] instanceof Date ||
      typeof session["createdAt"] === "string") &&
    (session["ipAddress"] === undefined ||
      session["ipAddress"] === null ||
      typeof session["ipAddress"] === "string") &&
    (session["userAgent"] === undefined ||
      session["userAgent"] === null ||
      typeof session["userAgent"] === "string")
  );
}

export function parseAfendaAuthDeviceSessions(
  value: unknown
): readonly AfendaAuthDeviceSession[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isAfendaAuthDeviceSession)
    .map(normalizeAfendaAuthDeviceSession);
}

function readSessionTwoFactorEnabled(value: unknown): boolean | undefined {
  if (!isRecord(value)) {
    return;
  }

  const user = value["user"];
  if (!isRecord(user)) {
    return;
  }

  return typeof user["twoFactorEnabled"] === "boolean"
    ? user["twoFactorEnabled"]
    : undefined;
}

/** Reads MFA enrollment from Better Auth client session payload when present. */
export function readAfendaAuthSessionTwoFactorEnabled(
  sessionPayload: unknown
): boolean | undefined {
  return readSessionTwoFactorEnabled(sessionPayload);
}
