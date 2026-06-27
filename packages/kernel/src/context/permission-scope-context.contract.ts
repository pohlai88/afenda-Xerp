/**
 * Resolved permission scope dimensions passed to `requirePermission()`.
 * Wire interfaces use plain string ids for JSON serialization (TIP-007).
 */
import type {
  PermissionGrantElevationFlags,
  PermissionGrantScopeType,
} from "./permission-grant-vocabulary.contract.js";

export interface PermissionScopeContext {
  readonly companyId: string | null;
  readonly elevations: PermissionGrantElevationFlags;
  readonly entityGroupId: string | null;
  readonly grantScopeType: PermissionGrantScopeType;
  readonly membershipId: string;
  readonly organizationId: string | null;
  readonly projectId: string | null;
  readonly roleId: string;
  readonly teamId: string | null;
  readonly tenantId: string;
}

/** Wire-format alias — plain string ids, JSON-serializable at rest. */
export type PermissionScopeWireContext = PermissionScopeContext;

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

type _PermissionScopeWireSerializable =
  AssertJsonSerializable<PermissionScopeWireContext>;

/**
 * Compile-time guard — permission scope wire context must remain JSON-serializable.
 * No runtime overhead.
 */
export type assertPermissionScopeContextJsonSerializable =
  _PermissionScopeWireSerializable extends true ? true : never;
