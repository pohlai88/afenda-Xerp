/**
 * PAS-001B catalog layout — machine registry for ERP wire vocabulary map.
 * Public surface: `@afenda/kernel/erp-domain/catalog`
 */

export {
  ERP_DOMAIN_DELIVERED_MODULES,
  ERP_DOMAIN_EXTERNAL_RUNTIME_REFERENCES,
  ERP_DOMAIN_LAYOUT_POLICY,
  ERP_DOMAIN_LOB_PILLARS,
  ERP_DOMAIN_MODULE_INDEX_PATHS,
  ERP_DOMAIN_MODULE_KV_IDS,
  ERP_DOMAIN_MODULE_MATURITY,
  ERP_DOMAIN_MODULE_MATURITY_VALUES,
  ERP_DOMAIN_MODULE_METADATA,
  ERP_DOMAIN_MODULE_SCOPE_DEFINITIONS,
  ERP_DOMAIN_MODULES,
  ERP_DOMAIN_PAS_001B_ID,
  ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT,
  ERP_DOMAIN_PAS_SECTION,
  type ErpDomainLobPillar,
  type ErpDomainModule,
  type ErpDomainModuleKvId,
  type ErpDomainModuleMaturity,
  type ErpDomainModuleMetadata,
} from "../erp-domain-layout.contract.js";
export {
  type assertErpDomainPermissionKeyVocabularyCatalogParity,
  ERP_DOMAIN_PERMISSION_KEY_VOCABULARIES,
} from "./erp-domain-permission-vocabulary.registry.js";
