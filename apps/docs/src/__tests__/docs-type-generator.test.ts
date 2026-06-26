import { describe, expect, it } from "vitest";
import {
  docsTypeGenerator,
  docsTypeTableOptions,
} from "@/lib/docs-type-generator";

describe("docs TypeScript docgen", () => {
  it("exports a shared generator with filesystem cache config", () => {
    expect(docsTypeGenerator.generateTypeTable).toBeTypeOf("function");
    expect(docsTypeTableOptions.basePath).toBe(".");
  });

  it("generates DocsPageParams from apps/docs src paths", async () => {
    const output = await docsTypeGenerator.generateTypeTable(
      {
        path: "./src/lib/docs-page.ts",
        name: "DocsPageParams",
      },
      docsTypeTableOptions
    );

    expect(output.length).toBeGreaterThan(0);
    const entryNames = output.flatMap((doc) =>
      doc.entries.map((entry) => entry.name)
    );
    expect(entryNames).toContain("lang");
    expect(entryNames).toContain("slug");
  });

  it("hides @internal fields from DocsGraphNodeData", async () => {
    const output = await docsTypeGenerator.generateTypeTable(
      {
        path: "./src/lib/docs-graph.types.ts",
        name: "DocsGraphNodeData",
      },
      docsTypeTableOptions
    );

    const entryNames = output.flatMap((doc) =>
      doc.entries.map((entry) => entry.name)
    );
    expect(entryNames).toContain("url");
    expect(entryNames).not.toContain("neighbors");
  });
});
