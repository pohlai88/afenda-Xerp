import { AUTH_SHELL_SLOTS } from "@afenda/shadcn-studio-v2";
import { StudioPresentationProviders } from "@afenda/shadcn-studio-v2/clients";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { v2ProofAuthFixture } from "@/lib/v2-proof/fixtures";
import {
  DEFAULT_V2_PROOF_SURFACE_VISIBILITY,
  mergeSurfaceVisibility,
  parseStoredSurfaceVisibility,
  parseV2ProofSearchParams,
} from "@/lib/v2-proof/surface-visibility";
import { V2ProofRoute } from "../_components/v2-proof-route.client";

describe("v2-proof surface visibility parsing", () => {
  it("defaults auth shell off", () => {
    expect(DEFAULT_V2_PROOF_SURFACE_VISIBILITY.authShell).toBe(false);
  });

  it("parses verify=1 as all surfaces on", () => {
    expect(parseV2ProofSearchParams({ verify: "1" })).toEqual({
      authShell: true,
    });
  });

  it("parses surfaces=auth", () => {
    expect(parseV2ProofSearchParams({ surfaces: "auth" })).toEqual({
      authShell: true,
    });
  });

  it("merges partial overrides without dropping unspecified keys", () => {
    expect(
      mergeSurfaceVisibility(DEFAULT_V2_PROOF_SURFACE_VISIBILITY, {
        authShell: true,
      })
    ).toEqual({ authShell: true });
  });

  it("ignores invalid stored JSON", () => {
    expect(parseStoredSurfaceVisibility("{not-json")).toBeUndefined();
  });
});

describe("Phase 8 V2 proof route verification surfaces", () => {
  it("renders AuthShell when testSurfaceOverrides enable authShell", () => {
    render(
      <StudioPresentationProviders storageKey={null}>
        <V2ProofRoute testSurfaceOverrides={{ authShell: true }} />
      </StudioPresentationProviders>
    );

    expect(
      screen.getByRole("heading", { name: v2ProofAuthFixture.title })
    ).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByText("Continue (fixture)")).toBeTruthy();
    expect(
      screen.getByText("Static fixture — no session or OAuth")
    ).toBeTruthy();

    const authRoot = document.querySelector(
      `[data-slot="${AUTH_SHELL_SLOTS.root}"]`
    );
    expect(authRoot).toBeTruthy();
  });
});
