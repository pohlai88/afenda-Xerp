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
exports.buildEvaluationCacheKey = buildEvaluationCacheKey;
exports.createMemoryEvaluationCache = createMemoryEvaluationCache;
exports.createCachedCapabilityEvaluator = createCachedCapabilityEvaluator;
var DEFAULT_TTL_MS = 60000;
function buildEvaluationCacheKey(input) {
    return "".concat(input.tenantId, ":").concat(input.companyId, ":").concat(input.capabilityKey);
}
/** Process-local TTL cache for entitlement evaluation decisions. */
function createMemoryEvaluationCache(options) {
    var _a;
    if (options === void 0) { options = {}; }
    var now = (_a = options.now) !== null && _a !== void 0 ? _a : (function () { return Date.now(); });
    var store = new Map();
    var tenantIndex = new Map();
    function trackTenantKey(tenantId, key) {
        var _a;
        var keys = (_a = tenantIndex.get(tenantId)) !== null && _a !== void 0 ? _a : new Set();
        keys.add(key);
        tenantIndex.set(tenantId, keys);
    }
    function isExpired(entry, currentTime) {
        return entry.expiresAt <= currentTime;
    }
    return {
        get: function (key) {
            var entry = store.get(key);
            if (!entry) {
                return Promise.resolve(null);
            }
            var currentTime = now();
            if (isExpired(entry, currentTime)) {
                store.delete(key);
                return Promise.resolve(null);
            }
            return Promise.resolve(entry);
        },
        set: function (key, entry) {
            store.set(key, entry);
            var tenantId = key.split(":")[0];
            if (tenantId) {
                trackTenantKey(tenantId, key);
            }
            return Promise.resolve();
        },
        delete: function (key) {
            store.delete(key);
            return Promise.resolve();
        },
        invalidateTenant: function (tenantId) {
            var keys = tenantIndex.get(tenantId);
            if (!keys) {
                return Promise.resolve();
            }
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                store.delete(key);
            }
            tenantIndex.delete(tenantId);
            return Promise.resolve();
        },
    };
}
function createCachedCapabilityEvaluator(evaluate, options) {
    var _this = this;
    var _a, _b;
    var ttlMs = (_a = options.ttlMs) !== null && _a !== void 0 ? _a : DEFAULT_TTL_MS;
    var now = (_b = options.now) !== null && _b !== void 0 ? _b : (function () { return Date.now(); });
    return function (input) { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, cached, decision;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = buildEvaluationCacheKey({
                        tenantId: input.context.tenantId,
                        companyId: input.context.companyId,
                        capabilityKey: input.capabilityKey,
                    });
                    return [4 /*yield*/, options.cache.get(cacheKey)];
                case 1:
                    cached = _a.sent();
                    if (cached) {
                        return [2 /*return*/, cached.decision];
                    }
                    decision = evaluate(input);
                    return [4 /*yield*/, options.cache.set(cacheKey, {
                            decision: decision,
                            expiresAt: now() + ttlMs,
                        }, ttlMs)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, decision];
            }
        });
    }); };
}
