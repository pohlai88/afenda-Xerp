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
var vitest_1 = require("vitest");
var upstash_evaluation_cache_1 = require("../cache/upstash-evaluation-cache");
(0, vitest_1.describe)("createUpstashEvaluationCache", function () {
    (0, vitest_1.it)("stores and retrieves entries with tenant index tracking", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, tenantIndexes, redis, cache, entry, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = new Map();
                    tenantIndexes = new Map();
                    redis = {
                        get: vitest_1.vi.fn(function (key) { var _a; return Promise.resolve((_a = store.get(key)) !== null && _a !== void 0 ? _a : null); }),
                        set: vitest_1.vi.fn(function (key, value, _options) {
                            store.set(key, value);
                            return Promise.resolve();
                        }),
                        del: vitest_1.vi.fn(function () {
                            var keys = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                keys[_i] = arguments[_i];
                            }
                            var deletedCount = 0;
                            for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
                                var key = keys_1[_a];
                                if (store.delete(key) || tenantIndexes.delete(key)) {
                                    deletedCount += 1;
                                }
                            }
                            return Promise.resolve(deletedCount);
                        }),
                        sadd: vitest_1.vi.fn(function (indexKey, member) {
                            var _a;
                            var members = (_a = tenantIndexes.get(indexKey)) !== null && _a !== void 0 ? _a : new Set();
                            members.add(member);
                            tenantIndexes.set(indexKey, members);
                            return Promise.resolve(1);
                        }),
                        smembers: vitest_1.vi.fn(function (indexKey) { var _a; return Promise.resolve(__spreadArray([], ((_a = tenantIndexes.get(indexKey)) !== null && _a !== void 0 ? _a : []), true)); }),
                    };
                    cache = (0, upstash_evaluation_cache_1.createUpstashEvaluationCache)({
                        redis: redis,
                        now: function () { return 1000; },
                    });
                    entry = {
                        decision: {
                            result: "allow",
                            capabilityKey: "accounting",
                            reason: "Capability is available.",
                            audit: null,
                        },
                        expiresAt: 5000,
                    };
                    return [4 /*yield*/, cache.set("tenant_a:company_a:accounting", entry, 4000)];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, cache.get("tenant_a:company_a:accounting")];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual(entry);
                    (0, vitest_1.expect)(redis.sadd).toHaveBeenCalledWith("entitlement:eval:tenant:tenant_a", "entitlement:eval:tenant_a:company_a:accounting");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("invalidates all keys tracked for a tenant", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, tenantIndexes, redis, cache, entry, cacheKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store = new Map();
                    tenantIndexes = new Map();
                    redis = {
                        get: vitest_1.vi.fn(function (key) { var _a; return Promise.resolve((_a = store.get(key)) !== null && _a !== void 0 ? _a : null); }),
                        set: vitest_1.vi.fn(function (key, value) {
                            store.set(key, value);
                            return Promise.resolve(1);
                        }),
                        del: vitest_1.vi.fn(function () {
                            var keys = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                keys[_i] = arguments[_i];
                            }
                            var deletedCount = 0;
                            for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
                                var key = keys_2[_a];
                                if (store.delete(key) || tenantIndexes.delete(key)) {
                                    deletedCount += 1;
                                }
                            }
                            return Promise.resolve(deletedCount);
                        }),
                        sadd: vitest_1.vi.fn(function (indexKey, member) {
                            var _a;
                            var members = (_a = tenantIndexes.get(indexKey)) !== null && _a !== void 0 ? _a : new Set();
                            members.add(member);
                            tenantIndexes.set(indexKey, members);
                            return Promise.resolve(1);
                        }),
                        smembers: vitest_1.vi.fn(function (indexKey) { var _a; return Promise.resolve(__spreadArray([], ((_a = tenantIndexes.get(indexKey)) !== null && _a !== void 0 ? _a : []), true)); }),
                    };
                    cache = (0, upstash_evaluation_cache_1.createUpstashEvaluationCache)({
                        redis: redis,
                        now: function () { return 1000; },
                    });
                    entry = {
                        decision: {
                            result: "allow",
                            capabilityKey: "accounting",
                            reason: "Capability is available.",
                            audit: null,
                        },
                        expiresAt: 5000,
                    };
                    cacheKey = "entitlement:eval:tenant_a:company_a:accounting";
                    store.set(cacheKey, entry);
                    tenantIndexes.set("entitlement:eval:tenant:tenant_a", new Set([cacheKey]));
                    return [4 /*yield*/, cache.invalidateTenant("tenant_a")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(store.has(cacheKey)).toBe(false);
                    (0, vitest_1.expect)(tenantIndexes.has("entitlement:eval:tenant:tenant_a")).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
