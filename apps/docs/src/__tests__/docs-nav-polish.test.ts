import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsBuildAfendaSection, docsGuidesFolderGroup } from "@/lib/docs-nav.contract";
import { docsDraftTreeFilterPlugin } from "@/lib/docs-draft-tree-filter.plugin";
import { docsDefaultLocale, docsLocales } from "@/lib/i18n";

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

  it("adds Lucide icon keys to en build-afenda and legacy locale guides meta.json", () => {
    const enBuildAfendaMeta = JSON.parse(
      readFileSync(
        join(appRoot, "content/docs/en", docsBuildAfendaSection, "meta.json"),
        "utf8"
      )
    ) as { icon?: string; pages: string[] };

    expect(enBuildAfendaMeta.icon).toBe("Rocket");
    expect(enBuildAfendaMeta.pages).toContain("apps");

    for (const locale of docsLocales) {
      if (locale === docsDefaultLocale) {
        continue;
      }

      const guidesMeta = JSON.parse(
        readFileSync(
          join(appRoot, "content/docs", locale, `${docsGuidesFolderGroup}/meta.json`),
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
      expect(guidesMeta.pages).toContain("---Contributing---");
      expect(guidesMeta.pages).not.toContain("api-reference");
    }
  });

  it("adds section icons and collapses internal-v1 by default", () => {
    const enBuildAfendaSectionIcons: Record<string, string> = {
      "getting-started": "BookOpen",
      "monorepo-map": "Map",
      contributing: "PenLine",
    };

    for (const [sectionId, icon] of Object.entries(enBuildAfendaSectionIcons)) {
      const meta = JSON.parse(
        readFileSync(
          join(
            appRoot,
            "content/docs/en",
            docsBuildAfendaSection,
            sectionId,
            "meta.json"
          ),
          "utf8"
        )
      ) as { icon?: string };

      expect(meta.icon).toBe(icon);
    }

    for (const locale of docsLocales) {
      const internalV1Meta = JSON.parse(
        readFileSync(
          join(
            appRoot,
            "content/docs",
            locale,
            "integrate/internal-v1/meta.json"
          ),
          "utf8"
        )
      ) as { defaultOpen?: boolean; icon?: string };

      expect(internalV1Meta.defaultOpen).toBe(false);
      expect(internalV1Meta.icon).toBe("Code");
    }
  });

  it("adds Lucide icons to apps subsection meta.json", () => {
    const appSectionIcons: Record<string, string> = {
      erp: "Building2",
      docs: "FileText",
      storybook: "Palette",
    };

    for (const locale of docsLocales) {
      const appsRoot =
        locale === docsDefaultLocale
          ? join("content/docs/en", docsBuildAfendaSection, "apps")
          : join("content/docs", locale, "apps");

      for (const [sectionId, icon] of Object.entries(appSectionIcons)) {
        const metaPath = join(appRoot, appsRoot, sectionId, "meta.json");
        if (!existsSync(metaPath)) {
          continue;
        }

        const meta = JSON.parse(readFileSync(metaPath, "utf8")) as {
          icon?: string;
        };

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
    expect(sourceConfig).toContain(
      "catalogBindings: z.array(z.enum(CATALOG_IDS)).optional()"
    );
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
