/**
 * Operating-context composition slot for resolved permission grant scope.
 *
 * Canonical resolved type: `@afenda/permissions` `PermissionScopeContext`.
 * Kernel retains this wire slot so `OperatingContext` does not import `@afenda/permissions`.
 */
import type {
  PermissionGrantElevationFlags,
  PermissionGrantScopeType,
} from "./permission-grant-vocabulary.contract.js";

export interface OperatingContextPermissionScope {
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

/** @deprecated Import `PermissionScopeContext` from `@afenda/permissions`. */
export type PermissionScopeContext = OperatingContextPermissionScope;

/** @deprecated Import `PermissionScopeWireContext` from `@afenda/permissions`. */
export type PermissionScopeWireContext = OperatingContextPermissionScope;

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
  AssertJsonSerializable<OperatingContextPermissionScope>;

/** @deprecated Use `@afenda/permissions` `assertPermissionScopeContextJsonSerializable`. */
export type assertPermissionScopeContextJsonSerializable =
  _PermissionScopeWireSerializable extends true ? true : never;
