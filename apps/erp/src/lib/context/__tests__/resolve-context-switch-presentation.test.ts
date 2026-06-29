import { describe, expect, it } from "vitest";
import { resolveContextSwitchPresentation } from "@/lib/context/resolve-context-switch-presentation";

describe("resolveContextSwitchPresentation", () => {
  it("renders when more than one target is available", () => {
    const presentation = resolveContextSwitchPresentation({
      targets: [
        {
          companySlug: "company-a",
          label: "Company A",
          isSelected: true,
        },
        {
          companySlug: "company-b",
          label: "Company B",
          isSelected: false,
        },
      ],
    });

    expect(presentation.shouldRender).toBe(true);
    expect(presentation.copy.menuLabel).toBe("Switch workspace");
  });

  it("hides when only one target is available", () => {
    const presentation = resolveContextSwitchPresentation({
      targets: [
        {
          companySlug: "company-a",
          label: "Company A",
          isSelected: true,
        },
      ],
    });

    expect(presentation.shouldRender).toBe(false);
  });

  it("uses pending trigger copy while switching", () => {
    const presentation = resolveContextSwitchPresentation(
      {
        targets: [
          {
            companySlug: "company-a",
            label: "Company A",
            isSelected: true,
          },
          {
            companySlug: "company-b",
            label: "Company B",
            isSelected: false,
          },
        ],
      },
      { isPending: true }
    );

    expect(presentation.copy.triggerLabel).toBe("Switching workspace context…");
  });
});
