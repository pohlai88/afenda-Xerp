import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

const docsSlugPageSource = readFileSync(
  join(process.cwd(), "src/app/[lang]/docs/[[...slug]]/page.tsx"),
  "utf8"
);

const { getGithubLastEditMock } = vi.hoisted(() => ({
  getGithubLastEditMock: vi.fn(),
}));

vi.mock("fumadocs-core/content/github", () => ({
  getGithubLastEdit: getGithubLastEditMock,
}));

import { resolveDocsGithubLastModified } from "@/lib/docs-github.server";
import { resolveDocsLastModified } from "@/lib/docs-last-modified.server";
import type { DocsPage } from "@/lib/docs-page";

function stubPage(lastModified?: Date): DocsPage {
  return {
    data: {
      title: "Test",
      ...(lastModified ? { lastModified } : {}),
    },
  } as DocsPage;
}

describe("@afenda/docs last modified resolution", () => {
  it("wires resolveDocsLastModified and PageLastUpdate on the docs slug page", () => {
    expect(docsSlugPageSource).toContain('from "@/lib/docs-last-modified.server"');
    expect(docsSlugPageSource).toContain("resolveDocsLastModified");
    expect(docsSlugPageSource).toContain("PageLastUpdate");
    expect(docsSlugPageSource).toMatch(/date=\{lastModified\}/);
    expect(docsSlugPageSource).not.toContain("getGithubLastEdit");
  });

  it("prefers git plugin lastModified without calling GitHub", async () => {
    getGithubLastEditMock.mockClear();
    const gitDate = new Date("2026-05-01T12:00:00.000Z");

    await expect(
      resolveDocsLastModified(
        stubPage(gitDate),
        "getting-started/index.mdx",
        "en",
        { NODE_ENV: "production", DOCS_GITHUB_TOKEN: "ghp_example" }
      )
    ).resolves.toEqual(gitDate);

    expect(getGithubLastEditMock).not.toHaveBeenCalled();
  });

  it("falls back to GitHub REST when plugin timestamp is absent", async () => {
    getGithubLastEditMock.mockResolvedValue(new Date("2026-06-01T00:00:00.000Z"));

    const result = await resolveDocsLastModified(
      stubPage(),
      "getting-started/index.mdx",
      "en",
      {
        NODE_ENV: "production",
        DOCS_GITHUB_TOKEN: "ghp_example",
      }
    );

    expect(result).toEqual(new Date("2026-06-01T00:00:00.000Z"));
    expect(getGithubLastEditMock).toHaveBeenCalledOnce();
  });

  it("returns undefined in development without calling GitHub when git metadata absent", async () => {
    getGithubLastEditMock.mockClear();

    await expect(
      resolveDocsLastModified(stubPage(), "getting-started/index.mdx", "en", {
        NODE_ENV: "development",
      })
    ).resolves.toBeUndefined();

    expect(getGithubLastEditMock).not.toHaveBeenCalled();
  });

  it("passes repository coordinates, branch, and token in production fallback", async () => {
    getGithubLastEditMock.mockResolvedValue(new Date("2026-06-01T00:00:00.000Z"));

    const result = await resolveDocsGithubLastModified(
      "getting-started/index.mdx",
      "en",
      {
        NODE_ENV: "production",
        DOCS_GITHUB_TOKEN: "ghp_example",
      }
    );

    expect(result).toEqual(new Date("2026-06-01T00:00:00.000Z"));
    expect(getGithubLastEditMock).toHaveBeenCalledWith({
      owner: "pohlai88",
      repo: "afenda-Xerp",
      path: "apps/docs/content/docs/en/getting-started/index.mdx",
      sha: "main",
      token: "Bearer ghp_example",
    });
  });

  it("passes custom GitHub Enterprise base URL when configured", async () => {
    getGithubLastEditMock.mockResolvedValue(null);

    await resolveDocsGithubLastModified("index.mdx", "zh", {
      NODE_ENV: "production",
      DOCS_GITHUB_API_BASE_URL: "https://api.octocorp.ghe.com",
    });

    expect(getGithubLastEditMock).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl: "https://api.octocorp.ghe.com",
      })
    );
  });
});
