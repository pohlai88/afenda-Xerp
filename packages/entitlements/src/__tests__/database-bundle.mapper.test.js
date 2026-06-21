"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var database_bundle_mapper_1 = require("../provisioning/database-bundle.mapper");
var TENANT_ID = "00000000-0000-4000-8000-000000000100";
(0, vitest_1.describe)("mapDatabaseBundleToEvaluationData", function () {
    (0, vitest_1.it)("maps persisted grants into evaluation contracts", function () {
        var bundle = {
            tenantId: TENANT_ID,
            planTemplateId: "pro",
            loadedAt: "2026-06-20T00:00:00.000Z",
            entitlements: [
                {
                    tenantId: TENANT_ID,
                    companyId: null,
                    key: "module.accounting.enabled",
                    type: "module",
                    scope: "tenant",
                    environment: null,
                    enabled: true,
                    metadata: { source: "provision" },
                },
            ],
            usageLimits: [
                {
                    tenantId: TENANT_ID,
                    key: "users.max",
                    scope: "tenant",
                    period: "instant",
                    maximum: 50,
                    used: 3,
                    unit: "users",
                },
                {
                    tenantId: TENANT_ID,
                    key: "unknown.limit",
                    scope: "tenant",
                    period: "monthly",
                    maximum: 1,
                    used: 0,
                    unit: "units",
                },
            ],
        };
        var mapped = (0, database_bundle_mapper_1.mapDatabaseBundleToEvaluationData)(bundle);
        (0, vitest_1.expect)(mapped.entitlements).toEqual([
            {
                key: "module.accounting.enabled",
                type: "module",
                enabled: true,
                scope: "tenant",
                tenantId: TENANT_ID,
                companyId: null,
                environment: null,
                metadata: { source: "provision" },
            },
        ]);
        (0, vitest_1.expect)(mapped.usageLimits).toEqual([
            {
                key: "users.max",
                scope: "tenant",
                period: "instant",
                maximum: 50,
                used: 3,
                unit: "users",
            },
        ]);
    });
});
