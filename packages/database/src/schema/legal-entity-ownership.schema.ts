/**
 * Legal entity ownership interest (TIP-008 foundation).
 *
 * Writes: `../ownership-interest/ownership-interest.service.ts`
 */
import {
  boolean,
  date,
  index,
  numeric,
  pgTable,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  companyStatusEnum,
  consolidationMethodEnum,
  ownershipControlTypeEnum,
  ownershipRelationshipTypeEnum,
} from "../database.types.js";
import {
  childLegalEntityIdRef,
  enterpriseIdColumn,
  enterpriseIdFormatCheck,
  entityGroupIdRef,
  parentLegalEntityIdRef,
  primaryId,
  tenantIdRef,
} from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { entityGroups } from "./entity-group.schema.js";
import { tenants } from "./tenant.schema.js";

export const legalEntityOwnership = pgTable(
  "legal_entity_ownership",
  {
    id: primaryId(),
    enterpriseId: enterpriseIdColumn("ownershipInterest"),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    entityGroupId: entityGroupIdRef()
      .notNull()
      .references(() => entityGroups.id, { onDelete: "restrict" }),
    parentLegalEntityId: parentLegalEntityIdRef()
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    childLegalEntityId: childLegalEntityIdRef()
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    ownershipPercentage: numeric("ownership_percentage", {
      precision: 5,
      scale: 2,
    }).notNull(),
    votingPercentage: numeric("voting_percentage", {
      precision: 5,
      scale: 2,
    }).notNull(),
    controlType: ownershipControlTypeEnum("control_type").notNull(),
    relationshipType:
      ownershipRelationshipTypeEnum("relationship_type").notNull(),
    consolidationMethod: consolidationMethodEnum(
      "consolidation_method"
    ).notNull(),
    nonControllingInterestApplicable: boolean(
      "non_controlling_interest_applicable"
    )
      .notNull()
      .default(false),
    effectiveFrom: date("effective_from").notNull(),
    effectiveTo: date("effective_to"),
    status: companyStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("legal_entity_ownership_enterprise_id_unique").on(
      table.enterpriseId
    ),
    enterpriseIdFormatCheck(table.enterpriseId, "ownershipInterest"),
    uniqueIndex("legal_entity_ownership_parent_child_effective_unique").on(
      table.parentLegalEntityId,
      table.childLegalEntityId,
      table.effectiveFrom
    ),
    index("legal_entity_ownership_tenant_id_idx").on(table.tenantId),
    index("legal_entity_ownership_entity_group_id_idx").on(table.entityGroupId),
    index("legal_entity_ownership_parent_legal_entity_id_idx").on(
      table.parentLegalEntityId
    ),
    index("legal_entity_ownership_child_legal_entity_id_idx").on(
      table.childLegalEntityId
    ),
  ]
);
