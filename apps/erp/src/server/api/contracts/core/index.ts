/**
 * PAS-API-001 family contract barrel (API-001–API-016).
 * Import from `@/server/api/contracts/core` or `@/server/api/contracts/api-contract`.
 */

export {
  type ApiAuditReplayMinimumRecord,
  type ApiCorrelationId,
  type ApiCorrelationIdentity,
  type ApiCorrelationPolicy,
  type ApiRequestId,
  assertRegistryCorrelationPolicy,
  buildAuditReplayMinimumRecord,
  parseApiCorrelationId,
  parseApiCorrelationIdentity,
  parseApiRequestId,
  resolveCorrelationPolicy,
  unbrandApiCorrelationId,
  unbrandApiRequestId,
} from "./api-audit-replay.contract";
export {
  API_CONSUMER_IMPACT_CLASSES,
  type ApiConsumerImpactClass,
  type ApiConsumerImpactDeclaration,
  type ApiOperationConsumerImpactDeclaration,
  assertRegistryConsumerImpactPolicy,
  buildOperationConsumerImpactRegistry,
  resolveConsumerImpactDeclaration,
} from "./api-consumer-impact.contract";
export {
  API_GOVERNANCE_EXCEPTION_DEFERRAL_KINDS,
  API_GOVERNANCE_EXCEPTION_REGISTRY,
  type ApiGovernanceExceptionDeferralKind,
  type ApiGovernanceExceptionRecord,
  assertGovernanceExceptionRecordShape,
  assertNoExpiredGovernanceExceptions,
  collectGovernanceExceptionViolations,
  defineGovernanceException,
  isGovernanceExceptionExpired,
} from "./api-exception.contract";
export {
  type ApiBreakingChangeClass,
  type ApiFamilyLifecycleStatus,
  type ApiLifecycleMigrationMetadata,
  type ApiOperationLifecycleDeclaration,
  assertLifecycleMigrationRule,
  assertRegistryLifecyclePolicy,
  buildOperationLifecycleRegistry,
  extractOperationLifecycleDeclaration,
  mapRouteLifecycleToFamily,
  resolveBreakingChangeClass,
} from "./api-lifecycle.contract";
export {
  type ApiOperationId,
  assertUniqueApiOperationIds,
  type Brand,
  isValidApiOperationIdFormat,
  parseApiOperationId,
  unbrandApiOperationId,
} from "./api-operation-id.contract";
export {
  type ApiOperationOwnershipMetadata,
  type ApiOperationOwnershipOverride,
  assertActiveOperationOwnership,
  buildOperationOwnershipRegistry,
  resolveOperationOwnership,
} from "./api-ownership.contract";
export {
  type ApiActorPolicy,
  type ApiOperatingContextPolicyDeclaration,
  type ApiOperationPolicyDeclaration,
  type ApiPermissionDeclaration,
  assertRegistryOperationPolicyDeclarations,
  buildOperationPolicyDeclarationRegistry,
  extractOperationPolicyDeclaration,
  isHumanSessionActor,
  isServiceActor,
  resolveActorPolicy,
  resolveOperatingContextPolicyDeclaration,
  resolvePermissionDeclaration,
} from "./api-policy.contract";
export {
  type ApiOperationRegistryEntry,
  buildApiOperationRegistry,
  findRegistryEntryByOperationId,
  getRegistryOperationIds,
} from "./api-registry.contract";
export {
  API_STYLE_BINDINGS,
  type ApiStyleBinding,
  type ApiStyleKind,
  getActiveStyleBindings,
} from "./api-style.contract";
export {
  type ApiEgressValidationPolicy,
  type ApiIngressValidationPolicy,
  type ApiOperationExposureClass,
  type ApiOperationInteractionClass,
  type ApiOperationSchemaAuthority,
  type ApiSchemaAuthority,
  type ApiSchemaAuthorityRef,
  type ApiSchemaKind,
  type ApiValidationDirectionPolicy,
  assertRegistrySchemaAuthority,
  assertRegistryValidationDirection,
  buildOperationSchemaAuthorityRegistry,
  buildOperationValidationDirectionRegistry,
  classifyOperationExposure,
  classifyOperationInteraction,
  extractOperationSchemaAuthority,
  extractOperationValidationDirection,
  isValidSchemaAuthorityRefFormat,
  parseApiSchemaAuthorityRef,
  resolveValidationDirectionPolicy,
  unbrandApiSchemaAuthorityRef,
} from "./api-validation.contract";
