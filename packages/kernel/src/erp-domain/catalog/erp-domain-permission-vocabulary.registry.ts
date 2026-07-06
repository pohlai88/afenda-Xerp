/**
 * PAS-001B catalog — cross-domain permission key vocabulary index.
 * Kernel owns wire keys; @afenda/permissions owns registration/evaluation.
 */

import { ACCOUNTING_PERMISSION_KEY_VOCABULARY } from "../accounting/accounting-permission-vocabulary.contract.js";
import { ANALYTICS_PERMISSION_KEY_VOCABULARY } from "../analytics/analytics-permission-vocabulary.contract.js";
import { ASSETS_PERMISSION_KEY_VOCABULARY } from "../assets/assets-permission-vocabulary.contract.js";
import { CONSOLIDATION_PERMISSION_KEY_VOCABULARY } from "../consolidation/consolidation-permission-vocabulary.contract.js";
import { CONTROLLING_PERMISSION_KEY_VOCABULARY } from "../controlling/controlling-permission-vocabulary.contract.js";
import { CRM_PERMISSION_KEY_VOCABULARY } from "../crm/crm-permission-vocabulary.contract.js";
import { DOCUMENT_PERMISSION_KEY_VOCABULARY } from "../document/document-permission-vocabulary.contract.js";
import { ECOMMERCE_PERMISSION_KEY_VOCABULARY } from "../ecommerce/ecommerce-permission-vocabulary.contract.js";
import type {
  ERP_DOMAIN_MODULES,
  ErpDomainModule,
} from "../erp-domain-layout.contract.js";
import { FIELD_SERVICE_PERMISSION_KEY_VOCABULARY } from "../field-service/field-service-permission-vocabulary.contract.js";
import { HCM_PERMISSION_KEY_VOCABULARY } from "../hcm/hcm-permission-vocabulary.contract.js";
import { INTERCOMPANY_PERMISSION_KEY_VOCABULARY } from "../intercompany/intercompany-permission-vocabulary.contract.js";
import { INVENTORY_PERMISSION_KEY_VOCABULARY } from "../inventory/inventory-permission-vocabulary.contract.js";
import { MAINTENANCE_PERMISSION_KEY_VOCABULARY } from "../maintenance/maintenance-permission-vocabulary.contract.js";
import { MANUFACTURING_PERMISSION_KEY_VOCABULARY } from "../manufacturing/manufacturing-permission-vocabulary.contract.js";
import { MARKETING_PERMISSION_KEY_VOCABULARY } from "../marketing/marketing-permission-vocabulary.contract.js";
import { PAYROLL_PERMISSION_KEY_VOCABULARY } from "../payroll/payroll-permission-vocabulary.contract.js";
import { POS_PERMISSION_KEY_VOCABULARY } from "../pos/pos-permission-vocabulary.contract.js";
import { PRICING_PERMISSION_KEY_VOCABULARY } from "../pricing/pricing-permission-vocabulary.contract.js";
import { PROCUREMENT_PERMISSION_KEY_VOCABULARY } from "../procurement/procurement-permission-vocabulary.contract.js";
import { PROJECT_PERMISSION_KEY_VOCABULARY } from "../project/project-permission-vocabulary.contract.js";
import { QUALITY_PERMISSION_KEY_VOCABULARY } from "../quality/quality-permission-vocabulary.contract.js";
import { SALES_PERMISSION_KEY_VOCABULARY } from "../sales/sales-permission-vocabulary.contract.js";
import { SERVICE_PERMISSION_KEY_VOCABULARY } from "../service/service-permission-vocabulary.contract.js";
import { SUBSCRIPTION_PERMISSION_KEY_VOCABULARY } from "../subscription/subscription-permission-vocabulary.contract.js";
import { SUPPLY_CHAIN_PERMISSION_KEY_VOCABULARY } from "../supply-chain/supply-chain-permission-vocabulary.contract.js";
import { TAX_PERMISSION_KEY_VOCABULARY } from "../tax/tax-permission-vocabulary.contract.js";
import { TREASURY_PERMISSION_KEY_VOCABULARY } from "../treasury/treasury-permission-vocabulary.contract.js";
import { WORKFLOW_PERMISSION_KEY_VOCABULARY } from "../workflow/workflow-permission-vocabulary.contract.js";

export const ERP_DOMAIN_PERMISSION_KEY_VOCABULARIES = {
  accounting: ACCOUNTING_PERMISSION_KEY_VOCABULARY,
  analytics: ANALYTICS_PERMISSION_KEY_VOCABULARY,
  assets: ASSETS_PERMISSION_KEY_VOCABULARY,
  consolidation: CONSOLIDATION_PERMISSION_KEY_VOCABULARY,
  controlling: CONTROLLING_PERMISSION_KEY_VOCABULARY,
  crm: CRM_PERMISSION_KEY_VOCABULARY,
  document: DOCUMENT_PERMISSION_KEY_VOCABULARY,
  ecommerce: ECOMMERCE_PERMISSION_KEY_VOCABULARY,
  "field-service": FIELD_SERVICE_PERMISSION_KEY_VOCABULARY,
  hcm: HCM_PERMISSION_KEY_VOCABULARY,
  intercompany: INTERCOMPANY_PERMISSION_KEY_VOCABULARY,
  inventory: INVENTORY_PERMISSION_KEY_VOCABULARY,
  maintenance: MAINTENANCE_PERMISSION_KEY_VOCABULARY,
  manufacturing: MANUFACTURING_PERMISSION_KEY_VOCABULARY,
  marketing: MARKETING_PERMISSION_KEY_VOCABULARY,
  payroll: PAYROLL_PERMISSION_KEY_VOCABULARY,
  pos: POS_PERMISSION_KEY_VOCABULARY,
  pricing: PRICING_PERMISSION_KEY_VOCABULARY,
  procurement: PROCUREMENT_PERMISSION_KEY_VOCABULARY,
  project: PROJECT_PERMISSION_KEY_VOCABULARY,
  quality: QUALITY_PERMISSION_KEY_VOCABULARY,
  sales: SALES_PERMISSION_KEY_VOCABULARY,
  service: SERVICE_PERMISSION_KEY_VOCABULARY,
  subscription: SUBSCRIPTION_PERMISSION_KEY_VOCABULARY,
  "supply-chain": SUPPLY_CHAIN_PERMISSION_KEY_VOCABULARY,
  tax: TAX_PERMISSION_KEY_VOCABULARY,
  treasury: TREASURY_PERMISSION_KEY_VOCABULARY,
  workflow: WORKFLOW_PERMISSION_KEY_VOCABULARY,
} as const satisfies Record<ErpDomainModule, readonly string[]>;

type _AssertPermissionCatalogModuleParity = {
  [K in ErpDomainModule]: K extends (typeof ERP_DOMAIN_MODULES)[number]
    ? true
    : never;
}[ErpDomainModule];

export type assertErpDomainPermissionKeyVocabularyCatalogParity =
  _AssertPermissionCatalogModuleParity extends true ? true : never;
