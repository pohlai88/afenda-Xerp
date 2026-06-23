import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PolicyGateSurface } from "@/components/policy-gate-surface.client";

describe("PolicyGateSurface", () => {
  it("renders inline approval gate copy", () => {
    render(
      <PolicyGateSurface
        correlationId="corr-inline-1"
        gateDecision="require_approval"
        message="Custom approval message."
        variant="inline"
      />
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Approval required")).toBeInTheDocument();
    expect(screen.getByText("Custom approval message.")).toBeInTheDocument();
    expect(screen.getByText("Request approval")).toBeInTheDocument();
    expect(screen.getByText("corr-inline-1")).toBeInTheDocument();
  });

  it("renders readonly gate without primary action", () => {
    render(<PolicyGateSurface gateDecision="readonly" variant="inline" />);

    expect(screen.getByText("Read-only access")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Request approval" })
    ).toBeNull();
  });

  it("renders dialog gate when open", () => {
    render(
      <PolicyGateSurface
        gateDecision="require_evidence"
        open
        variant="dialog"
      />
    );

    expect(screen.getByText("Evidence required")).toBeInTheDocument();
    expect(screen.getByText("Attach evidence")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });
});
