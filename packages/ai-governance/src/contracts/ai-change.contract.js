"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_INVARIANT_IDS = void 0;
exports.createAiValidationResult = createAiValidationResult;
exports.mergeAiValidationResults = mergeAiValidationResults;
exports.AI_INVARIANT_IDS = [
    "AI-001",
    "AI-002",
    "AI-003",
    "AI-004",
    "AI-004-SCOPE",
    "AI-005",
    "AI-006",
    "AI-007",
    "AI-008",
    "AI-009",
    "AI-010",
];
function createAiValidationResult(mode, violations) {
    return {
        ok: violations.length === 0,
        mode: mode,
        violations: violations,
    };
}
function mergeAiValidationResults(mode, results) {
    var violations = results.flatMap(function (result) { return result.violations; });
    return createAiValidationResult(mode, violations);
}
