/**
 * MDX-only Prettier config. Biome/Ultracite owns JS/TS/JSON/CSS.
 * @see https://biomejs.dev/guides/migrate-eslint-prettier/
 * @type {import("prettier").Config}
 */
const config = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  endOfLine: "lf",
  proseWrap: "preserve",
  overrides: [
    {
      files: ["**/*.mdx"],
      options: {
        parser: "mdx",
      },
    },
  ],
};

export default config;
