import { describe, expect, it } from "vitest";
import {
  collectDocsContentPages,
  docsPageRefToLocalizedUrl,
  docsPageRefToValidationUrl,
  extractHeadingHashes,
  parseDocsContentPageRef,
} from "../../scripts/docs-link-utils.ts";

describe("docs link path utilities", () => {
  const appRoot = process.cwd();

  it("maps locale MDX paths to docs slugs without route groups", () => {
    const page = parseDocsContentPageRef(
      appRoot,
      `${appRoot}/content/docs/en/(guides)/getting-started/index.mdx`
    );

    expect(page).toMatchObject({
      lang: "en",
      slug: ["getting-started"],
    });
    expect(docsPageRefToLocalizedUrl(page!)).toBe("/en/docs/getting-started");
    expect(docsPageRefToValidationUrl(page!)).toBe(
      "/en/docs/getting-started/index"
    );
  });

  it("extracts explicit and slugged heading anchors", () => {
    const hashes = extractHeadingHashes(`
## Setup [#setup]
### Details
## Running Lint [#running-lint]
`);

    expect(hashes).toEqual(["setup", "details", "running-lint"]);
  });

  it("collects all localized content pages", () => {
    const pages = collectDocsContentPages(appRoot);
    for (const locale of ["en", "zh", "vi", "ms", "id", "th", "fil"] as const) {
      expect(pages.some((page) => page.lang === locale)).toBe(true);
    }
  });
});

describe("docs link validation", () => {
  it("passes next-validate-link for all MDX content", async () => {
    const { validateDocsLinks } = await import(
      "../../scripts/validate-docs-links.ts"
    );
    await expect(validateDocsLinks(process.cwd())).resolves.toBeUndefined();
  });
});
