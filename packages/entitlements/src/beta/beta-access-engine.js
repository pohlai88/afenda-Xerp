"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beta = beta;
exports.resolveBetaAccess = resolveBetaAccess;
function beta(key, betaFlags, context) {
    return resolveBetaAccess(key, betaFlags, context);
}
function resolveBetaAccess(key, betaFlags, context) {
    var _a;
    var matchingFlag = (_a = betaFlags.find(function (flag) { return flag.key === key; })) !== null && _a !== void 0 ? _a : null;
    if (!matchingFlag) {
        return { key: key, enabled: false, betaFlag: null };
    }
    var tenantAllowed = matchingFlag.tenantAllowlist.includes(context.tenantId);
    var companyAllowed = matchingFlag.companyAllowlist.includes(context.companyId);
    var contextFlagEnabled = context.betaFlags.includes(key);
    return {
        key: key,
        enabled: matchingFlag.enabled &&
            (tenantAllowed || companyAllowed || contextFlagEnabled),
        betaFlag: matchingFlag,
    };
}
