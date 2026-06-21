"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAiDrift = validateAiDrift;
var ai_drift_policy_js_1 = require("../policies/ai-drift-policy.js");
function validateAiDrift(context) {
    if (context.mode !== "scope" || !context.scopeManifest) {
        return [];
    }
    var violations = [];
    for (var _i = 0, _a = context.changedLines; _i < _a.length; _i++) {
        var changedLine = _a[_i];
        if (!(0, ai_drift_policy_js_1.containsUnsafeSuppression)(changedLine.content)) {
            continue;
        }
        if ((0, ai_drift_policy_js_1.isSuppressionExempted)(changedLine.path, context.scopeManifest.testExemptions)) {
            continue;
        }
        if ((0, ai_drift_policy_js_1.hasSuppressionRationale)(changedLine.content)) {
            continue;
        }
        violations.push({
            invariant: "AI-010",
            gate: "drift",
            message: "new unsafe suppression on changed line without TIP/ADR rationale",
            path: changedLine.path,
            lineNumber: changedLine.lineNumber,
        });
    }
    return violations;
}
