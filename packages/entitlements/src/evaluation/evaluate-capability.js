"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateCapability = void 0;
// TIP-008 spec-required entry point — re-exports the capability gate evaluator.
// biome-ignore lint/performance/noBarrelFile: TIP-008 requires this compatibility evaluator entry point.
var capability_evaluation_1 = require("./capability-evaluation");
Object.defineProperty(exports, "evaluateCapability", { enumerable: true, get: function () { return capability_evaluation_1.evaluateCapability; } });
