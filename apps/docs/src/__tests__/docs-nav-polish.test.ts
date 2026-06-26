import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsDraftTreeFilterPlugin } from "@/lib/docs-draft-tree-filter.plugin";
import { docsLocales } from "@/lib/i18n";

const appRoot = process.cwd();

describe("@afenda/docs nav polish", () => {
  it("wires lucideIconsPlugin and draft tree filter in source loader", () => {
    const sourceText = readFileSync(
      join(appRoot, "src/lib/source.ts"),
      "utf8"
    );

    expect(sourceText).toContain("lucideIconsPlugin");
    expect(sourceText).toContain("docsDraftTreeFilterPlugin");
  });

  it("adds Lucide icon keys to guides and apps meta.json", () => {
    for (const locale of docsLocales) {
      const guidesMeta = JSON.parse(
        readFileSync(
          join(appRoot, "content/docs", locale, "(guides)/meta.json"),
          "utf8"
        )
      ) as { icon?: string; pages: string[] };
      const appsMeta = JSON.parse(
        readFileSync(
          join(appRoot, "content/docs", locale, "apps/meta.json"),
          "utf8"
        )
      ) as { icon?: string };

      expect(guidesMeta.icon).toBe("Rocket");
      expect(appsMeta.icon).toBe("Layers");
      expect(guidesMeta.pages).toContain("---Reference---");
      expect(guidesMeta.pages).toContain("---Contributing---");
    }
  });

  it("adds section icons and collapses api-reference by default", () => {
    const sectionIcons: Record<string, string> = {
      "getting-started": "BookOpen",
      "monorepo-map": "Map",
      "api-reference": "Code",
      contributing: "PenLine",
    };

    for (const locale of docsLocales) {
      for (const [sectionId, icon] of Object.entries(sectionIcons)) {
        const meta = JSON.parse(
          readFileSync(
            join(
              appRoot,
              "content/docs",
              locale,
              "(guides)",
              sectionId,
              "meta.json"
            ),
            "utf8"
          )
        ) as { icon?: string; defaultOpen?: boolean };

        expect(meta.icon).toBe(icon);
      }

      const apiReferenceMeta = JSON.parse(
        readFileSync(
          join(
            appRoot,
            "content/docs",
            locale,
            "(guides)/api-reference/meta.json"
          ),
          "utf8"
        )
      ) as { defaultOpen?: boolean };

      expect(apiReferenceMeta.defaultOpen).toBe(false);
    }
  });

  it("adds Lucide icons to apps subsection meta.json", () => {
    const appSectionIcons: Record<string, string> = {
      erp: "Building2",
      docs: "FileText",
      storybook: "Palette",
    };

    for (const locale of docsLocales) {
      for (const [sectionId, icon] of Object.entries(appSectionIcons)) {
        const meta = JSON.parse(
          readFileSync(
            join(appRoot, "content/docs", locale, "apps", sectionId, "meta.json"),
            "utf8"
          )
        ) as { icon?: string };

        expect(meta.icon).toBe(icon);
      }
    }
  });

  it("allows optional page frontmatter icon in source.config schema", () => {
    const sourceConfig = readFileSync(
      join(appRoot, "source.config.ts"),
      "utf8"
    );

    expect(sourceConfig).toContain("icon: z.string().optional()");
  });

  it("relies on DocsPage built-in prev/next footer without a duplicate custom footer", () => {
    const slugPage = readFileSync(
      join(appRoot, "src/app/[lang]/docs/[[...slug]]/page.tsx"),
      "utf8"
    );

    expect(slugPage).toContain("<DocsPage");
    expect(slugPage).not.toContain("DocsPageFooter");
  });

  it("hides draft pages from the page tree while leaving routes SSG-capable", () => {
    const plugin = docsDraftTreeFilterPlugin();
    const draftNode = {
      $id: "draft-page",
      type: "page" as const,
      name: "Draft",
      url: "/en/docs/draft",
      $ref: "en/(guides)/draft/index.mdx",
    };

    const storage = {
      read: (path: string) =>
        path.endsWith("draft/index.mdx")
          ? {
              format: "page" as const,
              data: { title: "Draft", status: "draft" },
            }
          : undefined,
    };

    const transformer = plugin.transformPageTree;
    expect(transformer).toBeDefined();

    const fileTransformer = transformer?.file;
    expect(fileTransformer).toBeDefined();

    const filtered = fileTransformer?.call(
      { storage } as never,
      draftNode,
      "en/(guides)/draft/index.mdx"
    );

    expect(filtered).toBeUndefined();
  });
});
