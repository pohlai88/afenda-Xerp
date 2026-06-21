"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExampleRendererRegistry = exports.exampleRendererRegistration = void 0;
var renderer_registry_1 = require("../registry/renderer-registry");
var default_renderers_1 = require("../renderers/default-renderers");
exports.exampleRendererRegistration = {
    id: "metadata.list.enterprise",
    priority: 200,
    recipe: "table",
    sectionTypes: ["list"],
    stable: true,
};
var createExampleRendererRegistry = function () {
    return (0, renderer_registry_1.createMetadataRendererRegistry)(default_renderers_1.defaultMetadataRenderers).register(exports.exampleRendererRegistration);
};
exports.createExampleRendererRegistry = createExampleRendererRegistry;
