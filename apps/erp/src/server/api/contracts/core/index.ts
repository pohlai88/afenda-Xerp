/**
 * PAS-API-001 family contract barrel (API-001–API-016).
 * Import from `@/server/api/contracts/core` or `@/server/api/contracts/api-contract`.
 */

export {
  assertRegistryCorrelationPolicy,
  buildAuditReplayMinimumRecord,
  parseApiCorrelationId,
  parseApiCorrelationIdentity,
  parseApiRequestId,
  resolveCorrelationPolicy,
  unbrandApiCorrelationId,
  unbrandApiRequestId,
  type ApiAuditReplayMinimumRecord,
  type ApiCorrelationId,
  type ApiCorrelationIdentity,
  type ApiCorrelationPolicy,
  type ApiRequestId,
} from "./api-audit-replay.contract";
export {
  API_GOVERNANCE_EXCEPTION_DEFERRAL_KINDS,
  API_GOVERNANCE_EXCEPTION_REGISTRY,
  assertGovernanceExceptionRecordShape,
  assertNoExpiredGovernanceExceptions,
  collectGovernanceExceptionViolations,
  defineGovernanceException,
  isGovernanceExceptionExpired,
  type ApiGovernanceExceptionDeferralKind,
  type ApiGovernanceExceptionRecord,
} from "./api-exception.contract";
export {
  API_CONSUMER_IMPACT_CLASSES,
  assertRegistryConsumerImpactPolicy,
  buildOperationConsumerImpactRegistry,
  resolveConsumerImpactDeclaration,
  type ApiConsumerImpactClass,
  type ApiConsumerImpactDeclaration,
  type ApiOperationConsumerImpactDeclaration,
} from "./api-consumer-impact.contract";
export {
  assertLifecycleMigrationRule,
  assertRegistryLifecyclePolicy,
  buildOperationLifecycleRegistry,
  extractOperationLifecycleDeclaration,
  mapRouteLifecycleToFamily,
  resolveBreakingChangeClass,
  type ApiBreakingChangeClass,
  type ApiFamilyLifecycleStatus,
  type ApiLifecycleMigrationMetadata,
  type ApiOperationLifecycleDeclaration,
} from "./api-lifecycle.contract";
export {
  assertActiveOperationOwnership,
  buildOperationOwnershipRegistry,
  resolveOperationOwnership,
  type ApiOperationOwnershipMetadata,
  type ApiOperationOwnershipOverride,
} from "./api-ownership.contract";
export {
  assertRegistryOperationPolicyDeclarations,
  buildOperationPolicyDeclarationRegistry,
  extractOperationPolicyDeclaration,
  isHumanSessionActor,
  isServiceActor,
  resolveActorPolicy,
  resolveOperatingContextPolicyDeclaration,
  resolvePermissionDeclaration,
  type ApiActorPolicy,
  type ApiOperatingContextPolicyDeclaration,
  type ApiOperationPolicyDeclaration,
  type ApiPermissionDeclaration,
} from "./api-policy.contract";
export {
  assertUniqueApiOperationIds,
  isValidApiOperationIdFormat,
  parseApiOperationId,
  unbrandApiOperationId,
  type ApiOperationId,
  type Brand,
} from "./api-operation-id.contract";
export {
  buildApiOperationRegistry,
  findRegistryEntryByOperationId,
  getRegistryOperationIds,
  type ApiOperationRegistryEntry,
} from "./api-registry.contract";
export {
  API_STYLE_BINDINGS,
  getActiveStyleBindings,
  type ApiStyleBinding,
  type ApiStyleKind,
} from "./api-style.contract";
export {
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
  type ApiEgressValidationPolicy,
  type ApiIngressValidationPolicy,
  type ApiOperationExposureClass,
  type ApiOperationInteractionClass,
  type ApiOperationSchemaAuthority,
  type ApiSchemaAuthority,
  type ApiSchemaAuthorityRef,
  type ApiSchemaKind,
  type ApiValidationDirectionPolicy,
} from "./api-validation.contract";
