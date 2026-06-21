"use strict";
/**
 * Cross-platform execution context types.
 *
 * Owned by `@afenda/kernel` — execution infrastructure consumes these types
 * but does not redefine them.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXECUTION_CONTEXT_SOURCES = void 0;
exports.createExecutionId = createExecutionId;
exports.createExecutionContext = createExecutionContext;
exports.assertExecutionContext = assertExecutionContext;
exports.EXECUTION_CONTEXT_SOURCES = [
    "api",
    "cron",
    "event",
    "manual",
    "system",
    "outbox",
    "job",
];
function createExecutionId(prefix) {
    if (prefix === void 0) { prefix = "exec"; }
    return "".concat(prefix, "-").concat(crypto.randomUUID());
}
function createExecutionContext(input) {
    var _a, _b, _c, _d, _e, _f;
    return {
        actorId: (_a = input.actorId) !== null && _a !== void 0 ? _a : null,
        companyId: (_b = input.companyId) !== null && _b !== void 0 ? _b : null,
        correlationId: input.correlationId,
        executionId: (_c = input.executionId) !== null && _c !== void 0 ? _c : createExecutionId(),
        organizationId: (_d = input.organizationId) !== null && _d !== void 0 ? _d : null,
        source: input.source,
        startedAt: (_e = input.startedAt) !== null && _e !== void 0 ? _e : new Date().toISOString(),
        tenantId: (_f = input.tenantId) !== null && _f !== void 0 ? _f : null,
    };
}
function assertExecutionContext(context) {
    if (!context.executionId.trim()) {
        throw new Error("executionId is required.");
    }
    if (!context.correlationId.trim()) {
        throw new Error("correlationId is required.");
    }
    return context;
}
