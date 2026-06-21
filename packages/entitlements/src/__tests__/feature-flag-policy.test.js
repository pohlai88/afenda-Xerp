"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var feature_flag_engine_1 = require("../flags/feature-flag-engine");
var feature_flag_policy_1 = require("../flags/feature-flag-policy");
(0, vitest_1.describe)("feature flag fail-open policy", function () {
    var context = {
        tenantId: "tenant_a",
        companyId: "company_a",
        environment: "production",
    };
    (0, vitest_1.it)("documents fail-open default for missing flags", function () {
        (0, vitest_1.expect)(feature_flag_policy_1.FEATURE_FLAG_FAIL_OPEN_DEFAULT).toBe(true);
    });
    (0, vitest_1.it)("resolveFeatureFlag fails open when flag is missing", function () {
        (0, vitest_1.expect)((0, feature_flag_engine_1.resolveFeatureFlag)("missing_flag", [], context)).toEqual({
            key: "missing_flag",
            enabled: true,
            flag: null,
        });
    });
    (0, vitest_1.it)("resolveFeatureFlagStrict fails closed when flag is missing", function () {
        (0, vitest_1.expect)((0, feature_flag_engine_1.resolveFeatureFlagStrict)("missing_flag", [], context)).toEqual({
            key: "missing_flag",
            enabled: false,
            flag: null,
        });
    });
});
