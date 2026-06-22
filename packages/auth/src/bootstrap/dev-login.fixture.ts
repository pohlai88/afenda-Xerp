/**
 * Dev login fixture — must stay aligned with
 * `packages/database/src/seeds/workspace-fixtures.ts` (`DEV_WORKSPACE_FIXTURE.user`).
 */
export const DEV_LOGIN_EMAIL = "dev-admin@localhost.afenda" as const;

export const DEV_LOGIN_DISPLAY_NAME = "Dev Workspace Admin" as const;

/** Better Auth email/password provider id (see auth-schema tests). */
export const DEV_AUTH_CREDENTIAL_PROVIDER_ID = "credential" as const;

export const DEV_LOGIN_EMAIL_ENV = "AFENDA_DEV_LOGIN_EMAIL" as const;

export const DEV_LOGIN_PASSWORD_ENV = "AFENDA_DEV_LOGIN_PASSWORD" as const;

export const DEV_AUTH_BOOTSTRAP_CONFIRM_ENV = "AFENDA_BOOTSTRAP_CONFIRM" as const;

export const DEV_AUTH_BOOTSTRAP_CONFIRM_VALUE = "yes" as const;

export const MIN_DEV_LOGIN_PASSWORD_LENGTH = 8;
