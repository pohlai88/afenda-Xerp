import {
  AUTH_SHELL_SLOTS,
  DATA_TABLE_SURFACE_SLOTS,
  EVIDENCE_WIDGET_SLOTS,
  FORM_SURFACE_SLOTS,
  METRIC_WIDGET_SLOTS,
  PAGE_SURFACE_SLOTS,
} from "@afenda/shadcn-studio-v2";
import { StudioPresentationProviders } from "@afenda/shadcn-studio-v2/clients";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { v2ProofStateMatrixMeta } from "@/lib/v2-proof/fixtures";
import { V2ProofRoute } from "../_components/v2-proof-route.client";

const NON_READY_STATE_MARKERS = [
  {
    proofState: "page-loading",
    slot: PAGE_SURFACE_SLOTS.state,
    state: "loading",
  },
  {
    proofState: "page-error",
    slot: PAGE_SURFACE_SLOTS.state,
    state: "error",
  },
  {
    proofState: "metric-empty",
    slot: METRIC_WIDGET_SLOTS.state,
    state: "empty",
  },
  {
    proofState: "metric-unavailable",
    slot: METRIC_WIDGET_SLOTS.state,
    state: "unavailable",
  },
  {
    proofState: "evidence-loading",
    slot: EVIDENCE_WIDGET_SLOTS.state,
    state: "loading",
  },
  {
    proofState: "evidence-error",
    slot: EVIDENCE_WIDGET_SLOTS.state,
    state: "error",
  },
  {
    proofState: "data-table-empty",
    slot: DATA_TABLE_SURFACE_SLOTS.state,
    state: "empty",
  },
  {
    proofState: "form-unavailable",
    slot: FORM_SURFACE_SLOTS.state,
    state: "unavailable",
  },
  {
    proofState: "auth-shell-loading",
    slot: AUTH_SHELL_SLOTS.state,
    state: "loading",
  },
] as const;

describe("Phase 8 V2 proof route state matrix", () => {
  it("documents and renders the Lane A-08 non-ready state matrix", () => {
    render(
      <StudioPresentationProviders storageKey={null}>
        <V2ProofRoute />
      </StudioPresentationProviders>
    );

    expect(screen.getByText(v2ProofStateMatrixMeta.title)).toBeTruthy();
    expect(document.querySelector('[data-proof="state-matrix"]')).toBeTruthy();

    for (const { proofState, slot, state } of NON_READY_STATE_MARKERS) {
      const section = document.querySelector(
        `[data-proof-state="${proofState}"]`
      );

      expect(section).toBeTruthy();
      expect(section?.querySelector(`[data-slot="${slot}"]`)).toBeTruthy();
      expect(section?.querySelector(`[data-state="${state}"]`)).toBeTruthy();
    }
  });

  it("keeps auth shell loading matrix separate from the optional auth preview", () => {
    render(
      <StudioPresentationProviders storageKey={null}>
        <V2ProofRoute />
      </StudioPresentationProviders>
    );

    expect(
      document.querySelector('[data-v2-proof-surface="auth-shell-matrix"]')
    ).toBeTruthy();
    expect(
      document.querySelector('[data-proof="auth-shell-preview"]')
    ).toBeNull();
    expect(screen.getByText("Auth matrix — loading")).toBeTruthy();
  });
});
