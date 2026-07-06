import { StudioPresentationProviders } from "@afenda/shadcn-studio-v2/clients";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { V2_PROOF_ROUTE_MARKER } from "@/lib/v2-proof/fixtures";
import { V2ProofRoute } from "../_components/v2-proof-route.client";

describe("Phase 8 V2 proof route", () => {
  it("renders required surface markers with static fixture copy", () => {
    render(
      <StudioPresentationProviders storageKey={null}>
        <V2ProofRoute />
      </StudioPresentationProviders>
    );

    expect(screen.getByText(V2_PROOF_ROUTE_MARKER)).toBeTruthy();
    expect(screen.getByText("V2 design system consumer proof")).toBeTruthy();
    expect(screen.getByText("Page surface pattern")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Open records" })).toBeTruthy();
    expect(screen.getByText("Active backlog")).toBeTruthy();
    expect(screen.getByText("Record form")).toBeTruthy();
    expect(screen.getByText("Archive record?")).toBeTruthy();
    expect(screen.getByText("Workspace settings")).toBeTruthy();
    expect(screen.getByText("Evidence checkpoint")).toBeTruthy();
    expect(screen.getByLabelText("Theme customizer")).toBeTruthy();
    expect(screen.getByLabelText("Toggle color mode")).toBeTruthy();
  });
});
