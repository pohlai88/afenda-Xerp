"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMetadataSection = exports.isMetadataSectionType = exports.metadataSectionSchemas = void 0;
var metadata_section_contract_1 = require("../contracts/metadata-section.contract");
exports.metadataSectionSchemas = metadata_section_contract_1.METADATA_SECTION_TYPES.map(function (type) { return ({
    type: type,
    requiresRenderer: true,
}); });
var isMetadataSectionType = function (value) {
    return metadata_section_contract_1.METADATA_SECTION_TYPES.includes(value);
};
exports.isMetadataSectionType = isMetadataSectionType;
var validateMetadataSection = function (section) {
    var _a, _b, _c, _d;
    var errors = [];
    if (!(0, exports.isMetadataSectionType)(section.type)) {
        errors.push("Unsupported section type \"".concat(section.type, "\"."));
    }
    if (section.type === "list" && ((_b = (_a = section.columns) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) === 0) {
        errors.push("List sections must declare at least one governed column.");
    }
    if (section.type === "form" && ((_d = (_c = section.fields) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) === 0) {
        errors.push("Form sections must declare at least one governed field.");
    }
    if (section.type === "audit-panel" && !section.auditPanel) {
        errors.push("Audit panel sections must include an audit panel contract.");
    }
    return {
        errors: errors,
        valid: errors.length === 0,
    };
};
exports.validateMetadataSection = validateMetadataSection;
