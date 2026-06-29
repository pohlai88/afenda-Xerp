import { MASTER_DATA_RECORD_STATUSES } from "@afenda/database";
import { z } from "zod";

export const inventoryProductRecordSchema = z
  .object({
    displayName: z.string().meta({
      description: "Human-readable product name.",
      example: "Widget Pro",
    }),
    productId: z.string().meta({
      description: "UUID of the product master record.",
      example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
    }),
    sku: z.string().meta({
      description: "Tenant-unique stock keeping unit.",
      example: "SKU-001",
    }),
    status: z.enum(MASTER_DATA_RECORD_STATUSES).meta({
      description: "Master data lifecycle status.",
      example: "draft",
    }),
    tenantId: z.string().meta({
      description: "UUID of the owning tenant.",
      example: "1a2b3c4d-5e6f-7081-92a3-b4c5d6e7f809",
    }),
  })
  .meta({
    id: "InventoryProductRecord",
    description: "Tenant-scoped product master data record.",
  });

export type InventoryProductRecordDto = z.infer<
  typeof inventoryProductRecordSchema
>;

export const inventoryProductsListResponseSchema = z
  .object({
    products: z.array(inventoryProductRecordSchema).meta({
      description: "Product master records for the active tenant.",
    }),
  })
  .meta({
    id: "InventoryProductsListResponse",
    description: "List of product master records within tenant scope.",
  });

export type InventoryProductsListResponseDto = z.infer<
  typeof inventoryProductsListResponseSchema
>;

export const inventoryProductCreateRequestSchema = z
  .object({
    displayName: z.string().trim().min(1).meta({
      description: "Human-readable product name.",
      example: "Widget Pro",
    }),
    sku: z.string().trim().min(1).meta({
      description: "Tenant-unique stock keeping unit.",
      example: "SKU-001",
    }),
    status: z.enum(MASTER_DATA_RECORD_STATUSES).optional().meta({
      description: "Initial lifecycle status; defaults to draft.",
      example: "draft",
    }),
  })
  .meta({
    id: "InventoryProductCreateRequest",
    description: "Request body for creating a product master record.",
  });

export type InventoryProductCreateRequestDto = z.infer<
  typeof inventoryProductCreateRequestSchema
>;

export const inventoryProductMutationResponseSchema = z
  .object({
    productId: z.string().meta({
      description: "UUID of the affected product master record.",
      example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
    }),
  })
  .meta({
    id: "InventoryProductMutationResponse",
    description: "Identifier returned after a product create or update.",
  });

export type InventoryProductMutationResponseDto = z.infer<
  typeof inventoryProductMutationResponseSchema
>;

export const inventoryProductUpdateRequestSchema = z
  .object({
    displayName: z.string().trim().min(1).optional().meta({
      description: "Updated human-readable product name.",
      example: "Widget Pro Plus",
    }),
    productId: z.string().trim().min(1).meta({
      description: "UUID of the product to update.",
      example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
    }),
    sku: z.string().trim().min(1).optional().meta({
      description: "Updated tenant-unique stock keeping unit.",
      example: "SKU-001-A",
    }),
    status: z.enum(MASTER_DATA_RECORD_STATUSES).optional().meta({
      description: "Updated master data lifecycle status.",
      example: "active",
    }),
  })
  .refine(
    (value) =>
      value.displayName !== undefined ||
      value.sku !== undefined ||
      value.status !== undefined,
    {
      message: "At least one updatable field is required.",
    }
  )
  .meta({
    id: "InventoryProductUpdateRequest",
    description: "Request body for updating a product master record.",
  });

export type InventoryProductUpdateRequestDto = z.infer<
  typeof inventoryProductUpdateRequestSchema
>;

export const inventoryWarehouseRecordSchema = z
  .object({
    companyId: z.string().meta({
      description: "UUID of the owning company.",
      example: "2b3c4d5e-6f70-8192-a3b4-c5d6e7f8091a",
    }),
    displayName: z.string().meta({
      description: "Human-readable warehouse name.",
      example: "Main Distribution Center",
    }),
    status: z.enum(MASTER_DATA_RECORD_STATUSES).meta({
      description: "Master data lifecycle status.",
      example: "draft",
    }),
    tenantId: z.string().meta({
      description: "UUID of the owning tenant.",
      example: "1a2b3c4d-5e6f-7081-92a3-b4c5d6e7f809",
    }),
    warehouseCode: z.string().meta({
      description: "Company-scoped warehouse code.",
      example: "WH-MAIN",
    }),
    warehouseId: z.string().meta({
      description: "UUID of the warehouse master record.",
      example: "9a8b7c6d-5e4f-3210-abcd-ef1234567890",
    }),
  })
  .meta({
    id: "InventoryWarehouseRecord",
    description: "Company-scoped warehouse master data record.",
  });

export type InventoryWarehouseRecordDto = z.infer<
  typeof inventoryWarehouseRecordSchema
>;

export const inventoryWarehousesListResponseSchema = z
  .object({
    warehouses: z.array(inventoryWarehouseRecordSchema).meta({
      description: "Warehouse master records for the active company.",
    }),
  })
  .meta({
    id: "InventoryWarehousesListResponse",
    description: "List of warehouse master records within company scope.",
  });

export type InventoryWarehousesListResponseDto = z.infer<
  typeof inventoryWarehousesListResponseSchema
>;

export const inventoryWarehouseCreateRequestSchema = z
  .object({
    displayName: z.string().trim().min(1).meta({
      description: "Human-readable warehouse name.",
      example: "Main Distribution Center",
    }),
    status: z.enum(MASTER_DATA_RECORD_STATUSES).optional().meta({
      description: "Initial lifecycle status; defaults to draft.",
      example: "draft",
    }),
    warehouseCode: z.string().trim().min(1).meta({
      description: "Company-scoped warehouse code.",
      example: "WH-MAIN",
    }),
  })
  .meta({
    id: "InventoryWarehouseCreateRequest",
    description: "Request body for creating a warehouse master record.",
  });

export type InventoryWarehouseCreateRequestDto = z.infer<
  typeof inventoryWarehouseCreateRequestSchema
>;

export const inventoryWarehouseMutationResponseSchema = z
  .object({
    warehouseId: z.string().meta({
      description: "UUID of the affected warehouse master record.",
      example: "9a8b7c6d-5e4f-3210-abcd-ef1234567890",
    }),
  })
  .meta({
    id: "InventoryWarehouseMutationResponse",
    description: "Identifier returned after a warehouse create or update.",
  });

export type InventoryWarehouseMutationResponseDto = z.infer<
  typeof inventoryWarehouseMutationResponseSchema
>;

export const inventoryWarehouseUpdateRequestSchema = z
  .object({
    displayName: z.string().trim().min(1).optional().meta({
      description: "Updated human-readable warehouse name.",
      example: "Regional Distribution Center",
    }),
    status: z.enum(MASTER_DATA_RECORD_STATUSES).optional().meta({
      description: "Updated master data lifecycle status.",
      example: "active",
    }),
    warehouseCode: z.string().trim().min(1).optional().meta({
      description: "Updated company-scoped warehouse code.",
      example: "WH-REG-01",
    }),
    warehouseId: z.string().trim().min(1).meta({
      description: "UUID of the warehouse to update.",
      example: "9a8b7c6d-5e4f-3210-abcd-ef1234567890",
    }),
  })
  .refine(
    (value) =>
      value.displayName !== undefined ||
      value.status !== undefined ||
      value.warehouseCode !== undefined,
    {
      message: "At least one updatable field is required.",
    }
  )
  .meta({
    id: "InventoryWarehouseUpdateRequest",
    description: "Request body for updating a warehouse master record.",
  });

export type InventoryWarehouseUpdateRequestDto = z.infer<
  typeof inventoryWarehouseUpdateRequestSchema
>;

export const inventoryStockLevelRecordSchema = z
  .object({
    companyId: z.string().meta({
      description: "UUID of the owning company.",
      example: "2b3c4d5e-6f70-8192-a3b4-c5d6e7f8091a",
    }),
    productId: z.string().meta({
      description: "UUID of the product master record.",
      example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
    }),
    quantityOnHand: z.string().meta({
      description: "Decimal quantity on hand as a string.",
      example: "42.0000",
    }),
    tenantId: z.string().meta({
      description: "UUID of the owning tenant.",
      example: "1a2b3c4d-5e6f-7081-92a3-b4c5d6e7f809",
    }),
    warehouseId: z.string().meta({
      description: "UUID of the warehouse master record.",
      example: "9a8b7c6d-5e4f-3210-abcd-ef1234567890",
    }),
  })
  .meta({
    id: "InventoryStockLevelRecord",
    description: "Quantity-on-hand snapshot for a product at a warehouse.",
  });

export type InventoryStockLevelRecordDto = z.infer<
  typeof inventoryStockLevelRecordSchema
>;

export const inventoryStockLevelsListResponseSchema = z
  .object({
    stockLevels: z.array(inventoryStockLevelRecordSchema).meta({
      description: "Stock level snapshots for the active company.",
    }),
  })
  .meta({
    id: "InventoryStockLevelsListResponse",
    description: "List of quantity-on-hand snapshots within company scope.",
  });

export type InventoryStockLevelsListResponseDto = z.infer<
  typeof inventoryStockLevelsListResponseSchema
>;

export const inventoryStockMovementCreateRequestSchema = z
  .object({
    movementType: z.enum(["receipt", "issue", "adjustment"]).meta({
      description: "Stock movement classification.",
      example: "receipt",
    }),
    productId: z.string().trim().min(1).meta({
      description: "UUID of the product master record.",
      example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
    }),
    quantityDelta: z.string().trim().min(1).meta({
      description: "Signed decimal quantity change as a string.",
      example: "10.0000",
    }),
    reason: z.string().trim().min(1).optional().meta({
      description: "Optional human-readable reason for the movement.",
      example: "Cycle count adjustment",
    }),
    warehouseId: z.string().trim().min(1).meta({
      description: "UUID of the warehouse master record.",
      example: "9a8b7c6d-5e4f-3210-abcd-ef1234567890",
    }),
  })
  .meta({
    id: "InventoryStockMovementCreateRequest",
    description: "Request body for recording a stock movement.",
  });

export type InventoryStockMovementCreateRequestDto = z.infer<
  typeof inventoryStockMovementCreateRequestSchema
>;

export const inventoryStockMovementMutationResponseSchema = z
  .object({
    movementId: z.string().meta({
      description: "UUID of the recorded stock movement.",
      example: "7c6b5a49-3e2f-1098-7654-3210fedcba98",
    }),
    quantityOnHand: z.string().meta({
      description: "Resulting quantity on hand after the movement.",
      example: "52.0000",
    }),
  })
  .meta({
    id: "InventoryStockMovementMutationResponse",
    description: "Result returned after recording a stock movement.",
  });

export type InventoryStockMovementMutationResponseDto = z.infer<
  typeof inventoryStockMovementMutationResponseSchema
>;
