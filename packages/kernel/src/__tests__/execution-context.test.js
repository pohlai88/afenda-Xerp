"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var index_js_1 = require("../index.js");
var ISO_TIMESTAMP_PREFIX = /^\d{4}-\d{2}-\d{2}T/;
(0, vitest_1.describe)("execution context contract", function () {
    (0, vitest_1.it)("creates execution context with generated identifiers", function () {
        var context = (0, index_js_1.createExecutionContext)({
            correlationId: "corr-kernel-001",
            source: "event",
            tenantId: "tenant-1",
        });
        (0, vitest_1.expect)(context.executionId.startsWith("exec-")).toBe(true);
        (0, vitest_1.expect)(context.correlationId).toBe("corr-kernel-001");
        (0, vitest_1.expect)(context.startedAt).toMatch(ISO_TIMESTAMP_PREFIX);
    });
    (0, vitest_1.it)("asserts required identifiers", function () {
        var context = (0, index_js_1.createExecutionContext)({
            correlationId: "corr-1",
            executionId: (0, index_js_1.createExecutionId)(),
            source: "manual",
        });
        (0, vitest_1.expect)((0, index_js_1.assertExecutionContext)(context)).toEqual(context);
    });
    (0, vitest_1.it)("rejects empty correlation identifiers", function () {
        (0, vitest_1.expect)(function () {
            return (0, index_js_1.assertExecutionContext)({
                actorId: null,
                companyId: null,
                correlationId: "   ",
                executionId: "exec-1",
                organizationId: null,
                source: "api",
                startedAt: "2026-06-20T00:00:00.000Z",
                tenantId: null,
            });
        }).toThrow("correlationId");
    });
});
