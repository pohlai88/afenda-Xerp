"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEntitlementAuditEvent = createEntitlementAuditEvent;
function createEntitlementAuditEvent(input) {
    return {
        tenantId: input.context.tenantId,
        companyId: input.context.companyId,
        organizationId: input.context.organizationId,
        feature: input.context.feature,
        reason: input.reason,
        result: input.result,
        evaluatedAt: input.evaluatedAt,
        correlationId: input.correlationId,
        evidence: input.evidence,
    };
}
