import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { isDocsFeedbackConfigured, resolveDocsGithubAppPrivateKey } from "@/lib/docs-github-feedback-env";

const appRoot = process.cwd();
const localesDir = join(appRoot, "src/lib/i18n/locales");

describe("@afenda/docs feedback integration", () => {
  it("ships feedback schema and client components", () => {
    expect(existsSync(join(appRoot, "src/components/feedback/schema.ts"))).toBe(
      true
    );
    expect(existsSync(join(appRoot, "src/components/feedback/client.tsx"))).toBe(
      true
    );

    const clientSource = readFileSync(
      join(appRoot, "src/components/feedback/client.tsx"),
      "utf8"
    );

    expect(clientSource).toContain("export function Feedback");
    expect(clientSource).toContain("export function FeedbackText");
    expect(clientSource).toContain('data-block="feedback"');
  });

  it("wires remarkBlockId and FeedbackText on the docs slug page", () => {
    const slugPage = readFileSync(
      join(appRoot, "src/app/[lang]/docs/[[...slug]]/page.tsx"),
      "utf8"
    );
    const sourceConfig = readFileSync(
      join(appRoot, "source.config.ts"),
      "utf8"
    );

    expect(sourceConfig).toContain("remarkBlockId");
    expect(sourceConfig).toContain('addDataAttribute: "feedback"');
    expect(slugPage).toContain("FeedbackText");
    expect(slugPage).toContain("Feedback");
    expect(slugPage).toContain("onPageFeedbackAction");
    expect(slugPage).toContain("onBlockFeedbackAction");
  });

  it("forwards feedback to GitHub Discussions when app credentials are set", () => {
    const feedbackServer = readFileSync(
      join(appRoot, "src/lib/docs-github-feedback.server.ts"),
      "utf8"
    );

    expect(feedbackServer).toContain('"use server"');
    expect(feedbackServer).toContain("createDiscussionThread");
    expect(feedbackServer).toContain("docsGithubFeedbackCategory");
    expect(feedbackServer).toContain("docsGithubRepository");
  });

  it("normalizes env-sync double-escaped PEM newlines", () => {
    expect(
      resolveDocsGithubAppPrivateKey({
        DOCS_GITHUB_APP_PRIVATE_KEY:
          '"-----BEGIN RSA PRIVATE KEY-----\\\\nline\\\\n-----END RSA PRIVATE KEY-----"',
      })
    ).toBe("-----BEGIN RSA PRIVATE KEY-----\nline\n-----END RSA PRIVATE KEY-----");

    expect(
      resolveDocsGithubAppPrivateKey({
        DOCS_GITHUB_APP_PRIVATE_KEY:
          "-----BEGIN RSA PRIVATE KEY-----\\nline\\n-----END RSA PRIVATE KEY-----",
      })
    ).toBe("-----BEGIN RSA PRIVATE KEY-----\nline\n-----END RSA PRIVATE KEY-----");

    expect(
      resolveDocsGithubAppPrivateKey({
        DOCS_GITHUB_APP_PRIVATE_KEY:
          "-----BEGIN RSA PRIVATE KEY-----\\\nline\\\n-----END RSA PRIVATE KEY-----",
      })
    ).toBe("-----BEGIN RSA PRIVATE KEY-----\nline\n-----END RSA PRIVATE KEY-----");
  });

  it("treats feedback as optional when GitHub App env is absent", () => {
    expect(
      isDocsFeedbackConfigured({
        DOCS_GITHUB_APP_ID: undefined,
        DOCS_GITHUB_APP_PRIVATE_KEY: undefined,
      })
    ).toBe(false);

    expect(
      isDocsFeedbackConfigured({
        DOCS_GITHUB_APP_ID: "12345",
        DOCS_GITHUB_APP_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----",
      })
    ).toBe(true);
  });

  it("localizes feedback copy from locale JSON", () => {
    const enCopy = readFileSync(join(localesDir, "en.json"), "utf8");
    const zhCopy = readFileSync(join(localesDir, "zh.json"), "utf8");

    expect(enCopy).toContain("How is this guide?");
    expect(zhCopy).toContain("这篇指南对您有帮助吗？");
  });
});
