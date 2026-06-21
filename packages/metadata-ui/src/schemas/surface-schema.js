"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMetadataSurface = void 0;
var action_schema_1 = require("./action-schema");
var section_schema_1 = require("./section-schema");
var validateMetadataSurface = function (surface) {
    var errors = [];
    if (surface.sections.length === 0) {
        errors.push("Metadata surfaces must declare at least one section.");
    }
    for (var _i = 0, _a = surface.sections; _i < _a.length; _i++) {
        var section = _a[_i];
        errors.push.apply(errors, (0, section_schema_1.validateMetadataSection)(section).errors);
    }
    for (var _b = 0, _c = surface.actions; _b < _c.length; _b++) {
        var action = _c[_b];
        errors.push.apply(errors, (0, action_schema_1.validateMetadataAction)(action).errors);
    }
    return {
        errors: errors,
        valid: errors.length === 0,
    };
};
exports.validateMetadataSurface = validateMetadataSurface;
