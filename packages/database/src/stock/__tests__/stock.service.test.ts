import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  listStockLevelsByTenant,
  recordStockMovement,
  type StockInsufficientQuantityError,
  StockProductNotFoundError,
  StockScopeMismatchError,
  StockWarehouseNotFoundError,
} from "../stock.service.js";

const mockGetDb = vi.hoisted(() => vi.fn());
const mockInsertAuditEvent = vi.hoisted(() => vi.fn());

vi.mock("../../db.js", () => ({
  getDb: mockGetDb,
}));

vi.mock("../../audit/audit.writer.js", () => ({
  insertAuditEvent: mockInsertAuditEvent,
}));

interface MockSelectChain {
  from: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
}

function createSelectChain(result: unknown[]): MockSelectChain {
  const chain: MockSelectChain = {
    from: vi.fn(),
    limit: vi.fn(),
    where: vi.fn(),
  };

  chain.from.mockReturnValue(chain);
  chain.where.mockReturnValue(chain);
  chain.limit.mockResolvedValue(result);

  return chain;
}

function createInsertReturningChain<T>(result: T[]) {
  const returning = vi.fn().mockResolvedValue(result);
  const values = vi.fn().mockReturnValue({ returning });
  const insert = vi.fn().mockReturnValue({ values });

  return { insert, values, returning };
}

describe("stock.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsertAuditEvent.mockResolvedValue(undefined);
  });

  it("lists stock levels for a tenant and company", async () => {
    const selectChain = createSelectChain([
      {
        tenantId: "tenant-1",
        companyId: "company-1",
        productId: "product-1",
        warehouseId: "warehouse-1",
        quantityOnHand: "12.0000",
      },
    ]);

    mockGetDb.mockReturnValue({
      select: vi.fn().mockReturnValue(selectChain),
    });

    await expect(
      listStockLevelsByTenant({
        tenantId: "tenant-1",
        companyId: "company-1",
      })
    ).resolves.toEqual([
      {
        tenantId: "tenant-1",
        companyId: "company-1",
        productId: "product-1",
        warehouseId: "warehouse-1",
        quantityOnHand: "12.0000",
      },
    ]);
  });

  it("records a receipt movement and returns resulting quantity on hand", async () => {
    const productSelect = createSelectChain([{ tenantId: "tenant-1" }]);
    const warehouseSelect = createSelectChain([
      { tenantId: "tenant-1", companyId: "company-1" },
    ]);
    const stockLevelSelect = createSelectChain([]);

    const movementInsert = createInsertReturningChain([{ id: "movement-1" }]);
    const levelInsert = createInsertReturningChain([
      { quantityOnHand: "10.0000" },
    ]);
    levelInsert.values.mockReturnValue({
      onConflictDoUpdate: vi.fn().mockReturnValue({
        returning: levelInsert.returning,
      }),
    });

    let selectCall = 0;
    const tx = {
      select: vi.fn(() => {
        selectCall += 1;
        if (selectCall === 1) {
          return productSelect;
        }
        if (selectCall === 2) {
          return warehouseSelect;
        }
        return stockLevelSelect;
      }),
      insert: vi
        .fn()
        .mockReturnValueOnce(movementInsert.insert())
        .mockReturnValueOnce(levelInsert.insert()),
    };

    mockGetDb.mockReturnValue({
      transaction: vi.fn(
        async (callback: (db: typeof tx) => Promise<unknown>) => callback(tx)
      ),
    });

    await expect(
      recordStockMovement({
        audit: {
          actorType: "user",
          actorUserId: "user-1",
          correlationId: "corr-1",
          source: "api",
        },
        companyId: "company-1",
        movementType: "receipt",
        productId: "product-1",
        quantityDelta: "10.0000",
        tenantId: "tenant-1",
        warehouseId: "warehouse-1",
      })
    ).resolves.toEqual({
      movementId: "movement-1",
      quantityOnHand: "10.0000",
    });

    expect(mockInsertAuditEvent).toHaveBeenCalledOnce();
  });

  it("throws when the product is missing", async () => {
    const productSelect = createSelectChain([]);

    const tx = {
      select: vi.fn().mockReturnValue(productSelect),
    };

    mockGetDb.mockReturnValue({
      transaction: vi.fn(
        async (callback: (db: typeof tx) => Promise<unknown>) => callback(tx)
      ),
    });

    await expect(
      recordStockMovement({
        audit: {
          actorType: "user",
          actorUserId: "user-1",
          correlationId: "corr-1",
        },
        companyId: "company-1",
        movementType: "issue",
        productId: "missing-product",
        quantityDelta: "-1.0000",
        tenantId: "tenant-1",
        warehouseId: "warehouse-1",
      })
    ).rejects.toBeInstanceOf(StockProductNotFoundError);
  });

  it("throws when the warehouse is missing", async () => {
    const productSelect = createSelectChain([{ tenantId: "tenant-1" }]);
    const warehouseSelect = createSelectChain([]);

    let selectCall = 0;
    const tx = {
      select: vi.fn(() => {
        selectCall += 1;
        return selectCall === 1 ? productSelect : warehouseSelect;
      }),
    };

    mockGetDb.mockReturnValue({
      transaction: vi.fn(
        async (callback: (db: typeof tx) => Promise<unknown>) => callback(tx)
      ),
    });

    await expect(
      recordStockMovement({
        audit: {
          actorType: "user",
          actorUserId: "user-1",
          correlationId: "corr-1",
        },
        companyId: "company-1",
        movementType: "issue",
        productId: "product-1",
        quantityDelta: "-1.0000",
        tenantId: "tenant-1",
        warehouseId: "missing-warehouse",
      })
    ).rejects.toBeInstanceOf(StockWarehouseNotFoundError);
  });

  it("throws when warehouse company scope mismatches", async () => {
    const productSelect = createSelectChain([{ tenantId: "tenant-1" }]);
    const warehouseSelect = createSelectChain([
      { tenantId: "tenant-1", companyId: "company-2" },
    ]);

    let selectCall = 0;
    const tx = {
      select: vi.fn(() => {
        selectCall += 1;
        return selectCall === 1 ? productSelect : warehouseSelect;
      }),
    };

    mockGetDb.mockReturnValue({
      transaction: vi.fn(
        async (callback: (db: typeof tx) => Promise<unknown>) => callback(tx)
      ),
    });

    await expect(
      recordStockMovement({
        audit: {
          actorType: "user",
          actorUserId: "user-1",
          correlationId: "corr-1",
        },
        companyId: "company-1",
        movementType: "issue",
        productId: "product-1",
        quantityDelta: "-1.0000",
        tenantId: "tenant-1",
        warehouseId: "warehouse-1",
      })
    ).rejects.toBeInstanceOf(StockScopeMismatchError);
  });

  it("throws when an issue would drive quantity on hand below zero", async () => {
    const productSelect = createSelectChain([{ tenantId: "tenant-1" }]);
    const warehouseSelect = createSelectChain([
      { tenantId: "tenant-1", companyId: "company-1" },
    ]);
    const stockLevelSelect = createSelectChain([{ quantityOnHand: "2.0000" }]);

    let selectCall = 0;
    const tx = {
      select: vi.fn(() => {
        selectCall += 1;
        if (selectCall === 1) {
          return productSelect;
        }
        if (selectCall === 2) {
          return warehouseSelect;
        }
        return stockLevelSelect;
      }),
    };

    mockGetDb.mockReturnValue({
      transaction: vi.fn(
        async (callback: (db: typeof tx) => Promise<unknown>) => callback(tx)
      ),
    });

    await expect(
      recordStockMovement({
        audit: {
          actorType: "user",
          actorUserId: "user-1",
          correlationId: "corr-1",
        },
        companyId: "company-1",
        movementType: "issue",
        productId: "product-1",
        quantityDelta: "-5.0000",
        tenantId: "tenant-1",
        warehouseId: "warehouse-1",
      })
    ).rejects.toEqual(
      expect.objectContaining<Partial<StockInsufficientQuantityError>>({
        name: "StockInsufficientQuantityError",
        productId: "product-1",
        warehouseId: "warehouse-1",
        quantityOnHand: "2.0000",
        quantityDelta: "-5.0000",
      })
    );
  });
});
