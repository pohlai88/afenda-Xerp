"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLocalizationAccess = exports.localization = void 0;
// TIP-008 spec-required service file — re-exports from the localization engine.
// biome-ignore lint/performance/noBarrelFile: TIP-008 requires this compatibility service entry point.
var localization_engine_1 = require("./localization-engine");
Object.defineProperty(exports, "localization", { enumerable: true, get: function () { return localization_engine_1.localization; } });
Object.defineProperty(exports, "resolveLocalizationAccess", { enumerable: true, get: function () { return localization_engine_1.resolveLocalizationAccess; } });
