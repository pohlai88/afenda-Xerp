import { describe, expect, it } from "vitest";
import { getMDXComponents } from "@/components/mdx";
import { baseOptions } from "@/lib/layout.shared";

describe("@afenda/docs routes", () => {
  it("exposes Afenda branding in shared layout options", () => {
    const options = baseOptions();

    expect(options.nav?.title).toBe("Afenda Docs");
  });

  it("merges default MDX components without losing Fumadocs link primitive", () => {
    const components = getMDXComponents();

    expect(components.a).toBeDefined();
  });
});
