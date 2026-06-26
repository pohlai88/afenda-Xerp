import { describe, expect, it } from "vitest";
import {
  collectDocsContentPages,
  docsPageRefToLocalizedUrl,
  docsPageRefToValidationUrl,
  extractHeadingHashes,
  parseDocsContentPageRef,
} from "../../scripts/docs-link-utils";

describe("docs link path utilities", () => {
  const appRoot = process.cwd();

  it("maps locale MDX paths to docs slugs without route groups", () => {
    const page = parseDocsContentPageRef(
      appRoot,
      `${appRoot}/content/docs/en/build-afenda/getting-started/index.mdx`
    );

    expect(page).toMatchObject({
      lang: "en",
      slug: ["build-afenda", "getting-started"],
    });
    expect(docsPageRefToLocalizedUrl(page!)).toBe(
      "/en/docs/build-afenda/getting-started"
    );
    expect(docsPageRefToValidationUrl(page!)).toBe(
      "/en/docs/build-afenda/getting-started/index"
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
      "../../scripts/validate-docs-links"
    );
    await expect(validateDocsLinks(process.cwd())).resolves.toBeUndefined();
  }, 60_000);
});
