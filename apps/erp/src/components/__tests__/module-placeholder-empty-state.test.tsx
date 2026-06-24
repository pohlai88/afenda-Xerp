import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ModulePlaceholderEmptyState } from "@/components/module-placeholder-empty-state";
import { resolveModulePlaceholderCopy } from "@/lib/modules/resolve-module-placeholder-copy";

describe("ModulePlaceholderEmptyState", () => {
  it("renders standard module placeholder copy with governed Card empty state", () => {
    const copy = resolveModulePlaceholderCopy({
      moduleId: "hrm",
      label: "HRM",
    });

    const { container } = render(<ModulePlaceholderEmptyState copy={copy} />);

    expect(screen.getByText("HRM")).toBeInTheDocument();
    expect(screen.getByText(copy.domainBody)).toBeInTheDocument();
    expect(container.querySelector(".erp-empty-state")).not.toBeNull();
    expect(
      container.querySelector('[data-empty-state-variant="standard"]')
    ).not.toBeNull();
  });

  it("renders accounting shell-only variant without domain UI", () => {
    const copy = resolveModulePlaceholderCopy({
      moduleId: "accounting",
      label: "Accounting",
    });

    const { container } = render(<ModulePlaceholderEmptyState copy={copy} />);

    expect(
      container.querySelector('[data-empty-state-variant="accounting"]')
    ).not.toBeNull();
    expect(
      screen.getByText(/Phase 9 Accounting Readiness Gate/i)
    ).toBeInTheDocument();
  });
});
