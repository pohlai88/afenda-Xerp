/**
 * Prettier for MDX + Tailwind v4 CSS. Biome/Ultracite owns JS/TS/JSON.
 *
 * CSS uses Prettier because Biome's Tailwind v4 parser is opt-in
 * (`css.parser.tailwindDirectives`) and fails on @theme/@apply/@custom-variant
 * without it — breaking format-on-save and `biome ci` on theme CSS.
 *
 * @see scripts/governance/biome-editor-policy.mjs
 * @type {import("prettier").Config}
 */
const config = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  endOfLine: "lf",
  proseWrap: "preserve",
  plugins: ["prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: ["**/*.mdx"],
      options: {
        parser: "mdx",
      },
    },
    {
      files: ["**/*.css"],
      options: {},
    },
  ],
};

export default config;
