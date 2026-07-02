/**
 * Args-first Storybook controls — callback arg names + autogen argTypes snippets.
 */

/** @typedef {{ tier: string; compound: boolean; interaction: string }} ArgTypesSpec */
export function requiresArgTypes(spec) {
  return (
    (spec.tier === "gold" || spec.tier === "silver") &&
    !spec.compound &&
    (spec.interaction === "click-toggles" ||
      spec.interaction === "input-updates")
  );
}

/** @param {string} slug */
export function callbackArgName(slug) {
  const bySlug = {
    button: "onClick",
    checkbox: "onCheckedChange",
    input: "onChange",
    switch: "onCheckedChange",
    toggle: "onPressedChange",
    slider: "onValueChange",
    textarea: "onChange",
  };

  return bySlug[slug];
}

/** @param {string} slug */
export function argTypesImportName(slug) {
  const bySlug = {
    button: "buttonStoryArgTypes",
    checkbox: "checkboxStoryArgTypes",
    input: "inputStoryArgTypes",
    switch: "switchStoryArgTypes",
    toggle: "toggleStoryArgTypes",
  };

  return bySlug[slug];
}

/** @param {string} slug */
export function argTypesMetaField(slug) {
  const importName = argTypesImportName(slug);
  if (!importName) {
    return "";
  }

  return `  argTypes: ${importName},`;
}

/** @param {string} slug */
export function defaultArgsWithFn(slug, baseArgsLiteral) {
  const callback = callbackArgName(slug);
  if (!callback) {
    return baseArgsLiteral;
  }

  const trimmed = baseArgsLiteral.trim();
  if (trimmed === "{}") {
    return `{ ${callback}: fn() }`;
  }

  return trimmed.replace(/^\{/, `{ ${callback}: fn(), `);
}
