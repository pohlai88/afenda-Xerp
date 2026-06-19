import {
  AUDIT_ACTOR_TYPES,
  AUDIT_EVENT_VERSIONS,
  AUDIT_RESULTS,
  AUDIT_SOURCES,
} from "@afenda/observability";
import { z } from "zod";

// biome-ignore lint/performance/noBarrelFile: compatibility shim; TIP-010 validation lives in @afenda/observability.
export {
  AuditValidationError,
  assertAuditMetadata,
  parseInsertAuditEventInput,
  parseWriteAuditEventInput,
} from "@afenda/observability";

export const auditSourceSchema = z.enum(AUDIT_SOURCES);
export const auditEventVersionSchema = z.enum(AUDIT_EVENT_VERSIONS);
export const auditActorTypeSchema = z.enum(AUDIT_ACTOR_TYPES);
export const auditResultSchema = z.enum(AUDIT_RESULTS);
export const auditMetadataPrimitiveSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export const insertAuditEventInputSchema = z
  .object({
    tenantId: z.string().nullable().optional(),
    companyId: z.string().nullable().optional(),
    organizationId: z.string().nullable().optional(),
    actorId: z.string().nullable().optional(),
    actorType: auditActorTypeSchema,
    actorUserId: z.string().nullable().optional(),
    module: z.string(),
    action: z.string(),
    targetType: z.string(),
    targetId: z.string().nullable().optional(),
    result: auditResultSchema,
    reason: z.string().nullable().optional(),
    permission: z.string().nullable().optional(),
    policyId: z.string().nullable().optional(),
    source: auditSourceSchema.optional(),
    correlationId: z.string(),
    eventVersion: auditEventVersionSchema.optional(),
    ipAddress: z.string().nullable().optional(),
    userAgent: z.string().nullable().optional(),
    metadata: z.unknown().optional(),
  })
  .strict();
