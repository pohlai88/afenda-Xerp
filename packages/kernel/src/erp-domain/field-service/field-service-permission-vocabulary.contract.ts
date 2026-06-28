export const FIELD_SERVICE_PERMISSION_DOMAINS = [
  "workOrder",
  "dispatch",
  "route",
] as const;

export type FieldServicePermissionDomain =
  (typeof FIELD_SERVICE_PERMISSION_DOMAINS)[number];

export const FIELD_SERVICE_PERMISSION_ACTIONS = {
  workOrder: ["read", "create", "close"] as const,
  dispatch: ["read", "manage"] as const,
  route: ["read", "manage"] as const,
} as const satisfies Record<FieldServicePermissionDomain, readonly string[]>;

export type FieldServicePermissionAction<
  TDomain extends FieldServicePermissionDomain = FieldServicePermissionDomain,
> = (typeof FIELD_SERVICE_PERMISSION_ACTIONS)[TDomain][number];

export function toFieldServicePermissionKey(
  domain: FieldServicePermissionDomain,
  action: FieldServicePermissionAction
): string {
  return `field-service.${domain}_${action}`;
}

export const FIELD_SERVICE_PERMISSION_KEY_VOCABULARY = [
  toFieldServicePermissionKey("workOrder", "read"),
  toFieldServicePermissionKey("workOrder", "create"),
  toFieldServicePermissionKey("workOrder", "close"),
  toFieldServicePermissionKey("dispatch", "read"),
  toFieldServicePermissionKey("dispatch", "manage"),
  toFieldServicePermissionKey("route", "read"),
  toFieldServicePermissionKey("route", "manage"),
] as const;

export type FieldServicePermissionKey =
  (typeof FIELD_SERVICE_PERMISSION_KEY_VOCABULARY)[number];
