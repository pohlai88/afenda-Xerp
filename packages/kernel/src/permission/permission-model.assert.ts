import type { AssertJsonSerializable } from "../contracts/json-wire.contract.js";
import { isPermissionAction } from "./permission-action.contract.js";
import type {
  PermissionModelDescriptor,
  PermissionModelWireDescriptor,
} from "./permission-model.contract.js";
import { isPermissionModelDescriptor } from "./permission-model.contract.js";
import { isPermissionModelScope } from "./permission-model-scope.contract.js";

type _PermissionModelWireSerializable =
  AssertJsonSerializable<PermissionModelWireDescriptor>;

/** Compile-time guard — permission model wire descriptor must remain JSON-serializable. */
export type assertPermissionModelDescriptorJsonSerializable =
  _PermissionModelWireSerializable extends true ? true : never;

function assertExactKeys(
  record: Record<string, unknown>,
  allowed: readonly string[]
): void {
  const keys = Object.keys(record);

  if (
    keys.length !== allowed.length ||
    !allowed.every((key) => keys.includes(key))
  ) {
    throw new Error(
      `PermissionModelWireDescriptor has unexpected keys; allowed: ${allowed.join(", ")}.`
    );
  }
}

function assertWireModule(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("module must be a non-empty string.");
  }

  return value;
}

function assertWireAction(
  value: unknown
): PermissionModelWireDescriptor["action"] {
  if (typeof value !== "string" || !isPermissionAction(value)) {
    throw new Error("action must be a valid permission action.");
  }

  return value;
}

function assertWireScope(
  value: unknown
): PermissionModelWireDescriptor["scope"] {
  if (typeof value !== "string" || !isPermissionModelScope(value)) {
    throw new Error("scope must be a valid permission model scope.");
  }

  return value;
}

/** Semantic guard for typed permission model descriptors before evaluation handoff. */
export function assertPermissionModelDescriptor(
  value: PermissionModelDescriptor
): PermissionModelDescriptor {
  if (!isPermissionModelDescriptor(value)) {
    throw new Error("PermissionModelDescriptor failed semantic validation.");
  }

  return value;
}

/**
 * JSON ingress guard — narrow unknown wire payloads with strict keys, then run semantic asserts.
 * Fail closed before downstream permission evaluation or persistence.
 */
export function assertWirePermissionModelDescriptor(
  value: unknown
): asserts value is PermissionModelWireDescriptor {
  if (value === null || typeof value !== "object") {
    throw new Error("PermissionModelWireDescriptor must be an object.");
  }

  const record = value as Record<string, unknown>;
  assertExactKeys(record, ["module", "action", "scope"]);

  const moduleValue = assertWireModule(record["module"]);
  const action = assertWireAction(record["action"]);
  const scope = assertWireScope(record["scope"]);

  assertPermissionModelDescriptor({ module: moduleValue, action, scope });
}
