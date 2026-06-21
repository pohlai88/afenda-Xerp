"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNSAFE_SUPPRESSION_PATTERNS = void 0;
exports.containsUnsafeSuppression = containsUnsafeSuppression;
exports.hasSuppressionRationale = hasSuppressionRationale;
exports.isSuppressionExempted = isSuppressionExempted;
var ai_drift_contract_js_1 = require("../contracts/ai-drift.contract.js");
Object.defineProperty(exports, "UNSAFE_SUPPRESSION_PATTERNS", { enumerable: true, get: function () { return ai_drift_contract_js_1.UNSAFE_SUPPRESSION_PATTERNS; } });
var ai_prompt_policy_js_1 = require("./ai-prompt-policy.js");
function containsUnsafeSuppression(content) {
    return ai_drift_contract_js_1.UNSAFE_SUPPRESSION_PATTERNS.some(function (pattern) { return content.includes(pattern); });
}
function hasSuppressionRationale(content) {
    return ai_prompt_policy_js_1.SUPPRESSION_RATIONALE_PATTERN.test(content);
}
function isSuppressionExempted(path, testExemptions) {
    return testExemptions.some(function (entry) { return entry.path === path && entry.rationale.length > 0; });
}
