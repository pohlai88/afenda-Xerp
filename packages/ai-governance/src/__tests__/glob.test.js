"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var glob_js_1 = require("../utils/glob.js");
(0, vitest_1.describe)("normalizeRepoPath", function () {
    (0, vitest_1.it)("converts backslashes to forward slashes", function () {
        (0, vitest_1.expect)((0, glob_js_1.normalizeRepoPath)("packages\\ai-governance\\src\\index.ts")).toBe("packages/ai-governance/src/index.ts");
    });
    (0, vitest_1.it)("strips a leading ./ segment", function () {
        (0, vitest_1.expect)((0, glob_js_1.normalizeRepoPath)("./docs/ai/README.md")).toBe("docs/ai/README.md");
    });
});
(0, vitest_1.describe)("matchesGlob", function () {
    (0, vitest_1.describe)("exact paths", function () {
        (0, vitest_1.it)("matches an identical path", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("docs/ai/README.md", "docs/ai/README.md")).toBe(true);
        });
        (0, vitest_1.it)("rejects a different path", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("docs/ai/README.md", "docs/adr/README.md")).toBe(false);
        });
    });
    (0, vitest_1.describe)("prefix /** suffix patterns", function () {
        (0, vitest_1.it)("matches nested files under a package prefix", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages/ai-governance/src/validators/validate-ai-governance.ts", "packages/ai-governance/**")).toBe(true);
        });
        (0, vitest_1.it)("matches the prefix directory itself", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages/ai-governance", "packages/ai-governance/**")).toBe(true);
        });
        (0, vitest_1.it)("rejects paths outside the prefix", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages/database/src/index.ts", "packages/ai-governance/**")).toBe(false);
        });
        (0, vitest_1.it)("does not treat prefix as a substring (packages vs packages-extra)", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages-extra/foo.ts", "packages/**")).toBe(false);
        });
        (0, vitest_1.it)("matches sibling segments only when the prefix boundary aligns", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages/ai-governance/foo.ts", "packages/**")).toBe(true);
        });
    });
    (0, vitest_1.describe)("broad scope globs used by AI-004-SCOPE", function () {
        (0, vitest_1.it)("matches any nested path for **/*", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("docs/ai/README.md", "**/*")).toBe(true);
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages/ai-governance/src/index.ts", "**/*")).toBe(true);
        });
        (0, vitest_1.it)("matches top-level files for **/*", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("README.md", "**/*")).toBe(true);
        });
        (0, vitest_1.it)("matches any path under packages/**", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages/storage/src/index.ts", "packages/**")).toBe(true);
        });
        (0, vitest_1.it)("matches any path under apps/**", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("apps/erp/src/middleware.ts", "apps/**")).toBe(true);
        });
        (0, vitest_1.it)("matches any path under .github/**", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)(".github/workflows/ci.yml", ".github/**")).toBe(true);
        });
    });
    (0, vitest_1.describe)("single-segment wildcards", function () {
        (0, vitest_1.it)("matches a wildcard file extension within one segment", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages/ai-governance/src/foo.ts", "packages/*/src/foo.ts")).toBe(true);
        });
        (0, vitest_1.it)("allows * to span multiple path segments", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages/ai-governance/nested/src/foo.ts", "packages/*/src/foo.ts")).toBe(true);
        });
        (0, vitest_1.it)("matches * as a whole path segment", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("docs/ai/README.md", "docs/*/README.md")).toBe(true);
        });
    });
    (0, vitest_1.describe)("path normalization at match time", function () {
        (0, vitest_1.it)("normalizes Windows-style paths before matching", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages\\ai-governance\\src\\index.ts", "packages/ai-governance/**")).toBe(true);
        });
        (0, vitest_1.it)("normalizes leading ./ in both path and pattern", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("./docs/ai/README.md", "./docs/ai/**")).toBe(true);
        });
    });
    (0, vitest_1.describe)("documented ** limitations", function () {
        (0, vitest_1.it)("evaluates only the first ** split when multiple appear", function () {
            var path = "packages/ai-governance/src/index.ts";
            var pattern = "packages/**/src/**";
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)(path, pattern)).toBe(false);
        });
        (0, vitest_1.it)("does not treat ** as recursive globstar between arbitrary directories", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages/ai-governance/src/index.ts", "packages/**/index.ts")).toBe(false);
        });
        (0, vitest_1.it)("matches suffix from the start of the remainder only", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("packages/foo/bar.ts", "packages/**/bar.ts")).toBe(false);
        });
    });
    (0, vitest_1.describe)("adversarial inputs", function () {
        (0, vitest_1.it)("does not collapse .. segments (string prefix can still match)", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("docs/ai/../erp/secret.ts", "docs/ai/**")).toBe(true);
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("docs/erp/secret.ts", "docs/ai/**")).toBe(false);
        });
        (0, vitest_1.it)("rejects empty paths for exact patterns", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("", "docs/ai/**")).toBe(false);
        });
        (0, vitest_1.it)("rejects paths that only share a partial prefix segment", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("docs/ai-extra/README.md", "docs/ai/**")).toBe(false);
        });
        (0, vitest_1.it)("handles a trailing slash on the prefix pattern", function () {
            (0, vitest_1.expect)((0, glob_js_1.matchesGlob)("docs/ai/README.md", "docs/ai/**")).toBe(true);
        });
    });
});
(0, vitest_1.describe)("pathMatchesAnyGlob", function () {
    (0, vitest_1.it)("returns true when any pattern matches", function () {
        (0, vitest_1.expect)((0, glob_js_1.pathMatchesAnyGlob)("docs/ai/README.md", [
            "apps/erp/**",
            "docs/ai/**",
            "packages/database/**",
        ])).toBe(true);
    });
    (0, vitest_1.it)("returns false when no pattern matches", function () {
        (0, vitest_1.expect)((0, glob_js_1.pathMatchesAnyGlob)("apps/erp/src/page.tsx", [
            "docs/ai/**",
            "packages/ai-governance/**",
        ])).toBe(false);
    });
    (0, vitest_1.it)("returns false for an empty pattern list", function () {
        (0, vitest_1.expect)((0, glob_js_1.pathMatchesAnyGlob)("docs/ai/README.md", [])).toBe(false);
    });
});
