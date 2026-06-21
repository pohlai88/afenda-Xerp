"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveUsageLimit = exports.limit = void 0;
// TIP-008 spec-required service file — re-exports from the usage-limit engine.
// biome-ignore lint/performance/noBarrelFile: TIP-008 requires this compatibility service entry point.
var usage_limit_engine_1 = require("./usage-limit-engine");
Object.defineProperty(exports, "limit", { enumerable: true, get: function () { return usage_limit_engine_1.limit; } });
Object.defineProperty(exports, "resolveUsageLimit", { enumerable: true, get: function () { return usage_limit_engine_1.resolveUsageLimit; } });
