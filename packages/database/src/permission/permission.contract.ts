/**
 * Permission catalog governance — types and pure builders (no I/O).
 *
 * Table: `schema/permission.schema.ts`
 * Key shape: `permission-key.contract.ts`
 * Writes: `permission.service.ts`
 */
import {
  assertPermissionKey,
  type PermissionKey,
} from "../permission-key.contract.js";

export class PermissionKeyImmutableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionKeyImmutableError";
  }
}

export interface PermissionCatalogWriteInput {
  readonly description?: string | null;
  readonly key: string;
  readonly name: string;
}

export interface PermissionInsertRow {
  action: string;
  description: string | null;
  domain: string;
  key: PermissionKey;
  name: string;
}

export type PermissionRecord = PermissionInsertRow;

/** Permission key and derived domain/action are immutable after create. */
export type PermissionUpdatePatch = Partial<
  Pick<PermissionInsertRow, "name" | "description">
> & {
  readonly key?: never;
  readonly domain?: never;
  readonly action?: never;
};

export function buildPermissionInsertRow(
  input: PermissionCatalogWriteInput
): PermissionInsertRow {
  const key = assertPermissionKey(input.key);
  const dotIndex = key.indexOf(".");
  const domain = key.slice(0, dotIndex);
  const action = key.slice(dotIndex + 1);

  return {
    key,
    name: input.name.trim(),
    description: input.description?.trim() || null,
    domain,
    action,
  };
}

export function buildPermissionUpdatePatch(
  input: PermissionUpdatePatch
): PermissionUpdatePatch {
  if ("key" in input && input.key !== undefined) {
    throw new PermissionKeyImmutableError(
      "Permission key is immutable after create."
    );
  }
  if ("domain" in input && input.domain !== undefined) {
    throw new PermissionKeyImmutableError(
      "Permission domain is immutable after create."
    );
  }
  if ("action" in input && input.action !== undefined) {
    throw new PermissionKeyImmutableError(
      "Permission action is immutable after create."
    );
  }

  const patch: PermissionUpdatePatch = {};

  if (input.name !== undefined) {
    patch.name = input.name.trim();
  }
  if (input.description !== undefined) {
    patch.description = input.description?.trim() || null;
  }

  return patch;
}
