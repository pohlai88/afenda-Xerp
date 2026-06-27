import { existsSync, globSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateGeneratedMdxPolicy } from "@/lib/docs-content-policy";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";
import { docsDefaultLocale } from "@/lib/i18n";

const contentRoot = docsLocaleContentRoot(docsDefaultLocale);

function collectGeneratedFeatureEvidenceMdx(): string[] {
  const patterns = [
    join(contentRoot, "use-erp/modules/**/*.mdx"),
    join(contentRoot, "use-erp/auth-lanes.mdx"),
    join(contentRoot, "configure-tenant/generated/admin-sections.mdx"),
    join(contentRoot, "integrate/generated/evidence/**/*.mdx"),
  ];

  const files = new Set<string>();
  for (const pattern of patterns) {
    for (const file of globSync(pattern.replace(/\\/g, "/"))) {
      files.add(file);
    }
  }

  return [...files].sort();
}

describe("docs content policy — generated feature evidence", () => {
  it("enforces required headings on generated feature-evidence MDX", () => {
    const files = collectGeneratedFeatureEvidenceMdx();
    if (files.length === 0) {
      return;
    }

    const violations: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      if (!source.includes("DO NOT EDIT")) {
        continue;
      }
      const result = validateGeneratedMdxPolicy(source, file);
      violations.push(...result.violations);
    }

    expect(violations).toEqual([]);
  });

  it("validates inventory developer evidence when sync has run", () => {
    const inventoryEvidence = join(
      contentRoot,
      "integrate/generated/evidence/inventory.mdx"
    );
    if (!existsSync(inventoryEvidence)) {
      return;
    }

    const source = readFileSync(inventoryEvidence, "utf8");
    const result = validateGeneratedMdxPolicy(source, inventoryEvidence);

    expect(result.violations).toEqual([]);
    expect(source).toContain("## API operations");
  });
});
