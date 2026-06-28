/**
 * Ownership interest write governance — types and pure builders (no I/O).
 */
import type {
  CompanyStatus,
  ConsolidationMethod,
  OwnershipControlType,
  OwnershipRelationshipType,
} from "../database.types.js";
import {
  type ConsolidationTreatment,
  consolidationMethodToTreatment,
  consolidationTreatmentToMethod,
} from "./ownership-interest.consolidation-treatment.js";

export class OwnershipInterestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OwnershipInterestValidationError";
  }
}

export class OwnershipInterestCycleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OwnershipInterestCycleError";
  }
}

export interface OwnershipInterestWriteInput {
  readonly childLegalEntityId?: string;
  readonly consolidationTreatment: ConsolidationTreatment;
  readonly controlType: OwnershipControlType;
  readonly effectiveFrom: string;
  readonly effectiveTo?: string | null;
  readonly entityGroupId: string;
  readonly investeeLegalEntityId?: string;
  readonly nonControllingInterestApplicable?: boolean;
  readonly ownershipPercentage: number;
  readonly parentLegalEntityId: string;
  readonly relationshipType: OwnershipRelationshipType;
  readonly status?: CompanyStatus;
  readonly tenantId: string;
  readonly votingPercentage: number;
}

export interface OwnershipInterestInsertRow {
  childLegalEntityId: string;
  consolidationMethod: ConsolidationMethod;
  controlType: OwnershipControlType;
  effectiveFrom: string;
  effectiveTo: string | null;
  entityGroupId: string;
  nonControllingInterestApplicable: boolean;
  ownershipPercentage: string;
  parentLegalEntityId: string;
  relationshipType: OwnershipRelationshipType;
  status: CompanyStatus;
  tenantId: string;
  votingPercentage: string;
}

/** Lookup read model with uuid PKs for FK ops and enterprise IDs for kernel wire. */
export interface OwnershipInterestLookupRow {
  readonly childLegalEntityEnterpriseId: string;
  readonly childLegalEntityId: string;
  readonly consolidationTreatment: ConsolidationTreatment;
  readonly controlType: OwnershipControlType;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | null;
  readonly enterpriseId: string;
  readonly entityGroupEnterpriseId: string;
  readonly entityGroupId: string;
  readonly id: string;
  readonly nonControllingInterestApplicable: boolean;
  readonly ownershipPercentage: number;
  readonly parentLegalEntityEnterpriseId: string;
  readonly parentLegalEntityId: string;
  readonly status: CompanyStatus;
  readonly tenantEnterpriseId: string;
  readonly tenantId: string;
  readonly votingPercentage: number;
}

/** Authority read model aligned with multi-tenancy.md ownership interest fields. */
export interface OwnershipInterestAuthorityRecord {
  readonly childLegalEntityId: string;
  readonly consolidationTreatment: ConsolidationTreatment;
  readonly controlType: OwnershipControlType;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | null;
  readonly entityGroupId: string;
  /**
   * @deprecated Use `childLegalEntityId` — retained as a read alias with the same value.
   */
  readonly investeeLegalEntityId: string;
  readonly nonControllingInterestApplicable: boolean;
  readonly ownershipInterestId: string;
  readonly ownershipPercentage: number;
  readonly parentLegalEntityId: string;
  readonly status: CompanyStatus;
  readonly tenantId: string;
  readonly votingPercentage: number;
}

function assertPercentage(value: number, field: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new OwnershipInterestValidationError(
      `${field} must be a number between 0 and 100.`
    );
  }
}

function formatPercentage(value: number): string {
  return value.toFixed(2);
}

function parsePercentage(value: string): number {
  return Number.parseFloat(value);
}

function assertEffectiveDateRange(
  effectiveFrom: string,
  effectiveTo: string | null
): void {
  if (effectiveTo !== null && effectiveTo < effectiveFrom) {
    throw new OwnershipInterestValidationError(
      "effectiveTo must be on or after effectiveFrom."
    );
  }
}

export function resolveInvesteeLegalEntityId(
  input: Pick<
    OwnershipInterestWriteInput,
    "childLegalEntityId" | "investeeLegalEntityId"
  >
): string {
  const investeeLegalEntityId =
    input.investeeLegalEntityId ?? input.childLegalEntityId;

  if (
    investeeLegalEntityId === undefined ||
    investeeLegalEntityId.length === 0
  ) {
    throw new OwnershipInterestValidationError(
      "investeeLegalEntityId (or childLegalEntityId) is required."
    );
  }

  if (
    input.investeeLegalEntityId !== undefined &&
    input.childLegalEntityId !== undefined &&
    input.investeeLegalEntityId !== input.childLegalEntityId
  ) {
    throw new OwnershipInterestValidationError(
      "investeeLegalEntityId and childLegalEntityId must match when both are provided."
    );
  }

  return investeeLegalEntityId;
}

export function resolveNonControllingInterestApplicable(input: {
  readonly nonControllingInterestApplicable?: boolean;
  readonly ownershipPercentage: number;
  readonly relationshipType: OwnershipRelationshipType;
}): boolean {
  if (input.nonControllingInterestApplicable !== undefined) {
    return input.nonControllingInterestApplicable;
  }

  return (
    input.relationshipType === "non_controlling_interest" ||
    input.relationshipType === "minority_interest" ||
    input.ownershipPercentage < 100
  );
}

export function assertDistinctLegalEntities(
  parentLegalEntityId: string,
  investeeLegalEntityId: string
): void {
  if (parentLegalEntityId === investeeLegalEntityId) {
    throw new OwnershipInterestCycleError(
      "Parent and investee legal entities must be different."
    );
  }
}

export function buildOwnershipInterestInsertRow(
  input: OwnershipInterestWriteInput
): OwnershipInterestInsertRow {
  const investeeLegalEntityId = resolveInvesteeLegalEntityId(input);

  assertDistinctLegalEntities(input.parentLegalEntityId, investeeLegalEntityId);
  assertPercentage(input.ownershipPercentage, "ownershipPercentage");
  assertPercentage(input.votingPercentage, "votingPercentage");

  const effectiveTo = input.effectiveTo ?? null;
  assertEffectiveDateRange(input.effectiveFrom, effectiveTo);

  return {
    tenantId: input.tenantId,
    entityGroupId: input.entityGroupId,
    parentLegalEntityId: input.parentLegalEntityId,
    childLegalEntityId: investeeLegalEntityId,
    ownershipPercentage: formatPercentage(input.ownershipPercentage),
    votingPercentage: formatPercentage(input.votingPercentage),
    controlType: input.controlType,
    relationshipType: input.relationshipType,
    consolidationMethod: consolidationTreatmentToMethod(
      input.consolidationTreatment
    ),
    nonControllingInterestApplicable:
      resolveNonControllingInterestApplicable(input),
    effectiveFrom: input.effectiveFrom,
    effectiveTo,
    status: input.status ?? "active",
  };
}

export function toOwnershipInterestLookupRow(input: {
  readonly childLegalEntityEnterpriseId: string | null;
  readonly childLegalEntityId: string;
  readonly consolidationMethod: ConsolidationMethod;
  readonly controlType: OwnershipControlType;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | null;
  readonly enterpriseId: string | null;
  readonly entityGroupEnterpriseId: string | null;
  readonly entityGroupId: string;
  readonly id: string;
  readonly nonControllingInterestApplicable: boolean;
  readonly ownershipPercentage: string;
  readonly parentLegalEntityEnterpriseId: string | null;
  readonly parentLegalEntityId: string;
  readonly status: CompanyStatus;
  readonly tenantEnterpriseId: string | null;
  readonly tenantId: string;
  readonly votingPercentage: string;
}): OwnershipInterestLookupRow | null {
  if (
    input.enterpriseId === null ||
    input.tenantEnterpriseId === null ||
    input.entityGroupEnterpriseId === null ||
    input.parentLegalEntityEnterpriseId === null ||
    input.childLegalEntityEnterpriseId === null
  ) {
    return null;
  }

  return {
    id: input.id,
    enterpriseId: input.enterpriseId,
    tenantId: input.tenantId,
    tenantEnterpriseId: input.tenantEnterpriseId,
    entityGroupId: input.entityGroupId,
    entityGroupEnterpriseId: input.entityGroupEnterpriseId,
    parentLegalEntityId: input.parentLegalEntityId,
    parentLegalEntityEnterpriseId: input.parentLegalEntityEnterpriseId,
    childLegalEntityId: input.childLegalEntityId,
    childLegalEntityEnterpriseId: input.childLegalEntityEnterpriseId,
    ownershipPercentage: parsePercentage(input.ownershipPercentage),
    votingPercentage: parsePercentage(input.votingPercentage),
    controlType: input.controlType,
    consolidationTreatment: consolidationMethodToTreatment(
      input.consolidationMethod
    ),
    nonControllingInterestApplicable: input.nonControllingInterestApplicable,
    effectiveFrom: input.effectiveFrom,
    effectiveTo: input.effectiveTo,
    status: input.status,
  };
}

export function toOwnershipInterestAuthorityRecord(input: {
  readonly childLegalEntityId: string;
  readonly consolidationMethod: ConsolidationMethod;
  readonly controlType: OwnershipControlType;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | null;
  readonly entityGroupId: string;
  readonly id: string;
  readonly nonControllingInterestApplicable: boolean;
  readonly ownershipPercentage: string;
  readonly parentLegalEntityId: string;
  readonly status: CompanyStatus;
  readonly tenantId: string;
  readonly votingPercentage: string;
}): OwnershipInterestAuthorityRecord {
  return {
    ownershipInterestId: input.id,
    tenantId: input.tenantId,
    entityGroupId: input.entityGroupId,
    parentLegalEntityId: input.parentLegalEntityId,
    childLegalEntityId: input.childLegalEntityId,
    investeeLegalEntityId: input.childLegalEntityId,
    ownershipPercentage: parsePercentage(input.ownershipPercentage),
    votingPercentage: parsePercentage(input.votingPercentage),
    controlType: input.controlType,
    consolidationTreatment: consolidationMethodToTreatment(
      input.consolidationMethod
    ),
    nonControllingInterestApplicable: input.nonControllingInterestApplicable,
    effectiveFrom: input.effectiveFrom,
    effectiveTo: input.effectiveTo,
    status: input.status,
  };
}
