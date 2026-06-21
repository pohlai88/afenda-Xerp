"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limit = limit;
exports.resolveUsageLimit = resolveUsageLimit;
function limit(key, limits) {
    return resolveUsageLimit(key, limits);
}
function resolveUsageLimit(key, limits) {
    var _a;
    var matchingLimit = (_a = limits.find(function (item) { return item.key === key; })) !== null && _a !== void 0 ? _a : null;
    if (!matchingLimit) {
        return {
            key: key,
            allowed: true,
            used: 0,
            maximum: Number.POSITIVE_INFINITY,
            limit: null,
        };
    }
    return {
        key: key,
        allowed: matchingLimit.used < matchingLimit.maximum,
        used: matchingLimit.used,
        maximum: matchingLimit.maximum,
        limit: matchingLimit,
    };
}
