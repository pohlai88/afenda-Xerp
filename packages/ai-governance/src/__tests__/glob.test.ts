import { describe, expect, it } from "vitest";
import {
  matchesGlob,
  normalizeRepoPath,
  pathMatchesAnyGlob,
} from "../utils/glob.js";

describe("normalizeRepoPath", () => {
  it("converts backslashes to forward slashes", () => {
    expect(normalizeRepoPath("packages\\ai-governance\\src\\index.ts")).toBe(
      "packages/ai-governance/src/index.ts"
    );
  });

  it("strips a leading ./ segment", () => {
    expect(normalizeRepoPath("./docs/ai/README.md")).toBe("docs/ai/README.md");
  });
});

describe("matchesGlob", () => {
  describe("exact paths", () => {
    it("matches an identical path", () => {
      expect(matchesGlob("docs/ai/README.md", "docs/ai/README.md")).toBe(true);
    });

    it("rejects a different path", () => {
      expect(matchesGlob("docs/ai/README.md", "docs/adr/README.md")).toBe(false);
    });
  });

  describe("prefix /** suffix patterns", () => {
    it("matches nested files under a package prefix", () => {
      expect(
        matchesGlob(
          "packages/ai-governance/src/validators/validate-ai-governance.ts",
          "packages/ai-governance/**"
        )
      ).toBe(true);
    });

    it("matches the prefix directory itself", () => {
      expect(matchesGlob("packages/ai-governance", "packages/ai-governance/**")).toBe(
        true
      );
    });

    it("rejects paths outside the prefix", () => {
      expect(matchesGlob("packages/database/src/index.ts", "packages/ai-governance/**")).toBe(
        false
      );
    });

    it("does not treat prefix as a substring (packages vs packages-extra)", () => {
      expect(matchesGlob("packages-extra/foo.ts", "packages/**")).toBe(false);
    });

    it("matches sibling segments only when the prefix boundary aligns", () => {
      expect(matchesGlob("packages/ai-governance/foo.ts", "packages/**")).toBe(true);
    });
  });

  describe("broad scope globs used by AI-004-SCOPE", () => {
    it("matches any nested path for **/*", () => {
      expect(matchesGlob("docs/ai/README.md", "**/*")).toBe(true);
      expect(matchesGlob("packages/ai-governance/src/index.ts", "**/*")).toBe(true);
    });

    it("matches top-level files for **/*", () => {
      expect(matchesGlob("README.md", "**/*")).toBe(true);
    });

    it("matches any path under packages/**", () => {
      expect(matchesGlob("packages/storage/src/index.ts", "packages/**")).toBe(true);
    });

    it("matches any path under apps/**", () => {
      expect(matchesGlob("apps/erp/src/middleware.ts", "apps/**")).toBe(true);
    });

    it("matches any path under .github/**", () => {
      expect(matchesGlob(".github/workflows/ci.yml", ".github/**")).toBe(true);
    });
  });

  describe("single-segment wildcards", () => {
    it("matches a wildcard file extension within one segment", () => {
      expect(matchesGlob("packages/ai-governance/src/foo.ts", "packages/*/src/foo.ts")).toBe(
        true
      );
    });

    it("allows * to span multiple path segments", () => {
      expect(
        matchesGlob("packages/ai-governance/nested/src/foo.ts", "packages/*/src/foo.ts")
      ).toBe(true);
    });

    it("matches * as a whole path segment", () => {
      expect(matchesGlob("docs/ai/README.md", "docs/*/README.md")).toBe(true);
    });
  });

  describe("path normalization at match time", () => {
    it("normalizes Windows-style paths before matching", () => {
      expect(
        matchesGlob("packages\\ai-governance\\src\\index.ts", "packages/ai-governance/**")
      ).toBe(true);
    });

    it("normalizes leading ./ in both path and pattern", () => {
      expect(matchesGlob("./docs/ai/README.md", "./docs/ai/**")).toBe(true);
    });
  });

  describe("documented ** limitations", () => {
    it("evaluates only the first ** split when multiple appear", () => {
      const path = "packages/ai-governance/src/index.ts";
      const pattern = "packages/**/src/**";

      expect(matchesGlob(path, pattern)).toBe(false);
    });

    it("does not treat ** as recursive globstar between arbitrary directories", () => {
      expect(
        matchesGlob("packages/ai-governance/src/index.ts", "packages/**/index.ts")
      ).toBe(false);
    });

    it("matches suffix from the start of the remainder only", () => {
      expect(matchesGlob("packages/foo/bar.ts", "packages/**/bar.ts")).toBe(false);
    });
  });

  describe("adversarial inputs", () => {
    it("does not collapse .. segments (string prefix can still match)", () => {
      expect(matchesGlob("docs/ai/../erp/secret.ts", "docs/ai/**")).toBe(true);
      expect(matchesGlob("docs/erp/secret.ts", "docs/ai/**")).toBe(false);
    });

    it("rejects empty paths for exact patterns", () => {
      expect(matchesGlob("", "docs/ai/**")).toBe(false);
    });

    it("rejects paths that only share a partial prefix segment", () => {
      expect(matchesGlob("docs/ai-extra/README.md", "docs/ai/**")).toBe(false);
    });

    it("handles a trailing slash on the prefix pattern", () => {
      expect(matchesGlob("docs/ai/README.md", "docs/ai/**")).toBe(true);
    });
  });
});

describe("pathMatchesAnyGlob", () => {
  it("returns true when any pattern matches", () => {
    expect(
      pathMatchesAnyGlob("docs/ai/README.md", [
        "apps/erp/**",
        "docs/ai/**",
        "packages/database/**",
      ])
    ).toBe(true);
  });

  it("returns false when no pattern matches", () => {
    expect(
      pathMatchesAnyGlob("apps/erp/src/page.tsx", [
        "docs/ai/**",
        "packages/ai-governance/**",
      ])
    ).toBe(false);
  });

  it("returns false for an empty pattern list", () => {
    expect(pathMatchesAnyGlob("docs/ai/README.md", [])).toBe(false);
  });
});
