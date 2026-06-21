"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entitlement = entitlement;
exports.resolveEntitlement = resolveEntitlement;
function entitlement(key, entitlements, context) {
    return resolveEntitlement(key, entitlements, context).enabled;
}
function resolveEntitlement(key, entitlements, context) {
    var matchingEntitlement = entitlements.find(function (item) { return item.key === key && item.enabled && isInScope(item, context); });
    return {
        key: key,
        enabled: Boolean(matchingEntitlement),
        entitlement: matchingEntitlement !== null && matchingEntitlement !== void 0 ? matchingEntitlement : null,
    };
}
function isInScope(entitlementItem, context) {
    if (entitlementItem.scope === "global") {
        return true;
    }
    if (entitlementItem.scope === "tenant") {
        return entitlementItem.tenantId === context.tenantId;
    }
    if (entitlementItem.scope === "company") {
        return entitlementItem.companyId === context.companyId;
    }
    return entitlementItem.environment === context.environment;
}
