import { describe, expect, it } from "vitest";

import { ACCOUNTING_MODULE_KV_ID } from "../accounting/accounting-authority.contract.js";
import { ANALYTICS_MODULE_KV_ID } from "../analytics/analytics-authority.contract.js";
import { ASSETS_MODULE_KV_ID } from "../assets/assets-authority.contract.js";
import { CONSOLIDATION_MODULE_KV_ID } from "../consolidation/consolidation-authority.contract.js";
import { CONTROLLING_MODULE_KV_ID } from "../controlling/controlling-authority.contract.js";
import { CRM_MODULE_KV_ID } from "../crm/crm-authority.contract.js";
import { DOCUMENT_MODULE_KV_ID } from "../document/document-authority.contract.js";
import { ECOMMERCE_MODULE_KV_ID } from "../ecommerce/ecommerce-authority.contract.js";
import {
  ERP_DOMAIN_MODULE_KV_IDS,
  ERP_DOMAIN_MODULES,
  ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT,
} from "../erp-domain-layout.contract.js";
import { FIELD_SERVICE_MODULE_KV_ID } from "../field-service/field-service-authority.contract.js";
import { HCM_MODULE_KV_ID } from "../hcm/hcm-authority.contract.js";
import { INTERCOMPANY_MODULE_KV_ID } from "../intercompany/intercompany-authority.contract.js";
import { INVENTORY_MODULE_KV_ID } from "../inventory/inventory-authority.contract.js";
import { MAINTENANCE_MODULE_KV_ID } from "../maintenance/maintenance-authority.contract.js";
import { MANUFACTURING_MODULE_KV_ID } from "../manufacturing/manufacturing-authority.contract.js";
import { MARKETING_MODULE_KV_ID } from "../marketing/marketing-authority.contract.js";
import { PAYROLL_MODULE_KV_ID } from "../payroll/payroll-authority.contract.js";
import { POS_MODULE_KV_ID } from "../pos/pos-authority.contract.js";
import { PRICING_MODULE_KV_ID } from "../pricing/pricing-authority.contract.js";
import { PROCUREMENT_MODULE_KV_ID } from "../procurement/procurement-authority.contract.js";
import { PROJECT_MODULE_KV_ID } from "../project/project-authority.contract.js";
import { QUALITY_MODULE_KV_ID } from "../quality/quality-authority.contract.js";
import { SALES_MODULE_KV_ID } from "../sales/sales-authority.contract.js";
import { SERVICE_MODULE_KV_ID } from "../service/service-authority.contract.js";
import { SUBSCRIPTION_MODULE_KV_ID } from "../subscription/subscription-authority.contract.js";
import { SUPPLY_CHAIN_MODULE_KV_ID } from "../supply-chain/supply-chain-authority.contract.js";
import { TAX_MODULE_KV_ID } from "../tax/tax-authority.contract.js";
import { TREASURY_MODULE_KV_ID } from "../treasury/treasury-authority.contract.js";
import { WORKFLOW_MODULE_KV_ID } from "../workflow/workflow-authority.contract.js";

const AUTHORITY_MODULE_KV_IDS = {
  accounting: ACCOUNTING_MODULE_KV_ID,
  controlling: CONTROLLING_MODULE_KV_ID,
  treasury: TREASURY_MODULE_KV_ID,
  tax: TAX_MODULE_KV_ID,
  consolidation: CONSOLIDATION_MODULE_KV_ID,
  intercompany: INTERCOMPANY_MODULE_KV_ID,
  procurement: PROCUREMENT_MODULE_KV_ID,
  inventory: INVENTORY_MODULE_KV_ID,
  manufacturing: MANUFACTURING_MODULE_KV_ID,
  quality: QUALITY_MODULE_KV_ID,
  maintenance: MAINTENANCE_MODULE_KV_ID,
  "supply-chain": SUPPLY_CHAIN_MODULE_KV_ID,
  sales: SALES_MODULE_KV_ID,
  crm: CRM_MODULE_KV_ID,
  pricing: PRICING_MODULE_KV_ID,
  subscription: SUBSCRIPTION_MODULE_KV_ID,
  ecommerce: ECOMMERCE_MODULE_KV_ID,
  pos: POS_MODULE_KV_ID,
  service: SERVICE_MODULE_KV_ID,
  "field-service": FIELD_SERVICE_MODULE_KV_ID,
  marketing: MARKETING_MODULE_KV_ID,
  hcm: HCM_MODULE_KV_ID,
  payroll: PAYROLL_MODULE_KV_ID,
  project: PROJECT_MODULE_KV_ID,
  assets: ASSETS_MODULE_KV_ID,
  document: DOCUMENT_MODULE_KV_ID,
  workflow: WORKFLOW_MODULE_KV_ID,
  analytics: ANALYTICS_MODULE_KV_ID,
} as const;

describe("PAS-001B-KV1 erp-domain authority MODULE_KV_ID constants", () => {
  it("exports 28 authority constants aligned with ERP_DOMAIN_MODULE_KV_IDS", () => {
    expect(ERP_DOMAIN_MODULES).toHaveLength(
      ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT
    );
    expect(Object.keys(AUTHORITY_MODULE_KV_IDS)).toHaveLength(
      ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT
    );

    for (const slug of ERP_DOMAIN_MODULES) {
      expect(AUTHORITY_MODULE_KV_IDS[slug]).toBe(
        ERP_DOMAIN_MODULE_KV_IDS[slug]
      );
    }
  });

  it("uses unique KV-* ids across all authority contracts", () => {
    const kvValues = Object.values(AUTHORITY_MODULE_KV_IDS);
    expect(new Set(kvValues).size).toBe(kvValues.length);
  });
});
