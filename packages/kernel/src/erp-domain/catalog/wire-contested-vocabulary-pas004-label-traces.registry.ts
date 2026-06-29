/**
 * PAS-001B §3.1 — contested closed vocabulary beyond *-type contracts.
 * Meaning defers to PAS-004 via atom id pointers (no @afenda/enterprise-knowledge import).
 */

import { CONSOLIDATION_METHODS } from "../accounting/consolidation-method.contract.js";
import { FISCAL_PERIOD_STATES } from "../accounting/fiscal-period-state.contract.js";
import { DEPRECIATION_METHODS } from "../assets/depreciation-method.contract.js";
import { REPORTING_CURRENCY_METHODS } from "../consolidation/reporting-currency-method.contract.js";
import { ALLOCATION_METHODS } from "../controlling/allocation-method.contract.js";
import { DISPATCH_PRIORITIES } from "../field-service/dispatch-priority.contract.js";
import { IC_SETTLEMENT_METHODS } from "../intercompany/ic-settlement-method.contract.js";
import { VALUATION_METHODS } from "../inventory/valuation-method.contract.js";
import { MAINTENANCE_PRIORITIES } from "../maintenance/maintenance-priority.contract.js";
import { CAPACITY_PLANNING_METHODS } from "../manufacturing/capacity-planning-method.contract.js";
import { PRICING_METHODS } from "../pricing/pricing-method.contract.js";
import { SOURCING_METHODS } from "../procurement/sourcing-method.contract.js";
import { BILLING_METHODS } from "../project/billing-method.contract.js";
import { QUALITY_NOTIFICATION_PRIORITIES } from "../quality/quality-notification-priority.contract.js";
import { PRICING_CONTEXTS } from "../sales/pricing-context.contract.js";
import { CASE_PRIORITIES } from "../service/case-priority.contract.js";
import { BILLING_CYCLES } from "../subscription/billing-cycle.contract.js";
import { RENEWAL_INTENTS } from "../subscription/renewal-intent.contract.js";
import { DELIVERY_PRIORITIES } from "../supply-chain/delivery-priority.contract.js";
import { TAX_CALCULATION_METHODS } from "../tax/tax-calculation-method.contract.js";
import { HEDGE_ACCOUNTING_METHODS } from "../treasury/hedge-accounting-method.contract.js";
import { TASK_PRIORITIES } from "../workflow/task-priority.contract.js";
import {
  buildPas004LabelTraces,
  type ErpDomainWireShapeRole,
  type WireClassificationPas004LabelTraceEntry,
} from "./pas004-label-trace.contract.js";

export const CONSOLIDATION_METHOD_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "accounting",
  "consolidation-method",
  CONSOLIDATION_METHODS
);

export const FISCAL_PERIOD_STATE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "accounting",
  "fiscal-period-state",
  FISCAL_PERIOD_STATES
);

export const DEPRECIATION_METHOD_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "assets",
  "depreciation-method",
  DEPRECIATION_METHODS
);

export const ALLOCATION_METHOD_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "controlling",
  "allocation-method",
  ALLOCATION_METHODS
);

export const REPORTING_CURRENCY_METHOD_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "consolidation",
    "reporting-currency-method",
    REPORTING_CURRENCY_METHODS
  );

export const DISPATCH_PRIORITY_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "field-service",
  "dispatch-priority",
  DISPATCH_PRIORITIES
);

export const IC_SETTLEMENT_METHOD_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "intercompany",
  "ic-settlement-method",
  IC_SETTLEMENT_METHODS
);

export const VALUATION_METHOD_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "inventory",
  "valuation-method",
  VALUATION_METHODS
);

export const MAINTENANCE_PRIORITY_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "maintenance",
  "maintenance-priority",
  MAINTENANCE_PRIORITIES
);

export const CAPACITY_PLANNING_METHOD_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "manufacturing",
    "capacity-planning-method",
    CAPACITY_PLANNING_METHODS
  );

export const PRICING_METHOD_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "pricing",
  "pricing-method",
  PRICING_METHODS
);

export const SOURCING_METHOD_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "procurement",
  "sourcing-method",
  SOURCING_METHODS
);

export const QUALITY_NOTIFICATION_PRIORITY_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "quality",
    "quality-notification-priority",
    QUALITY_NOTIFICATION_PRIORITIES
  );

export const BILLING_METHOD_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "project",
  "billing-method",
  BILLING_METHODS
);

export const PRICING_CONTEXT_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "sales",
  "pricing-context",
  PRICING_CONTEXTS
);

export const CASE_PRIORITY_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "service",
  "case-priority",
  CASE_PRIORITIES
);

export const BILLING_CYCLE_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "subscription",
  "billing-cycle",
  BILLING_CYCLES
);

export const RENEWAL_INTENT_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "subscription",
  "renewal-intent",
  RENEWAL_INTENTS
);

export const DELIVERY_PRIORITY_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "supply-chain",
  "delivery-priority",
  DELIVERY_PRIORITIES
);

export const TAX_CALCULATION_METHOD_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "tax",
    "tax-calculation-method",
    TAX_CALCULATION_METHODS
  );

export const HEDGE_ACCOUNTING_METHOD_PAS004_LABEL_TRACES =
  buildPas004LabelTraces(
    "treasury",
    "hedge-accounting-method",
    HEDGE_ACCOUNTING_METHODS
  );

export const TASK_PRIORITY_PAS004_LABEL_TRACES = buildPas004LabelTraces(
  "workflow",
  "task-priority",
  TASK_PRIORITIES
);

const classificationRole =
  "classification" as const satisfies ErpDomainWireShapeRole;

export const WIRE_CONTESTED_VOCABULARY_PAS004_LABEL_TRACE_ENTRIES = [
  {
    moduleSlug: "accounting",
    classificationId: "consolidation-method",
    contractFile: "consolidation-method.contract.ts",
    constantExport: "CONSOLIDATION_METHODS",
    values: CONSOLIDATION_METHODS,
    traces: CONSOLIDATION_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "accounting",
    classificationId: "fiscal-period-state",
    contractFile: "fiscal-period-state.contract.ts",
    constantExport: "FISCAL_PERIOD_STATES",
    values: FISCAL_PERIOD_STATES,
    traces: FISCAL_PERIOD_STATE_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "assets",
    classificationId: "depreciation-method",
    contractFile: "depreciation-method.contract.ts",
    constantExport: "DEPRECIATION_METHODS",
    values: DEPRECIATION_METHODS,
    traces: DEPRECIATION_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "controlling",
    classificationId: "allocation-method",
    contractFile: "allocation-method.contract.ts",
    constantExport: "ALLOCATION_METHODS",
    values: ALLOCATION_METHODS,
    traces: ALLOCATION_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "consolidation",
    classificationId: "reporting-currency-method",
    contractFile: "reporting-currency-method.contract.ts",
    constantExport: "REPORTING_CURRENCY_METHODS",
    values: REPORTING_CURRENCY_METHODS,
    traces: REPORTING_CURRENCY_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "field-service",
    classificationId: "dispatch-priority",
    contractFile: "dispatch-priority.contract.ts",
    constantExport: "DISPATCH_PRIORITIES",
    values: DISPATCH_PRIORITIES,
    traces: DISPATCH_PRIORITY_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "intercompany",
    classificationId: "ic-settlement-method",
    contractFile: "ic-settlement-method.contract.ts",
    constantExport: "IC_SETTLEMENT_METHODS",
    values: IC_SETTLEMENT_METHODS,
    traces: IC_SETTLEMENT_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "inventory",
    classificationId: "valuation-method",
    contractFile: "valuation-method.contract.ts",
    constantExport: "VALUATION_METHODS",
    values: VALUATION_METHODS,
    traces: VALUATION_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "maintenance",
    classificationId: "maintenance-priority",
    contractFile: "maintenance-priority.contract.ts",
    constantExport: "MAINTENANCE_PRIORITIES",
    values: MAINTENANCE_PRIORITIES,
    traces: MAINTENANCE_PRIORITY_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "manufacturing",
    classificationId: "capacity-planning-method",
    contractFile: "capacity-planning-method.contract.ts",
    constantExport: "CAPACITY_PLANNING_METHODS",
    values: CAPACITY_PLANNING_METHODS,
    traces: CAPACITY_PLANNING_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "pricing",
    classificationId: "pricing-method",
    contractFile: "pricing-method.contract.ts",
    constantExport: "PRICING_METHODS",
    values: PRICING_METHODS,
    traces: PRICING_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "procurement",
    classificationId: "sourcing-method",
    contractFile: "sourcing-method.contract.ts",
    constantExport: "SOURCING_METHODS",
    values: SOURCING_METHODS,
    traces: SOURCING_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "quality",
    classificationId: "quality-notification-priority",
    contractFile: "quality-notification-priority.contract.ts",
    constantExport: "QUALITY_NOTIFICATION_PRIORITIES",
    values: QUALITY_NOTIFICATION_PRIORITIES,
    traces: QUALITY_NOTIFICATION_PRIORITY_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "project",
    classificationId: "billing-method",
    contractFile: "billing-method.contract.ts",
    constantExport: "BILLING_METHODS",
    values: BILLING_METHODS,
    traces: BILLING_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "sales",
    classificationId: "pricing-context",
    contractFile: "pricing-context.contract.ts",
    constantExport: "PRICING_CONTEXTS",
    values: PRICING_CONTEXTS,
    traces: PRICING_CONTEXT_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "service",
    classificationId: "case-priority",
    contractFile: "case-priority.contract.ts",
    constantExport: "CASE_PRIORITIES",
    values: CASE_PRIORITIES,
    traces: CASE_PRIORITY_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "subscription",
    classificationId: "billing-cycle",
    contractFile: "billing-cycle.contract.ts",
    constantExport: "BILLING_CYCLES",
    values: BILLING_CYCLES,
    traces: BILLING_CYCLE_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "subscription",
    classificationId: "renewal-intent",
    contractFile: "renewal-intent.contract.ts",
    constantExport: "RENEWAL_INTENTS",
    values: RENEWAL_INTENTS,
    traces: RENEWAL_INTENT_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "supply-chain",
    classificationId: "delivery-priority",
    contractFile: "delivery-priority.contract.ts",
    constantExport: "DELIVERY_PRIORITIES",
    values: DELIVERY_PRIORITIES,
    traces: DELIVERY_PRIORITY_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "tax",
    classificationId: "tax-calculation-method",
    contractFile: "tax-calculation-method.contract.ts",
    constantExport: "TAX_CALCULATION_METHODS",
    values: TAX_CALCULATION_METHODS,
    traces: TAX_CALCULATION_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "treasury",
    classificationId: "hedge-accounting-method",
    contractFile: "hedge-accounting-method.contract.ts",
    constantExport: "HEDGE_ACCOUNTING_METHODS",
    values: HEDGE_ACCOUNTING_METHODS,
    traces: HEDGE_ACCOUNTING_METHOD_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
  {
    moduleSlug: "workflow",
    classificationId: "task-priority",
    contractFile: "task-priority.contract.ts",
    constantExport: "TASK_PRIORITIES",
    values: TASK_PRIORITIES,
    traces: TASK_PRIORITY_PAS004_LABEL_TRACES,
    wireShapeRole: classificationRole,
  },
] as const satisfies readonly WireClassificationPas004LabelTraceEntry[];
