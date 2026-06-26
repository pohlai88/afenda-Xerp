import { describe, expect, it } from "vitest";
import {
  defaultGithubApiBaseUrl,
  resolveDocsGithubApiBaseUrl,
  resolveDocsGithubApiToken,
  shouldResolveDocsGithubLastModified,
} from "@/lib/docs-github-env";

describe("@afenda/docs GitHub env", () => {
  it("skips last-edit lookup in development", () => {
    expect(shouldResolveDocsGithubLastModified({ NODE_ENV: "development" })).toBe(
      false
    );
    expect(shouldResolveDocsGithubLastModified({ NODE_ENV: "production" })).toBe(
      true
    );
  });

  it("normalizes DOCS_GITHUB_TOKEN to a Bearer authorization value", () => {
    expect(resolveDocsGithubApiToken({})).toBeUndefined();
    expect(
      resolveDocsGithubApiToken({ DOCS_GITHUB_TOKEN: "ghp_example" })
    ).toBe("Bearer ghp_example");
    expect(
      resolveDocsGithubApiToken({
        DOCS_GITHUB_TOKEN: "Bearer ghp_example",
      })
    ).toBe("Bearer ghp_example");
  });

  it("defaults GitHub API base URL to github.com", () => {
    expect(resolveDocsGithubApiBaseUrl({})).toBe(defaultGithubApiBaseUrl);
    expect(
      resolveDocsGithubApiBaseUrl({
        DOCS_GITHUB_API_BASE_URL: "https://api.octocorp.ghe.com",
      })
    ).toBe("https://api.octocorp.ghe.com");
  });
});
