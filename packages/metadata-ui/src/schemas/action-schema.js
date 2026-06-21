"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMetadataAction = exports.isSensitiveMetadataAction = void 0;
var GOVERNED_SENSITIVE_ACTION_CATEGORIES = [
    "destructive",
    "financial",
    "export",
    "ai",
    "approval",
];
var sensitiveActionCategories = GOVERNED_SENSITIVE_ACTION_CATEGORIES;
var isSensitiveMetadataAction = function (category) { return sensitiveActionCategories.includes(category); };
exports.isSensitiveMetadataAction = isSensitiveMetadataAction;
var validateMetadataAction = function (action) {
    var _a, _b;
    var errors = [];
    if (!action.permission.permissionKey) {
        errors.push("Action \"".concat(action.id, "\" must include a permission key."));
    }
    if (!(action.audit.action && action.audit.targetType)) {
        errors.push("Action \"".concat(action.id, "\" must include audit action and target."));
    }
    if ((0, exports.isSensitiveMetadataAction)(action.category)) {
        var hasConfirmation = ((_a = action.policy) === null || _a === void 0 ? void 0 : _a.confirmationRequired) === true;
        var hasPolicyKey = Boolean((_b = action.policy) === null || _b === void 0 ? void 0 : _b.policyKey);
        if (!(hasConfirmation || hasPolicyKey)) {
            errors.push("Sensitive action \"".concat(action.id, "\" must include confirmation or policy metadata."));
        }
    }
    return {
        errors: errors,
        valid: errors.length === 0,
    };
};
exports.validateMetadataAction = validateMetadataAction;
