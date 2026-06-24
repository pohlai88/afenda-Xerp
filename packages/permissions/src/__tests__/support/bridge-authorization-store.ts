import {
  type AfendaDatabase,
  auditEvents,
  companies,
  memberships,
  permissions,
  rolePermissions,
  roles,
  tenants,
  users,
} from "@afenda/database";
import { vi } from "vitest";

export interface BridgeTenantRow {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly status: string;
}

export interface BridgeUserRow {
  readonly displayName: string | null;
  readonly email: string;
  readonly id: string;
  readonly status: string;
}

export interface BridgeCompanyRow {
  readonly id: string;
  readonly tenantId: string;
}

export interface BridgeRoleRow {
  readonly description: string | null;
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly scope: string;
  readonly status: string;
  readonly tenantId: string | null;
}

export interface BridgePermissionRow {
  readonly action: string;
  readonly domain: string;
  readonly id: string;
  readonly key: string;
  readonly name: string;
}

export interface BridgeMembershipRow {
  readonly companyId: string | null;
  readonly entityGroupId: string | null;
  readonly id: string;
  readonly organizationId: string | null;
  readonly projectId: string | null;
  readonly roleId: string;
  readonly scopeType: string;
  readonly status: string;
  readonly tenantId: string;
  readonly userId: string;
}

export interface BridgeAuthorizationStore {
  companies: Map<string, BridgeCompanyRow>;
  memberships: BridgeMembershipRow[];
  permissions: Map<string, BridgePermissionRow>;
  rolePermissions: Set<string>;
  roles: Map<string, BridgeRoleRow>;
  tenants: Map<string, BridgeTenantRow>;
  users: Map<string, BridgeUserRow>;
}

export function createBridgeAuthorizationStore(): BridgeAuthorizationStore {
  return {
    tenants: new Map(),
    users: new Map(),
    companies: new Map(),
    roles: new Map(),
    permissions: new Map(),
    memberships: [],
    rolePermissions: new Set(),
  };
}

function snakeToCamel(value: string): string {
  return value.replace(/_([a-z])/gu, (_, letter: string) =>
    letter.toUpperCase()
  );
}

function parseEqFilters(
  condition: unknown
): Array<{ column: string; value: unknown }> {
  if (!condition || typeof condition !== "object") {
    return [];
  }

  if (!("queryChunks" in condition)) {
    return [];
  }

  const filters: Array<{ column: string; value: unknown }> = [];
  const chunks = (condition as { queryChunks: unknown[] }).queryChunks;

  for (const chunk of chunks) {
    if (
      chunk &&
      typeof chunk === "object" &&
      "queryChunks" in chunk &&
      !("name" in chunk)
    ) {
      filters.push(...parseEqFilters(chunk));
      continue;
    }

    if (
      chunk &&
      typeof chunk === "object" &&
      "name" in chunk &&
      typeof (chunk as { name: unknown }).name === "string"
    ) {
      const columnName = (chunk as { name: string }).name;
      const paramChunk = chunks.find(
        (candidate) =>
          candidate &&
          typeof candidate === "object" &&
          "value" in candidate &&
          (candidate as { encoder?: { name?: string } }).encoder?.name ===
            columnName
      );

      if (
        paramChunk &&
        typeof paramChunk === "object" &&
        "value" in paramChunk
      ) {
        filters.push({
          column: columnName,
          value: (paramChunk as { value: unknown }).value,
        });
      }
    }
  }

  return filters;
}

function filtersToRecord(
  filters: Array<{ column: string; value: unknown }>
): Record<string, unknown> {
  return Object.fromEntries(
    filters.map(({ column, value }) => [snakeToCamel(column), value])
  );
}

function projectFields(
  source: object,
  fields: Record<string, { name?: string }>
): Record<string, unknown> {
  const record = source as Record<string, unknown>;
  const row: Record<string, unknown> = {};

  for (const [resultKey, column] of Object.entries(fields)) {
    const columnName = column?.name;
    if (columnName) {
      const camelKey = snakeToCamel(columnName);
      row[resultKey] = record[camelKey] ?? record[resultKey];
      continue;
    }

    row[resultKey] = record[resultKey];
  }

  return row;
}

function rolePermissionKey(roleId: string, permissionId: string): string {
  return `${roleId}:${permissionId}`;
}

function queryTable(
  store: BridgeAuthorizationStore,
  table: unknown,
  fields: Record<string, { name?: string }>,
  filters: Record<string, unknown>
): Record<string, unknown>[] {
  if (table === roles) {
    const role = filters["id"]
      ? store.roles.get(String(filters["id"]))
      : undefined;
    return role ? [projectFields({ ...role }, fields)] : [];
  }

  if (table === permissions) {
    const permission = filters["id"]
      ? store.permissions.get(String(filters["id"]))
      : undefined;
    return permission ? [projectFields({ ...permission }, fields)] : [];
  }

  if (table === users) {
    const user = filters["id"]
      ? store.users.get(String(filters["id"]))
      : undefined;
    return user ? [projectFields({ ...user }, fields)] : [];
  }

  if (table === tenants) {
    const tenant = filters["id"]
      ? store.tenants.get(String(filters["id"]))
      : undefined;
    return tenant ? [projectFields({ ...tenant }, fields)] : [];
  }

  if (table === companies) {
    const company = filters["id"]
      ? store.companies.get(String(filters["id"]))
      : undefined;

    if (!company) {
      return [];
    }

    if (
      filters["tenantId"] !== undefined &&
      company.tenantId !== filters["tenantId"]
    ) {
      return [];
    }

    return [projectFields({ ...company }, fields)];
  }

  if (table === memberships) {
    return store.memberships
      .filter((membership) => {
        if (
          filters["userId"] !== undefined &&
          membership.userId !== filters["userId"]
        ) {
          return false;
        }

        if (
          filters["tenantId"] !== undefined &&
          membership.tenantId !== filters["tenantId"]
        ) {
          return false;
        }

        return true;
      })
      .map((membership) => projectFields({ ...membership }, fields));
  }

  if (table === rolePermissions) {
    const roleId = String(filters["roleId"] ?? "");
    const rows = [...store.rolePermissions]
      .filter((entry) => entry.startsWith(`${roleId}:`))
      .map((entry) => {
        const [, permissionId] = entry.split(":");
        return {
          roleId,
          permissionId,
        };
      });

    return rows.map((row) => projectFields(row, fields));
  }

  return [];
}

function queryRolePermissionJoin(
  store: BridgeAuthorizationStore,
  fields: Record<string, { name?: string }>,
  filters: Record<string, unknown>
): Record<string, unknown>[] {
  const roleId = String(filters["roleId"] ?? "");
  const rows: Record<string, unknown>[] = [];

  for (const entry of store.rolePermissions) {
    if (!entry.startsWith(`${roleId}:`)) {
      continue;
    }

    const permissionId = entry.slice(roleId.length + 1);
    const permission = store.permissions.get(permissionId);

    if (!permission) {
      continue;
    }

    rows.push(projectFields({ key: permission.key }, fields));
  }

  return rows;
}

function createQueryResult<Row>(rows: readonly Row[]) {
  const queryResult = {
    limit: vi.fn(() => Promise.resolve(rows)),
  };

  // biome-ignore lint/suspicious/noThenProperty: Test double intentionally models Drizzle awaitable query builders.
  Object.defineProperty(queryResult, "then", {
    enumerable: false,
    value: (
      onFulfilled: (value: readonly Row[]) => unknown,
      onRejected?: (reason: unknown) => unknown
    ) => Promise.resolve(rows).then(onFulfilled, onRejected),
  });

  return queryResult;
}

export function createBridgeAuthorizationDatabase(
  store: BridgeAuthorizationStore
): AfendaDatabase {
  return {
    select: vi.fn((fields: Record<string, { name?: string }>) => ({
      from: vi.fn((table: unknown) => {
        const whereChain = {
          where: vi.fn((condition: unknown) => {
            const filters = filtersToRecord(parseEqFilters(condition));
            const rows = queryTable(store, table, fields, filters);
            const queryResult = createQueryResult(rows);

            return Object.assign(queryResult, {
              innerJoin: vi.fn((joinTable: unknown, _onClause: unknown) => ({
                where: vi.fn((joinCondition: unknown) => {
                  const joinFilters = filtersToRecord(
                    parseEqFilters(joinCondition)
                  );
                  const joinRows =
                    table === rolePermissions && joinTable === permissions
                      ? queryRolePermissionJoin(store, fields, joinFilters)
                      : [];

                  return createQueryResult(joinRows);
                }),
              })),
            });
          }),
          innerJoin: vi.fn((joinTable: unknown, _onClause: unknown) => ({
            where: vi.fn((condition: unknown) => {
              const filters = filtersToRecord(parseEqFilters(condition));
              const joinRows =
                table === rolePermissions && joinTable === permissions
                  ? queryRolePermissionJoin(store, fields, filters)
                  : [];

              return createQueryResult(joinRows);
            }),
          })),
        };

        return {
          ...whereChain,
          limit: vi.fn(() =>
            Promise.resolve(queryTable(store, table, fields, {}))
          ),
        };
      }),
    })),
    insert: vi.fn((table: unknown) => ({
      values: vi.fn((row: { roleId?: string; permissionId?: string }) => ({
        onConflictDoNothing: vi.fn(() => ({
          returning: vi.fn(() => {
            if (table !== rolePermissions) {
              return [];
            }

            const roleId = String(row.roleId);
            const permissionId = String(row.permissionId);
            const key = rolePermissionKey(roleId, permissionId);

            if (store.rolePermissions.has(key)) {
              return [];
            }

            store.rolePermissions.add(key);

            return [
              {
                roleId,
                permissionId,
              },
            ];
          }),
        })),
        returning: vi.fn(() => {
          if (table === auditEvents) {
            return [{ id: "audit-bridge-001" }];
          }

          return [];
        }),
      })),
    })),
  } as unknown as AfendaDatabase;
}
