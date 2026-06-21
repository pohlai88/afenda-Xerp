"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBetaAccess = exports.beta = void 0;
// TIP-008 spec-required service file — re-exports from the beta-access engine.
// biome-ignore lint/performance/noBarrelFile: TIP-008 requires this compatibility service entry point.
var beta_access_engine_1 = require("./beta-access-engine");
Object.defineProperty(exports, "beta", { enumerable: true, get: function () { return beta_access_engine_1.beta; } });
Object.defineProperty(exports, "resolveBetaAccess", { enumerable: true, get: function () { return beta_access_engine_1.resolveBetaAccess; } });
