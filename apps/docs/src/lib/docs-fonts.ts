import { Source_Sans_3, Source_Serif_4 } from "next/font/google";

/** Must stay aligned with `docs-fonts.constants.ts` — see `docsFontVariableLiterals`. */
export const docsBodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-docs-body",
  display: "swap",
});

/** Must stay aligned with `docs-fonts.constants.ts` — see `docsFontVariableLiterals`. */
export const docsDisplayFont = Source_Serif_4({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-docs-display",
  display: "swap",
});

export const docsFontClassNames = `${docsBodyFont.variable} ${docsDisplayFont.variable}`;
