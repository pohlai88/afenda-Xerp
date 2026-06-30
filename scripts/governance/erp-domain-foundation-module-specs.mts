/**
 * PAS-001B foundation modules — accounting (B76) and inventory (B79).
 * Extended specs preserve ADR cross-refs and accounting §4.1.6 quarantine.
 */
import type { ErpDomainVocabularySpec } from "./erp-domain-vocabulary-module-specs.mts";

export interface ErpDomainBrandedIdSpec {
  readonly comment?: string;
  readonly forbiddenOnPlatformFloor?: boolean;
  readonly typeName: string;
}

export interface ErpDomainFoundationModuleSpec extends ErpDomainVocabularySpec {
  readonly authorityAdr: "ADR-0020";
  readonly authorityFingerprint: string;
  readonly brandedIds: readonly ErpDomainBrandedIdSpec[];
  readonly permissionMode: "accounting" | "standard";
  readonly policyNoteField:
    | "businessReferenceNote"
    | "forbiddenPlatformFloorNote";
  readonly registryId: string;
  readonly vocabularyRegistryId: string;
  readonly wireContextMode: "accounting" | "inventory";
}

export const ERP_DOMAIN_FOUNDATION_MODULE_SPECS = [
  {
    slug: "accounting",
    slice: "B76",
    rule: "Kernel may describe accounting words. It must not execute accounting.",
    policyNoteField: "forbiddenPlatformFloorNote",
    businessReferenceNote:
      "FiscalCalendarId and FiscalPeriodId remain on @afenda/kernel/erp-domain/accounting only — ADR-0032 permanent quarantine; see FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS (PAS-001 §4.1.6).",
    authorityAdr: "ADR-0020",
    registryId: "PKG-R01",
    vocabularyRegistryId: "PAS-001B-4.8-ACCOUNTING",
    authorityFingerprint: "ACCOUNTING-AUTHORITY-2026-06-28-v1",
    brandedIds: [
      { typeName: "AccountId" },
      { typeName: "JournalEntryId" },
      {
        typeName: "FiscalCalendarId",
        forbiddenOnPlatformFloor: true,
        comment:
          "Forbidden on platform floor — accounting-domain subpath only (PAS-001 §4.1.6).",
      },
      {
        typeName: "FiscalPeriodId",
        forbiddenOnPlatformFloor: true,
        comment:
          "Forbidden on platform floor — accounting-domain subpath only (PAS-001 §4.1.6).",
      },
      { typeName: "LedgerAccountCode" },
    ],
    vocabs: [
      {
        file: "account-type",
        type: "AccountType",
        values: [
          "asset",
          "contra_asset",
          "liability",
          "contra_liability",
          "equity",
          "contra_equity",
          "revenue",
          "expense",
          "memo",
        ],
      },
      {
        file: "posting-status",
        type: "PostingStatus",
        values: [
          "draft",
          "pending_approval",
          "approved",
          "posted",
          "reversed",
          "cancelled",
        ],
      },
      {
        file: "fiscal-period-state",
        type: "FiscalPeriodState",
        values: ["not_opened", "open", "closed", "locked", "adjusting"],
      },
      {
        file: "journal-document-type",
        type: "JournalDocumentType",
        values: [
          "standard",
          "adjusting",
          "reversing",
          "opening_balance",
          "accrual",
          "intercompany",
          "consolidation",
        ],
      },
      {
        file: "consolidation-method",
        type: "ConsolidationMethod",
        values: ["full", "proportional", "equity", "cost", "none"],
      },
    ],
    permissions: {
      coa: ["read", "manage"],
      fiscalPeriod: ["read", "manage", "close"],
      journal: ["read", "post", "approve", "reverse"],
    },
    permissionMode: "accounting",
    auditActions: [
      "coa.created",
      "coa.updated",
      "coa.deactivated",
      "journal.drafted",
      "journal.approved",
      "journal.posted",
      "journal.reversed",
      "period.opened",
      "period.closed",
      "period.reopened",
      "period.locked",
    ],
    prohibitedSurfaces: [
      "journal-posting-service",
      "ledger-service",
      "trial-balance-calculation",
      "consolidation-elimination-logic",
      "accounting-database-runtime",
      "accounting-package-recreation",
      "financial-statement-generation",
      "fiscal-calendar-setup-runtime",
      "period-close-workflow",
      "currency-conversion-logic",
    ],
    wireContextMode: "accounting",
    wireDefaultField: "baseCurrency",
    wireDefaultType: "string",
  },
  {
    slug: "inventory",
    slice: "B79",
    rule: "Kernel may describe inventory words. It must not execute stock posting or valuation.",
    policyNoteField: "businessReferenceNote",
    businessReferenceNote:
      "ProductId, WarehouseId, and SupplierId remain on kernel business-reference authority (PAS-001B Rule 2).",
    authorityAdr: "ADR-0020",
    registryId: "PKGR02_INVENTORY",
    vocabularyRegistryId: "PAS-001B-4.8-INVENTORY",
    authorityFingerprint: "INVENTORY-AUTHORITY-2026-06-28-v1",
    brandedIds: [
      { typeName: "StockMovementId" },
      { typeName: "StockAdjustmentId" },
      { typeName: "InventoryCountSessionId" },
    ],
    vocabs: [
      {
        file: "stock-movement-type",
        type: "StockMovementType",
        values: ["receipt", "issue", "transfer", "adjustment", "return"],
      },
      {
        file: "inventory-record-status",
        type: "InventoryRecordStatus",
        values: ["active", "blocked", "quarantine", "discontinued"],
      },
      {
        file: "stock-reservation-status",
        type: "StockReservationStatus",
        values: ["draft", "reserved", "fulfilled", "cancelled"],
      },
      {
        file: "valuation-method",
        type: "ValuationMethod",
        values: ["standard", "fifo", "lifo", "average"],
      },
    ],
    permissions: {
      product: ["read", "manage"],
      warehouse: ["read", "manage"],
      stockMovement: ["read", "post", "cancel"],
      stockReservation: ["read", "reserve", "fulfill", "cancel"],
    },
    permissionMode: "standard",
    auditActions: [
      "product.created",
      "product.updated",
      "product.deactivated",
      "warehouse.created",
      "warehouse.updated",
      "movement.drafted",
      "movement.posted",
      "movement.cancelled",
      "reservation.created",
      "reservation.fulfilled",
      "count.opened",
      "count.closed",
    ],
    prohibitedSurfaces: [
      "stock-posting-service",
      "inventory-valuation-engine",
      "warehouse-allocation-service",
      "inventory-database-runtime",
      "inventory-package-recreation",
      "lot-expiry-calculation",
      "reorder-point-optimizer",
      "physical-count-posting",
    ],
    wireContextMode: "inventory",
    wireDefaultField: "defaultValuationMethod",
    wireDefaultType: "ValuationMethod",
  },
] as const satisfies readonly ErpDomainFoundationModuleSpec[];
