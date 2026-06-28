import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DocsIdentityBlock } from "@/components/blocks/docs-identity-block";

describe("DocsIdentityBlock", () => {
  it("renders application identity metadata rows", () => {
    render(
      <DocsIdentityBlock
        owner="Application Authority"
        packageName="@afenda/erp"
        path="apps/erp/"
        pkgCode="PKG-007"
        port={3000}
      />
    );

    expect(screen.getByText("Package")).toBeVisible();
    expect(screen.getByText("@afenda/erp")).toBeVisible();
    expect(screen.getByText("3000")).toBeVisible();
    expect(screen.getByText("PKG-007")).toBeVisible();
  });
});
