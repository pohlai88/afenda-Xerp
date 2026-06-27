/** PAS §8 permission model descriptor — vocabulary only, no evaluation. */

import {
  isPermissionAction,
  type PermissionAction,
} from "./permission-action.contract.js";
import {
  isPermissionModelScope,
  type PermissionModelScope,
} from "./permission-model-scope.contract.js";

export const PERMISSION_MODEL_PATTERN = "module × action × scope" as const;

export interface PermissionModelDescriptor {
  readonly action: PermissionAction;
  readonly module: string;
  readonly scope: PermissionModelScope;
}

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _PermissionModelDescriptorSerializable =
  AssertJsonSerializable<PermissionModelDescriptor>;

/**
 * Compile-time guard — permission model descriptor must remain JSON-serializable.
 * No runtime overhead.
 */
export type assertPermissionModelDescriptorJsonSerializable =
  _PermissionModelDescriptorSerializable extends true ? true : never;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyModule(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Structural guard for wire-safe, serializable permission model descriptors. */
export function isPermissionModelDescriptor(
  value: unknown
): value is PermissionModelDescriptor {
  if (!isRecord(value)) {
    return false;
  }

  const moduleValue = value["module"];
  const action = value["action"];
  const scope = value["scope"];

  if (!isNonEmptyModule(moduleValue)) {
    return false;
  }

  if (typeof action !== "string" || !isPermissionAction(action)) {
    return false;
  }

  if (typeof scope !== "string" || !isPermissionModelScope(scope)) {
    return false;
  }

  return true;
}

/**
 * Composes `module.action` wire key segment used by `@afenda/database` permission storage.
 * Documented for parity only — no database import in kernel.
 */
export function composeModuleActionWireKey(
  module: string,
  action: PermissionAction
): `${string}.${PermissionAction}` {
  return `${module}.${action}`;
}
