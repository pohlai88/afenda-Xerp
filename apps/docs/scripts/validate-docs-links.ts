import { relative } from "node:path";
import {
  printErrors,
  readFileFromPath,
  scanURLs,
  validateFiles,
} from "next-validate-link";
import {
  collectDocsContentPages,
  docsPageRefToLocalizedUrl,
  docsPageRefToNeutralUrl,
  docsPageRefToValidationUrl,
  extractHeadingHashes,
} from "./docs-link-utils.ts";

export async function validateDocsLinks(appRoot: string): Promise<void> {
  const pages = collectDocsContentPages(appRoot);

  const scanned = await scanURLs({
    preset: "next",
    cwd: appRoot,
    populate: {
      "[lang]/docs/[[...slug]]": pages.map((page) => ({
        value: {
          lang: page.lang,
          slug: [...page.slug],
        },
        hashes: extractHeadingHashes(page.content),
      })),
    },
  });

  for (const page of pages) {
    scanned.urls.set(docsPageRefToLocalizedUrl(page), {});
    scanned.urls.set(docsPageRefToNeutralUrl(page), {});
  }

  const files = await Promise.all(
    pages.map((page) => {
      const relativePath = relative(appRoot, page.absolutePath).replaceAll(
        "\\",
        "/"
      );
      return readFileFromPath(relativePath, () =>
        docsPageRefToValidationUrl(page)
      );
    })
  );

  printErrors(
    await validateFiles(files, {
      scanned,
      markdown: {
        components: {
          Card: { attributes: ["href"] },
        },
      },
      checkRelativePaths: "as-url",
    }),
    true
  );
}
