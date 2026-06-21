"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAiGovernanceReport = buildAiGovernanceReport;
var ai_drift_contract_js_1 = require("../contracts/ai-drift.contract.js");
var validate_ai_governance_js_1 = require("../validators/validate-ai-governance.js");
function buildAiGovernanceReport(context) {
    var _a, _b, _c, _d;
    return {
        version: ai_drift_contract_js_1.AI_GOVERNANCE_VERSION,
        fingerprint: ai_drift_contract_js_1.AI_GOVERNANCE_FINGERPRINT,
        mode: context.mode,
        tip: (_b = (_a = context.scopeManifest) === null || _a === void 0 ? void 0 : _a.tip) !== null && _b !== void 0 ? _b : null,
        adr: (_d = (_c = context.scopeManifest) === null || _c === void 0 ? void 0 : _c.adr) !== null && _d !== void 0 ? _d : null,
        changedFileCount: context.changedFiles.length,
        validation: (0, validate_ai_governance_js_1.validateAiGovernance)(context),
    };
}
