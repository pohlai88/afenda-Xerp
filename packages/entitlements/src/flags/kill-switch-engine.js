"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveKillSwitch = resolveKillSwitch;
function resolveKillSwitch(key, killSwitches) {
    var _a, _b;
    var matchingSwitch = (_a = killSwitches.find(function (item) { return item.key === key; })) !== null && _a !== void 0 ? _a : null;
    return {
        key: key,
        active: (_b = matchingSwitch === null || matchingSwitch === void 0 ? void 0 : matchingSwitch.active) !== null && _b !== void 0 ? _b : false,
        killSwitch: matchingSwitch,
    };
}
