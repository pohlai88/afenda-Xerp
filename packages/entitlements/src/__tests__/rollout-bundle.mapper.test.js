"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var rollout_bundle_mapper_1 = require("../provisioning/rollout-bundle.mapper");
(0, vitest_1.describe)("mapPlatformRolloutToEvaluationData", function () {
    (0, vitest_1.it)("maps rollout rows into evaluation contracts", function () {
        var _a;
        var bundle = {
            loadedAt: "2026-06-20T00:00:00.000Z",
            featureFlags: [
                {
                    key: "e_invoice",
                    enabled: true,
                    rollout: "on",
                    environments: ["production", "invalid-env"],
                    tenantAllowlist: [],
                    companyAllowlist: [],
                    killSwitchKey: "feature.e_invoice.kill_switch",
                    metadata: {},
                },
            ],
            killSwitches: [
                {
                    key: "feature.e_invoice.kill_switch",
                    active: false,
                    severity: "critical",
                    reason: "",
                    activatedBy: null,
                    activatedAt: null,
                },
            ],
        };
        var mapped = (0, rollout_bundle_mapper_1.mapPlatformRolloutToEvaluationData)(bundle);
        (0, vitest_1.expect)(mapped.featureFlags).toEqual([
            {
                key: "e_invoice",
                enabled: true,
                rollout: "on",
                environments: ["production"],
                tenantAllowlist: [],
                companyAllowlist: [],
                killSwitchKey: "feature.e_invoice.kill_switch",
                metadata: {},
            },
        ]);
        (0, vitest_1.expect)((_a = mapped.killSwitches[0]) === null || _a === void 0 ? void 0 : _a.severity).toBe("critical");
    });
});
