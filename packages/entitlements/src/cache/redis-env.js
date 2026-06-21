"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.MissingUpstashRedisConfigError = void 0;
exports.getUpstashRedisConfig = getUpstashRedisConfig;
exports.hasUpstashRedisConfig = hasUpstashRedisConfig;
exports.probeUpstashRedisConnectivity = probeUpstashRedisConnectivity;
exports.createEvaluationCacheFromEnv = createEvaluationCacheFromEnv;
exports.createUpstashEvaluationCacheFromEnv = createUpstashEvaluationCacheFromEnv;
var redis_1 = require("@upstash/redis");
var evaluation_cache_js_1 = require("./evaluation-cache.js");
var upstash_evaluation_cache_js_1 = require("./upstash-evaluation-cache.js");
var MissingUpstashRedisConfigError = /** @class */ (function (_super) {
    __extends(MissingUpstashRedisConfigError, _super);
    function MissingUpstashRedisConfigError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "MissingUpstashRedisConfigError";
        return _this;
    }
    return MissingUpstashRedisConfigError;
}(Error));
exports.MissingUpstashRedisConfigError = MissingUpstashRedisConfigError;
var UPSTASH_REDIS_REST_URL = "UPSTASH_REDIS_REST_URL";
var UPSTASH_REDIS_REST_TOKEN = "UPSTASH_REDIS_REST_TOKEN";
function getUpstashRedisConfig(env) {
    var _a, _b;
    if (env === void 0) { env = process.env; }
    var url = (_a = env[UPSTASH_REDIS_REST_URL]) === null || _a === void 0 ? void 0 : _a.trim();
    var token = (_b = env[UPSTASH_REDIS_REST_TOKEN]) === null || _b === void 0 ? void 0 : _b.trim();
    if (!(url && token)) {
        return null;
    }
    return { url: url, token: token };
}
function hasUpstashRedisConfig(env) {
    if (env === void 0) { env = process.env; }
    return getUpstashRedisConfig(env) !== null;
}
/** Returns true when Upstash REST accepts a PING (used by live tests and env doctor). */
function probeUpstashRedisConnectivity() {
    return __awaiter(this, arguments, void 0, function (env) {
        var config, redis, response, _a;
        if (env === void 0) { env = process.env; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = getUpstashRedisConfig(env);
                    if (!config) {
                        return [2 /*return*/, false];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    redis = new redis_1.Redis({
                        url: config.url,
                        token: config.token,
                    });
                    return [4 /*yield*/, redis.ping()];
                case 2:
                    response = _b.sent();
                    return [2 /*return*/, response === "PONG"];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/** Uses Upstash Redis when configured; otherwise falls back to in-memory TTL cache. */
function createEvaluationCacheFromEnv(options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var env = (_a = options.env) !== null && _a !== void 0 ? _a : process.env;
    var config = getUpstashRedisConfig(env);
    if (config) {
        var redis = (_b = options.redis) !== null && _b !== void 0 ? _b : new redis_1.Redis({
            url: config.url,
            token: config.token,
        });
        return (0, upstash_evaluation_cache_js_1.createUpstashEvaluationCache)(__assign({ redis: redis }, (options.now === undefined ? {} : { now: options.now })));
    }
    return (0, evaluation_cache_js_1.createMemoryEvaluationCache)(__assign(__assign({}, (options.ttlMs === undefined ? {} : { ttlMs: options.ttlMs })), (options.now === undefined ? {} : { now: options.now })));
}
function createUpstashEvaluationCacheFromEnv(env) {
    if (env === void 0) { env = process.env; }
    var config = getUpstashRedisConfig(env);
    if (!config) {
        throw new MissingUpstashRedisConfigError("".concat(UPSTASH_REDIS_REST_URL, " and ").concat(UPSTASH_REDIS_REST_TOKEN, " are required."));
    }
    return (0, upstash_evaluation_cache_js_1.createUpstashEvaluationCache)({
        redis: new redis_1.Redis({
            url: config.url,
            token: config.token,
        }),
    });
}
