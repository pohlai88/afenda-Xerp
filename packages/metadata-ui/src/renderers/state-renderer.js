"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMetadataStatePresentation = void 0;
var design_system_1 = require("@afenda/design-system");
var resolveMetadataStatePresentation = function (state) { return ({
    recipe: "status-state",
    recipeAvailable: design_system_1.recipeRegistry.recipes.some(function (recipe) { return recipe.name === "status-state"; }),
    state: state,
}); };
exports.resolveMetadataStatePresentation = resolveMetadataStatePresentation;
