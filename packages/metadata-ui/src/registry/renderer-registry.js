"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMetadataRendererRegistry = void 0;
var metadata_section_contract_1 = require("../contracts/metadata-section.contract");
var sortRenderers = function (renderers) {
    return __spreadArray([], renderers, true).sort(function (left, right) { return right.priority - left.priority; });
};
var createMetadataRendererRegistry = function (initialRenderers) {
    if (initialRenderers === void 0) { initialRenderers = []; }
    var renderers = new Map();
    for (var _i = 0, initialRenderers_1 = initialRenderers; _i < initialRenderers_1.length; _i++) {
        var renderer = initialRenderers_1[_i];
        renderers.set(renderer.id, renderer);
    }
    var registry = {
        listRenderers: function () { return sortRenderers(__spreadArray([], renderers.values(), true)); },
        register: function (renderer) {
            renderers.set(renderer.id, renderer);
            return registry;
        },
        resolve: function (sectionType) {
            var compatibleRenderer = sortRenderers(__spreadArray([], renderers.values(), true)).find(function (renderer) { return renderer.sectionTypes.includes(sectionType); });
            return {
                reason: compatibleRenderer
                    ? "Resolved renderer \"".concat(compatibleRenderer.id, "\" for section \"").concat(sectionType, "\".")
                    : "No renderer registered for section \"".concat(sectionType, "\"."),
                renderer: compatibleRenderer !== null && compatibleRenderer !== void 0 ? compatibleRenderer : null,
                sectionType: sectionType,
            };
        },
        snapshot: function () { return ({
            renderers: sortRenderers(__spreadArray([], renderers.values(), true)),
            sectionTypes: metadata_section_contract_1.METADATA_SECTION_TYPES,
        }); },
    };
    return registry;
};
exports.createMetadataRendererRegistry = createMetadataRendererRegistry;
