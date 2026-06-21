"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAiGovernance = validateAiGovernance;
var ai_change_contract_js_1 = require("../contracts/ai-change.contract.js");
var validate_ai_change_js_1 = require("./validate-ai-change.js");
var validate_ai_boundaries_js_1 = require("./validate-ai-boundaries.js");
var validate_ai_prompts_js_1 = require("./validate-ai-prompts.js");
var validate_ai_drift_js_1 = require("./validate-ai-drift.js");
function validateAiGovernance(context) {
    return (0, ai_change_contract_js_1.createAiValidationResult)(context.mode, __spreadArray(__spreadArray(__spreadArray(__spreadArray([], (0, validate_ai_change_js_1.validateAiChangeGates)(context), true), (0, validate_ai_boundaries_js_1.validateAiBoundaries)(context), true), (0, validate_ai_prompts_js_1.validateAiPrompts)(context), true), (0, validate_ai_drift_js_1.validateAiDrift)(context), true));
}
