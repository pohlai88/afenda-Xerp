/**
 * Shared env workflow policy — keep in sync with scripts/env-utils.mjs.
 */
import {
  DEPRECATED_CONFIG_KEYS,
  DEPRECATED_SECRET_KEYS,
  LOCAL_SYNC_TARGETS,
  SOURCE_FILES,
} from "../../scripts/env-utils.mjs";

export { LOCAL_SYNC_TARGETS };

const EDITABLE_ENV_SOURCES = new Set([
  SOURCE_FILES.config,
  SOURCE_FILES.secret,
  ".env.example",
  ".env.config.local",
]);

const ENV_ASSIGNMENT = /^([A-Z][A-Z0-9_]*)\s*=/;

export function isSyncedEnvOutput(relativePath) {
  return LOCAL_SYNC_TARGETS.includes(relativePath);
}

export function isEditableEnvSource(relativePath) {
  return EDITABLE_ENV_SOURCES.has(relativePath);
}

export function extractEnvKeys(content) {
  const keys = new Set();

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(ENV_ASSIGNMENT);

    if (match) {
      keys.add(match[1]);
    }
  }

  return keys;
}

export function findDeprecatedKeys(relativePath, content) {
  const keys = extractEnvKeys(content);
  let deprecatedKeys = [];

  if (relativePath === SOURCE_FILES.config) {
    deprecatedKeys = DEPRECATED_CONFIG_KEYS;
  } else if (relativePath === SOURCE_FILES.secret) {
    deprecatedKeys = DEPRECATED_SECRET_KEYS;
  }

  return deprecatedKeys.filter((key) => keys.has(key));
}

export function envSyncReminder(relativePath) {
  if (!isEditableEnvSource(relativePath)) {
    return null;
  }

  return (
    "Env source edited. Run `pnpm env:console refresh` (or `pnpm env:sync` then `pnpm env:doctor`) before finishing. " +
    "Do not edit generated targets (.env, .env.local, apps/*/ .env.local, packages/database/.env)."
  );
}
