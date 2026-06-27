import { Inter, Newsreader } from "next/font/google";

/** Must stay aligned with `docs-fonts.constants.ts` — see `docsFontVariableLiterals`. */
export const docsBodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-docs-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

/** Must stay aligned with `docs-fonts.constants.ts` — see `docsFontVariableLiterals`. */
export const docsDisplayFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-docs-display",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const docsFontClassNames = `${docsBodyFont.variable} ${docsDisplayFont.variable}`;
