import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { z } from "zod";
import type { ApiRouteContract } from "../api-contract";
import {
  API_GOVERNANCE_DOCUMENTATION_PATH,
  API_ROUTE_OWNER,
  DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
} from "../api-governance.constants";
import {
  type InventoryProductCreateRequestDto,
  type InventoryProductMutationResponseDto,
  type InventoryProductsListResponseDto,
  type InventoryProductUpdateRequestDto,
  type InventoryStockLevelsListResponseDto,
  type InventoryStockMovementCreateRequestDto,
  type InventoryStockMovementMutationResponseDto,
  type InventoryWarehouseCreateRequestDto,
  type InventoryWarehouseMutationResponseDto,
  type InventoryWarehousesListResponseDto,
  type InventoryWarehouseUpdateRequestDto,
  inventoryProductCreateRequestSchema,
  inventoryProductMutationResponseSchema,
  inventoryProductsListResponseSchema,
  inventoryProductUpdateRequestSchema,
  inventoryStockLevelsListResponseSchema,
  inventoryStockMovementCreateRequestSchema,
  inventoryStockMovementMutationResponseSchema,
  inventoryWarehouseCreateRequestSchema,
  inventoryWarehouseMutationResponseSchema,
  inventoryWarehousesListResponseSchema,
  inventoryWarehouseUpdateRequestSchema,
} from "./inventory.api-contract";

const emptyGetRequestSchema = z.undefined();

export const inventoryProductsGetContract = {
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.inventory.products.get",
  summary: "List products",
  description:
    "Returns product master records for the active tenant. Requires inventory product read permission.",
  lifecycle: "active",
  method: "GET",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/inventory/products",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.inventory.product.read,
  },
  rateLimitPolicy: "authenticated-standard",
  requestSchema: emptyGetRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#request:none",
  responseSchema: inventoryProductsListResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryProductsListResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["inventory", "products"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  undefined,
  InventoryProductsListResponseDto
>;

export const inventoryProductsPostContract = {
  audit: {
    action: "inventory.product.create",
    enabled: true,
    targetType: "product",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.inventory.products.post",
  summary: "Create product",
  description:
    "Creates a tenant-scoped product master record. Requires inventory product manage permission.",
  idempotency: { mode: "optional" },
  lifecycle: "active",
  method: "POST",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/inventory/products",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.inventory.product.manage,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: inventoryProductCreateRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryProductCreateRequestSchema",
  responseSchema: inventoryProductMutationResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryProductMutationResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["inventory", "products"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  InventoryProductCreateRequestDto,
  InventoryProductMutationResponseDto
>;

export const inventoryProductsPatchContract = {
  audit: {
    action: "inventory.product.update",
    enabled: true,
    targetType: "product",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.inventory.products.patch",
  summary: "Update product",
  description:
    "Updates a tenant-scoped product master record identified in the request body. Requires inventory product manage permission.",
  idempotency: { mode: "optional" },
  lifecycle: "active",
  method: "PATCH",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/inventory/products",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.inventory.product.manage,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: inventoryProductUpdateRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryProductUpdateRequestSchema",
  responseSchema: inventoryProductMutationResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryProductMutationResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["inventory", "products"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  InventoryProductUpdateRequestDto,
  InventoryProductMutationResponseDto
>;

export const inventoryWarehousesGetContract = {
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.inventory.warehouses.get",
  summary: "List warehouses",
  description:
    "Returns warehouse master records for the active company. Requires inventory warehouse read permission.",
  lifecycle: "active",
  method: "GET",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/inventory/warehouses",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.inventory.warehouse.read,
  },
  rateLimitPolicy: "authenticated-standard",
  requestSchema: emptyGetRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#request:none",
  responseSchema: inventoryWarehousesListResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryWarehousesListResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["inventory", "warehouses"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  undefined,
  InventoryWarehousesListResponseDto
>;

export const inventoryWarehousesPostContract = {
  audit: {
    action: "inventory.warehouse.create",
    enabled: true,
    targetType: "warehouse",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.inventory.warehouses.post",
  summary: "Create warehouse",
  description:
    "Creates a company-scoped warehouse master record. Requires inventory warehouse manage permission.",
  idempotency: { mode: "optional" },
  lifecycle: "active",
  method: "POST",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/inventory/warehouses",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.inventory.warehouse.manage,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: inventoryWarehouseCreateRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryWarehouseCreateRequestSchema",
  responseSchema: inventoryWarehouseMutationResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryWarehouseMutationResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["inventory", "warehouses"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  InventoryWarehouseCreateRequestDto,
  InventoryWarehouseMutationResponseDto
>;

export const inventoryWarehousesPatchContract = {
  audit: {
    action: "inventory.warehouse.update",
    enabled: true,
    targetType: "warehouse",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.inventory.warehouses.patch",
  summary: "Update warehouse",
  description:
    "Updates a company-scoped warehouse master record identified in the request body. Requires inventory warehouse manage permission.",
  idempotency: { mode: "optional" },
  lifecycle: "active",
  method: "PATCH",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/inventory/warehouses",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.inventory.warehouse.manage,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: inventoryWarehouseUpdateRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryWarehouseUpdateRequestSchema",
  responseSchema: inventoryWarehouseMutationResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryWarehouseMutationResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["inventory", "warehouses"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  InventoryWarehouseUpdateRequestDto,
  InventoryWarehouseMutationResponseDto
>;

export const inventoryStockLevelsGetContract = {
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.inventory.stock-levels.get",
  summary: "List stock levels",
  description:
    "Returns quantity-on-hand snapshots for the active company. Requires inventory product read permission.",
  lifecycle: "active",
  method: "GET",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/inventory/stock-levels",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.inventory.product.read,
  },
  rateLimitPolicy: "authenticated-standard",
  requestSchema: emptyGetRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#request:none",
  responseSchema: inventoryStockLevelsListResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryStockLevelsListResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["inventory", "stock"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  undefined,
  InventoryStockLevelsListResponseDto
>;

export const inventoryStockMovementsPostContract = {
  audit: {
    action: "inventory.stock.adjust",
    enabled: true,
    targetType: "stock_movement",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.inventory.stock-movements.post",
  summary: "Record stock movement",
  description:
    "Records a stock movement and updates quantity on hand. Requires inventory stock adjust permission.",
  idempotency: { mode: "optional" },
  lifecycle: "active",
  method: "POST",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/inventory/stock-movements",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.inventory.stock.adjust,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: inventoryStockMovementCreateRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryStockMovementCreateRequestSchema",
  responseSchema: inventoryStockMovementMutationResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/inventory/inventory.api-contract.ts#inventoryStockMovementMutationResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["inventory", "stock"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  InventoryStockMovementCreateRequestDto,
  InventoryStockMovementMutationResponseDto
>;
