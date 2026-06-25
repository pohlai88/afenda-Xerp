import { describe, expect, it } from "vitest";
import {
  buildGithubBlobUrl,
  docsGithubRepository,
} from "@/lib/docs-github.constants";

describe("@afenda/docs GitHub constants", () => {
  it("exposes serializable repository coordinates", () => {
    expect(docsGithubRepository.owner).toBe("pohlai88");
    expect(docsGithubRepository.repo).toBe("afenda-Xerp");
    expect(docsGithubRepository.contentPathPrefix).toBe(
      "apps/docs/content/docs"
    );
  });

  it("builds blob URLs from content-relative paths", () => {
    const url = buildGithubBlobUrl("(guides)/getting-started/installation.mdx");

    expect(url).toBe(
      "https://github.com/pohlai88/afenda-Xerp/blob/main/apps/docs/content/docs/(guides)/getting-started/installation.mdx"
    );
  });
});
