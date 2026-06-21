"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localization = localization;
exports.resolveLocalizationAccess = resolveLocalizationAccess;
var entitlement_engine_1 = require("../evaluation/entitlement-engine");
function localization(key, localizations, entitlements, context) {
    return resolveLocalizationAccess(key, localizations, entitlements, context);
}
function resolveLocalizationAccess(key, localizations, entitlements, context) {
    var _a;
    var matchingLocalization = (_a = localizations.find(function (item) { return item.key === key; })) !== null && _a !== void 0 ? _a : null;
    if (!matchingLocalization) {
        return { key: key, enabled: false, localization: null };
    }
    return {
        key: key,
        enabled: matchingLocalization.enabled &&
            (0, entitlement_engine_1.entitlement)(matchingLocalization.requiredEntitlement, entitlements, context),
        localization: matchingLocalization,
    };
}
