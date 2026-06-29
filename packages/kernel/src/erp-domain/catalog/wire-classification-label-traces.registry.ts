import { ACCOUNT_TYPES } from "../accounting/account-type.contract.js";
import { JOURNAL_DOCUMENT_TYPES } from "../accounting/journal-document-type.contract.js";
import { TRANSFER_TYPES } from "../assets/transfer-type.contract.js";
import { ELIMINATION_TYPES } from "../consolidation/elimination-type.contract.js";
import { CONTROLLING_DOCUMENT_TYPES } from "../controlling/controlling-document-type.contract.js";
import { ACTIVITY_TYPES } from "../crm/activity-type.contract.js";
import { CHANNEL_TYPES } from "../ecommerce/channel-type.contract.js";
import { EMPLOYMENT_TYPES } from "../hcm/employment-type.contract.js";
import { IC_TRANSACTION_TYPES } from "../intercompany/ic-transaction-type.contract.js";
import { STOCK_MOVEMENT_TYPES } from "../inventory/stock-movement-type.contract.js";
import { MAINTENANCE_ORDER_TYPES } from "../maintenance/maintenance-order-type.contract.js";
import { MANUFACTURING_ORDER_TYPES } from "../manufacturing/manufacturing-order-type.contract.js";
import { SHOP_FLOOR_EVENT_TYPES } from "../manufacturing/shop-floor-event-type.contract.js";
import { SEGMENT_TYPES } from "../marketing/segment-type.contract.js";
import { DEDUCTION_TYPES } from "../payroll/deduction-type.contract.js";
import { EARNINGS_TYPES } from "../payroll/earnings-type.contract.js";
import { TENDER_TYPES } from "../pos/tender-type.contract.js";
import { TRANSACTION_TYPES } from "../pos/transaction-type.contract.js";
import { DISCOUNT_TYPES } from "../pricing/discount-type.contract.js";
import { PROCUREMENT_DOCUMENT_TYPES } from "../procurement/procurement-document-type.contract.js";
import { INSPECTION_TYPES } from "../quality/inspection-type.contract.js";
import { SALES_DOCUMENT_TYPES } from "../sales/sales-document-type.contract.js";
import { RESOLUTION_TYPES } from "../service/resolution-type.contract.js";
import { SUBSCRIPTION_EVENT_TYPES } from "../subscription/subscription-event-type.contract.js";
import { FULFILLMENT_EVENT_TYPES } from "../supply-chain/fulfillment-event-type.contract.js";
import { WITHHOLDING_TYPES } from "../tax/withholding-type.contract.js";
import { TREASURY_INSTRUMENT_TYPES } from "../treasury/treasury-instrument-type.contract.js";
import {
  buildPas004LabelTraces,
  type ErpDomainWireShapeRole,
  type WireClassificationPas004LabelTraceEntry,
} from "./pas004-label-trace.contract.js";
import { WIRE_CONTESTED_VOCABULARY_PAS004_LABEL_TRACE_ENTRIES } from "./wire-contested-vocabulary-pas004-label-traces.registry.js";

export type { WireClassificationPas004LabelTraceEntry } from "./pas004-label-trace.contract.js";

function withWireShapeRole(
  entry: Omit<WireClassificationPas004LabelTraceEntry, "wireShapeRole"> & {
    readonly wireShapeRole?: ErpDomainWireShapeRole;
  }
): WireClassificationPas004LabelTraceEntry {
  return {
    ...entry,
    wireShapeRole: entry.wireShapeRole ?? "classification",
  };
}

export const ACCOUNT_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "accounting",
  "account-type",
  ACCOUNT_TYPES
);

export const JOURNAL_DOCUMENT_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "accounting",
  "journal-document-type",
  JOURNAL_DOCUMENT_TYPES
);

export const TRANSFER_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "assets",
  "transfer-type",
  TRANSFER_TYPES
);

export const CONTROLLING_DOCUMENT_TYPE_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "controlling",
    "controlling-document-type",
    CONTROLLING_DOCUMENT_TYPES
  );

export const ELIMINATION_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "consolidation",
  "elimination-type",
  ELIMINATION_TYPES
);

export const ACTIVITY_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "crm",
  "activity-type",
  ACTIVITY_TYPES
);

export const CHANNEL_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "ecommerce",
  "channel-type",
  CHANNEL_TYPES
);

export const EMPLOYMENT_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "hcm",
  "employment-type",
  EMPLOYMENT_TYPES
);

export const IC_TRANSACTION_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "intercompany",
  "ic-transaction-type",
  IC_TRANSACTION_TYPES
);

export const STOCK_MOVEMENT_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "inventory",
  "stock-movement-type",
  STOCK_MOVEMENT_TYPES
);

export const MANUFACTURING_ORDER_TYPE_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "manufacturing",
    "manufacturing-order-type",
    MANUFACTURING_ORDER_TYPES
  );

export const SHOP_FLOOR_EVENT_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "manufacturing",
  "shop-floor-event-type",
  SHOP_FLOOR_EVENT_TYPES
);

export const MAINTENANCE_ORDER_TYPE_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "maintenance",
    "maintenance-order-type",
    MAINTENANCE_ORDER_TYPES
  );

export const SEGMENT_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "marketing",
  "segment-type",
  SEGMENT_TYPES
);

export const DEDUCTION_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "payroll",
  "deduction-type",
  DEDUCTION_TYPES
);

export const EARNINGS_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "payroll",
  "earnings-type",
  EARNINGS_TYPES
);

export const TENDER_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "pos",
  "tender-type",
  TENDER_TYPES
);

export const TRANSACTION_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "pos",
  "transaction-type",
  TRANSACTION_TYPES
);

export const DISCOUNT_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "pricing",
  "discount-type",
  DISCOUNT_TYPES
);

export const PROCUREMENT_DOCUMENT_TYPE_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "procurement",
    "procurement-document-type",
    PROCUREMENT_DOCUMENT_TYPES
  );

export const INSPECTION_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "quality",
  "inspection-type",
  INSPECTION_TYPES
);

export const SALES_DOCUMENT_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "sales",
  "sales-document-type",
  SALES_DOCUMENT_TYPES
);

export const RESOLUTION_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "service",
  "resolution-type",
  RESOLUTION_TYPES
);

export const SUBSCRIPTION_EVENT_TYPE_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "subscription",
    "subscription-event-type",
    SUBSCRIPTION_EVENT_TYPES
  );

export const FULFILLMENT_EVENT_TYPE_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "supply-chain",
    "fulfillment-event-type",
    FULFILLMENT_EVENT_TYPES
  );

export const WITHHOLDING_TYPE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "tax",
  "withholding-type",
  WITHHOLDING_TYPES
);

export const TREASURY_INSTRUMENT_TYPE_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "treasury",
    "treasury-instrument-type",
    TREASURY_INSTRUMENT_TYPES
  );

export const WIRE_CLASSIFICATION_PAS004_LABEL_TRACE_ENTRIES = [
  withWireShapeRole({
    moduleSlug: "accounting",
    classificationId: "account-type",
    contractFile: "account-type.contract.ts",
    constantExport: "ACCOUNT_TYPES",
    values: ACCOUNT_TYPES,
    traces: ACCOUNT_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "accounting",
    classificationId: "journal-document-type",
    contractFile: "journal-document-type.contract.ts",
    constantExport: "JOURNAL_DOCUMENT_TYPES",
    values: JOURNAL_DOCUMENT_TYPES,
    traces: JOURNAL_DOCUMENT_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "assets",
    classificationId: "transfer-type",
    contractFile: "transfer-type.contract.ts",
    constantExport: "TRANSFER_TYPES",
    values: TRANSFER_TYPES,
    traces: TRANSFER_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "controlling",
    classificationId: "controlling-document-type",
    contractFile: "controlling-document-type.contract.ts",
    constantExport: "CONTROLLING_DOCUMENT_TYPES",
    values: CONTROLLING_DOCUMENT_TYPES,
    traces: CONTROLLING_DOCUMENT_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "consolidation",
    classificationId: "elimination-type",
    contractFile: "elimination-type.contract.ts",
    constantExport: "ELIMINATION_TYPES",
    values: ELIMINATION_TYPES,
    traces: ELIMINATION_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "crm",
    classificationId: "activity-type",
    contractFile: "activity-type.contract.ts",
    constantExport: "ACTIVITY_TYPES",
    values: ACTIVITY_TYPES,
    traces: ACTIVITY_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "ecommerce",
    classificationId: "channel-type",
    contractFile: "channel-type.contract.ts",
    constantExport: "CHANNEL_TYPES",
    values: CHANNEL_TYPES,
    traces: CHANNEL_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "hcm",
    classificationId: "employment-type",
    contractFile: "employment-type.contract.ts",
    constantExport: "EMPLOYMENT_TYPES",
    values: EMPLOYMENT_TYPES,
    traces: EMPLOYMENT_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "intercompany",
    classificationId: "ic-transaction-type",
    contractFile: "ic-transaction-type.contract.ts",
    constantExport: "IC_TRANSACTION_TYPES",
    values: IC_TRANSACTION_TYPES,
    traces: IC_TRANSACTION_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "inventory",
    classificationId: "stock-movement-type",
    contractFile: "stock-movement-type.contract.ts",
    constantExport: "STOCK_MOVEMENT_TYPES",
    values: STOCK_MOVEMENT_TYPES,
    traces: STOCK_MOVEMENT_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "manufacturing",
    classificationId: "manufacturing-order-type",
    contractFile: "manufacturing-order-type.contract.ts",
    constantExport: "MANUFACTURING_ORDER_TYPES",
    values: MANUFACTURING_ORDER_TYPES,
    traces: MANUFACTURING_ORDER_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "manufacturing",
    classificationId: "shop-floor-event-type",
    contractFile: "shop-floor-event-type.contract.ts",
    constantExport: "SHOP_FLOOR_EVENT_TYPES",
    values: SHOP_FLOOR_EVENT_TYPES,
    traces: SHOP_FLOOR_EVENT_TYPE_PAS004_LABEL_TRACES,
    wireShapeRole: "event",
  }),
  withWireShapeRole({
    moduleSlug: "maintenance",
    classificationId: "maintenance-order-type",
    contractFile: "maintenance-order-type.contract.ts",
    constantExport: "MAINTENANCE_ORDER_TYPES",
    values: MAINTENANCE_ORDER_TYPES,
    traces: MAINTENANCE_ORDER_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "marketing",
    classificationId: "segment-type",
    contractFile: "segment-type.contract.ts",
    constantExport: "SEGMENT_TYPES",
    values: SEGMENT_TYPES,
    traces: SEGMENT_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "payroll",
    classificationId: "deduction-type",
    contractFile: "deduction-type.contract.ts",
    constantExport: "DEDUCTION_TYPES",
    values: DEDUCTION_TYPES,
    traces: DEDUCTION_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "payroll",
    classificationId: "earnings-type",
    contractFile: "earnings-type.contract.ts",
    constantExport: "EARNINGS_TYPES",
    values: EARNINGS_TYPES,
    traces: EARNINGS_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "pos",
    classificationId: "tender-type",
    contractFile: "tender-type.contract.ts",
    constantExport: "TENDER_TYPES",
    values: TENDER_TYPES,
    traces: TENDER_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "pos",
    classificationId: "transaction-type",
    contractFile: "transaction-type.contract.ts",
    constantExport: "TRANSACTION_TYPES",
    values: TRANSACTION_TYPES,
    traces: TRANSACTION_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "pricing",
    classificationId: "discount-type",
    contractFile: "discount-type.contract.ts",
    constantExport: "DISCOUNT_TYPES",
    values: DISCOUNT_TYPES,
    traces: DISCOUNT_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "procurement",
    classificationId: "procurement-document-type",
    contractFile: "procurement-document-type.contract.ts",
    constantExport: "PROCUREMENT_DOCUMENT_TYPES",
    values: PROCUREMENT_DOCUMENT_TYPES,
    traces: PROCUREMENT_DOCUMENT_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "quality",
    classificationId: "inspection-type",
    contractFile: "inspection-type.contract.ts",
    constantExport: "INSPECTION_TYPES",
    values: INSPECTION_TYPES,
    traces: INSPECTION_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "sales",
    classificationId: "sales-document-type",
    contractFile: "sales-document-type.contract.ts",
    constantExport: "SALES_DOCUMENT_TYPES",
    values: SALES_DOCUMENT_TYPES,
    traces: SALES_DOCUMENT_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "service",
    classificationId: "resolution-type",
    contractFile: "resolution-type.contract.ts",
    constantExport: "RESOLUTION_TYPES",
    values: RESOLUTION_TYPES,
    traces: RESOLUTION_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "subscription",
    classificationId: "subscription-event-type",
    contractFile: "subscription-event-type.contract.ts",
    constantExport: "SUBSCRIPTION_EVENT_TYPES",
    values: SUBSCRIPTION_EVENT_TYPES,
    traces: SUBSCRIPTION_EVENT_TYPE_PAS004_LABEL_TRACES,
    wireShapeRole: "event",
  }),
  withWireShapeRole({
    moduleSlug: "supply-chain",
    classificationId: "fulfillment-event-type",
    contractFile: "fulfillment-event-type.contract.ts",
    constantExport: "FULFILLMENT_EVENT_TYPES",
    values: FULFILLMENT_EVENT_TYPES,
    traces: FULFILLMENT_EVENT_TYPE_PAS004_LABEL_TRACES,
    wireShapeRole: "event",
  }),
  withWireShapeRole({
    moduleSlug: "tax",
    classificationId: "withholding-type",
    contractFile: "withholding-type.contract.ts",
    constantExport: "WITHHOLDING_TYPES",
    values: WITHHOLDING_TYPES,
    traces: WITHHOLDING_TYPE_PAS004_LABEL_TRACES,
  }),
  withWireShapeRole({
    moduleSlug: "treasury",
    classificationId: "treasury-instrument-type",
    contractFile: "treasury-instrument-type.contract.ts",
    constantExport: "TREASURY_INSTRUMENT_TYPES",
    values: TREASURY_INSTRUMENT_TYPES,
    traces: TREASURY_INSTRUMENT_TYPE_PAS004_LABEL_TRACES,
  }),
  ...WIRE_CONTESTED_VOCABULARY_PAS004_LABEL_TRACE_ENTRIES,
] as const satisfies readonly WireClassificationPas004LabelTraceEntry[];
