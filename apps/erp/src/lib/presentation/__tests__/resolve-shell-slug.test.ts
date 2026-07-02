import { describe, expect, it } from "vitest";

import { resolveShellSlugFromPathname } from "@/lib/presentation/resolve-shell-slug";

describe("resolveShellSlugFromPathname", () => {
  it("returns admincn for default operator routes", () => {
    expect(resolveShellSlugFromPathname("/workspace")).toBe("admincn");
    expect(
      resolveShellSlugFromPathname("/modules/procurement/requisitions")
    ).toBe("admincn");
  });

  it("returns crm-shell for future CRM module prefix", () => {
    expect(resolveShellSlugFromPathname("/modules/crm/contacts")).toBe(
      "crm-shell"
    );
  });

  it("returns ai-shell for future AI module prefix", () => {
    expect(resolveShellSlugFromPathname("/modules/ai/chat")).toBe("ai-shell");
  });
});
