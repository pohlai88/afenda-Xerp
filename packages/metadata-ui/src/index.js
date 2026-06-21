"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.governedMetadataSectionTypes = exports.validateMetadataSurface = exports.resolveMetadataState = exports.metadataStateSchema = exports.validateMetadataSection = exports.metadataSectionSchemas = exports.isMetadataSectionType = exports.validateMetadataAction = exports.isSensitiveMetadataAction = exports.resolveMetadataStatePresentation = exports.defaultMetadataRenderers = exports.createMetadataRendererRegistry = exports.resolveMetadataVisibility = exports.resolveMetadataActions = exports.exampleRendererRegistration = exports.createExampleRendererRegistry = exports.governedMetadataSurfaceExample = exports.METADATA_ACTION_CATEGORIES = exports.PACKAGE_NAME = void 0;
exports.getPackageName = getPackageName;
// biome-ignore-all lint/performance/noBarrelFile: TIP-007 requires a stable public root export surface.
exports.PACKAGE_NAME = "@afenda/metadata-ui";
function getPackageName() {
    return exports.PACKAGE_NAME;
}
var metadata_action_contract_1 = require("./contracts/metadata-action.contract");
Object.defineProperty(exports, "METADATA_ACTION_CATEGORIES", { enumerable: true, get: function () { return metadata_action_contract_1.METADATA_ACTION_CATEGORIES; } });
var governed_surface_example_1 = require("./examples/governed-surface.example");
Object.defineProperty(exports, "governedMetadataSurfaceExample", { enumerable: true, get: function () { return governed_surface_example_1.governedMetadataSurfaceExample; } });
var renderer_registration_example_1 = require("./examples/renderer-registration.example");
Object.defineProperty(exports, "createExampleRendererRegistry", { enumerable: true, get: function () { return renderer_registration_example_1.createExampleRendererRegistry; } });
Object.defineProperty(exports, "exampleRendererRegistration", { enumerable: true, get: function () { return renderer_registration_example_1.exampleRendererRegistration; } });
var permission_visibility_1 = require("./registry/permission-visibility");
Object.defineProperty(exports, "resolveMetadataActions", { enumerable: true, get: function () { return permission_visibility_1.resolveMetadataActions; } });
Object.defineProperty(exports, "resolveMetadataVisibility", { enumerable: true, get: function () { return permission_visibility_1.resolveMetadataVisibility; } });
var renderer_registry_1 = require("./registry/renderer-registry");
Object.defineProperty(exports, "createMetadataRendererRegistry", { enumerable: true, get: function () { return renderer_registry_1.createMetadataRendererRegistry; } });
var default_renderers_1 = require("./renderers/default-renderers");
Object.defineProperty(exports, "defaultMetadataRenderers", { enumerable: true, get: function () { return default_renderers_1.defaultMetadataRenderers; } });
var state_renderer_1 = require("./renderers/state-renderer");
Object.defineProperty(exports, "resolveMetadataStatePresentation", { enumerable: true, get: function () { return state_renderer_1.resolveMetadataStatePresentation; } });
var action_schema_1 = require("./schemas/action-schema");
Object.defineProperty(exports, "isSensitiveMetadataAction", { enumerable: true, get: function () { return action_schema_1.isSensitiveMetadataAction; } });
Object.defineProperty(exports, "validateMetadataAction", { enumerable: true, get: function () { return action_schema_1.validateMetadataAction; } });
var section_schema_1 = require("./schemas/section-schema");
Object.defineProperty(exports, "isMetadataSectionType", { enumerable: true, get: function () { return section_schema_1.isMetadataSectionType; } });
Object.defineProperty(exports, "metadataSectionSchemas", { enumerable: true, get: function () { return section_schema_1.metadataSectionSchemas; } });
Object.defineProperty(exports, "validateMetadataSection", { enumerable: true, get: function () { return section_schema_1.validateMetadataSection; } });
var state_schema_1 = require("./schemas/state-schema");
Object.defineProperty(exports, "metadataStateSchema", { enumerable: true, get: function () { return state_schema_1.metadataStateSchema; } });
Object.defineProperty(exports, "resolveMetadataState", { enumerable: true, get: function () { return state_schema_1.resolveMetadataState; } });
var surface_schema_1 = require("./schemas/surface-schema");
Object.defineProperty(exports, "validateMetadataSurface", { enumerable: true, get: function () { return surface_schema_1.validateMetadataSurface; } });
var section_types_1 = require("./sections/section-types");
Object.defineProperty(exports, "governedMetadataSectionTypes", { enumerable: true, get: function () { return section_types_1.governedMetadataSectionTypes; } });
