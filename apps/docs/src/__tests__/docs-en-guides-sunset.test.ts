import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsGuidesFolderGroup } from "@/lib/docs-nav.contract";
import { docsDefaultLocale } from "@/lib/i18n";

describe("@afenda/docs English (guides) sunset", () => {
  it("does not ship duplicate en/(guides) content — redirects cover legacy URLs", () => {
    const guidesRoot = join(
      process.cwd(),
      "content/docs",
      docsDefaultLocale,
      docsGuidesFolderGroup
    );

    expect(existsSync(guidesRoot)).toBe(false);
  });
});
