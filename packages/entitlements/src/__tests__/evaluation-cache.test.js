"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var evaluation_cache_1 = require("../cache/evaluation-cache");
var capability_evaluation_1 = require("../evaluation/capability-evaluation");
var tier_fixtures_1 = require("../fixtures/tier-fixtures");
(0, vitest_1.describe)("evaluation cache", function () {
    (0, vitest_1.it)("returns cached decisions within TTL", function () { return __awaiter(void 0, void 0, void 0, function () {
        var currentTime, cache, evaluate, cachedEvaluate, input, first, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentTime = 1000;
                    cache = (0, evaluation_cache_1.createMemoryEvaluationCache)({
                        ttlMs: 5000,
                        now: function () { return currentTime; },
                    });
                    evaluate = vitest_1.vi.fn(capability_evaluation_1.evaluateCapability);
                    cachedEvaluate = (0, evaluation_cache_1.createCachedCapabilityEvaluator)(evaluate, {
                        cache: cache,
                        ttlMs: 5000,
                        now: function () { return currentTime; },
                    });
                    input = {
                        capabilityKey: "accounting",
                        context: (0, tier_fixtures_1.buildContext)("tenant_basic", "company_basic", "accounting"),
                        entitlements: tier_fixtures_1.basicTierFixture.entitlements,
                        featureFlags: tier_fixtures_1.basicTierFixture.featureFlags,
                        usageLimits: tier_fixtures_1.basicTierFixture.usageLimits,
                        betaFlags: tier_fixtures_1.basicTierFixture.betaFlags,
                        killSwitches: tier_fixtures_1.basicTierFixture.killSwitches,
                        localizations: tier_fixtures_1.basicTierFixture.localizations,
                        evaluatedAt: "2026-06-20T00:00:00.000Z",
                        correlationId: "corr_cache_1",
                    };
                    return [4 /*yield*/, cachedEvaluate(input)];
                case 1:
                    first = _a.sent();
                    currentTime += 1000;
                    return [4 /*yield*/, cachedEvaluate(input)];
                case 2:
                    second = _a.sent();
                    (0, vitest_1.expect)(first).toEqual(second);
                    (0, vitest_1.expect)(evaluate).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("re-evaluates after TTL expiry", function () { return __awaiter(void 0, void 0, void 0, function () {
        var currentTime, cache, evaluate, cachedEvaluate, input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentTime = 0;
                    cache = (0, evaluation_cache_1.createMemoryEvaluationCache)({
                        ttlMs: 1000,
                        now: function () { return currentTime; },
                    });
                    evaluate = vitest_1.vi.fn(capability_evaluation_1.evaluateCapability);
                    cachedEvaluate = (0, evaluation_cache_1.createCachedCapabilityEvaluator)(evaluate, {
                        cache: cache,
                        ttlMs: 1000,
                        now: function () { return currentTime; },
                    });
                    input = {
                        capabilityKey: "accounting",
                        context: (0, tier_fixtures_1.buildContext)("tenant_basic", "company_basic", "accounting"),
                        entitlements: tier_fixtures_1.basicTierFixture.entitlements,
                        featureFlags: tier_fixtures_1.basicTierFixture.featureFlags,
                        usageLimits: tier_fixtures_1.basicTierFixture.usageLimits,
                        betaFlags: tier_fixtures_1.basicTierFixture.betaFlags,
                        killSwitches: tier_fixtures_1.basicTierFixture.killSwitches,
                        localizations: tier_fixtures_1.basicTierFixture.localizations,
                        evaluatedAt: "2026-06-20T00:00:00.000Z",
                        correlationId: "corr_cache_2",
                    };
                    return [4 /*yield*/, cachedEvaluate(input)];
                case 1:
                    _a.sent();
                    currentTime = 1001;
                    return [4 /*yield*/, cachedEvaluate(input)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(evaluate).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("invalidates all tenant cache entries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cache, key, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cache = (0, evaluation_cache_1.createMemoryEvaluationCache)({ ttlMs: 60000 });
                    key = (0, evaluation_cache_1.buildEvaluationCacheKey)({
                        tenantId: "tenant_a",
                        companyId: "company_a",
                        capabilityKey: "accounting",
                    });
                    return [4 /*yield*/, cache.set(key, {
                            decision: {
                                result: "allow",
                                capabilityKey: "accounting",
                                reason: "Capability is available.",
                                audit: null,
                            },
                            expiresAt: Date.now() + 60000,
                        }, 60000)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, cache.invalidateTenant("tenant_a")];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, cache.get(key)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
