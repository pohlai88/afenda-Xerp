"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMetadataState = exports.metadataStateSchema = void 0;
var design_system_1 = require("@afenda/design-system");
exports.metadataStateSchema = design_system_1.statePolicy.states.map(function (state) { return ({
    ariaLive: state.ariaLive,
    description: "Metadata surface ".concat(state.state, " state."),
    state: state.state,
    tone: state.tone,
}); });
var resolveMetadataState = function (state) {
    var resolvedState = exports.metadataStateSchema.find(function (candidate) { return candidate.state === state; });
    if (!resolvedState) {
        throw new Error("Unsupported metadata surface state \"".concat(state, "\"."));
    }
    return resolvedState;
};
exports.resolveMetadataState = resolveMetadataState;
