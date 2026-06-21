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
var redis_env_js_1 = require("../cache/redis-env.js");
var LIVE_REDIS_TEST_ENV = "AFENDA_LIVE_REDIS_TEST";
var LIVE_REDIS_TEST_CONFIRM = "yes";
function isLiveRedisTestEnabled() {
    var _a;
    return (((_a = process.env[LIVE_REDIS_TEST_ENV]) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) ===
        LIVE_REDIS_TEST_CONFIRM && (0, redis_env_js_1.hasUpstashRedisConfig)());
}
vitest_1.describe.runIf(isLiveRedisTestEnabled())("upstash evaluation cache (live Redis)", function () {
    var tenantId = "live_redis_".concat(Date.now());
    var cacheKey = "".concat(tenantId, ":company_live:accounting");
    var cache;
    var entry = {
        decision: {
            result: "allow",
            capabilityKey: "accounting",
            reason: "Live Redis integration test.",
            audit: null,
        },
        expiresAt: Date.now() + 60000,
    };
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var reachable;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, redis_env_js_1.probeUpstashRedisConnectivity)()];
                case 1:
                    reachable = _a.sent();
                    if (!reachable) {
                        throw new Error("Upstash Redis unreachable — verify UPSTASH_REDIS_REST_URL in .env.config and UPSTASH_REDIS_REST_TOKEN in .env.secret, then run pnpm env:sync");
                    }
                    cache = (0, redis_env_js_1.createUpstashEvaluationCacheFromEnv)();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cache.invalidateTenant(tenantId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("stores and retrieves entries via Upstash REST", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, cache.set(cacheKey, entry, 60000)];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, cache.get(cacheKey)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual(entry);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("invalidates tenant-scoped keys", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, cache.set(cacheKey, entry, 60000)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, cache.invalidateTenant(tenantId)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, cache.get(cacheKey)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
