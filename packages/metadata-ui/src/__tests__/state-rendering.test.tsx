import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  sampleLoadingStateFixture,
  sampleLoadingStateRenderProps,
  sampleStateCatalog,
  sampleStateFixtures,
} from "../fixtures/sample-state.fixture.js";
import {
  MetadataDegradedState,
  MetadataEmptyState,
  MetadataErrorState,
  MetadataForbiddenState,
  MetadataInvalidState,
  MetadataLoadingState,
  MetadataMaintenanceState,
  MetadataPartialState,
  MetadataReadonlyState,
} from "../states/index.js";

describe("state rendering", () => {
  it("uses alert semantics for blocking runtime states", () => {
    render(<MetadataErrorState />);
    expect(screen.getByRole("alert", { name: /error/i })).toBeInTheDocument();

    const { unmount } = render(<MetadataForbiddenState />);
    expect(
      screen.getByRole("alert", { name: /forbidden/i })
    ).toBeInTheDocument();
    unmount();
  });

  it("uses status semantics for non-blocking runtime states", () => {
    render(<MetadataLoadingState />);
    expect(
      screen.getByRole("status", { name: /loading/i })
    ).toBeInTheDocument();
  });

  it("renders governed runtime diagnostics attributes", () => {
    render(<MetadataLoadingState />);

    expect(
      document.querySelector('[data-metadata-runtime-state="loading"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-metadata-state="loading"]')
    ).not.toBeNull();
    expect(document.querySelector(".metadata-state-loading")).not.toBeNull();
  });

  it("renders enterprise loading state fixture regions and diagnostics", () => {
    render(sampleLoadingStateFixture.element);

    expect(
      screen.getByRole("status", { name: /loading workspace/i })
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-fixture-region="state"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-fixture-region="hint"]')
    ).not.toBeNull();
    expect(
      document.querySelector('[data-renderer-key="metadata-ui.state.loading"]')
    ).not.toBeNull();
    expect(sampleLoadingStateFixture.state).toBe("loading");
    expect(sampleLoadingStateFixture.renderProps).toEqual(
      sampleLoadingStateRenderProps
    );
  });

  it("exposes governed sample state catalog without duplicates", () => {
    expect(sampleStateCatalog).toHaveLength(9);
    expect(new Set(sampleStateCatalog.map((entry) => entry.key)).size).toBe(9);
    expect(new Set(sampleStateCatalog.map((entry) => entry.state)).size).toBe(
      9
    );

    for (const key of sampleStateCatalog.map((entry) => entry.key)) {
      expect(sampleStateFixtures[key].key).toBe(key);
      expect(sampleStateFixtures[key].diagnosticsKey).toBe(
        `metadata-ui.state.${key}`
      );
    }
  });

  it("allows optional title and message overrides", () => {
    render(
      <MetadataErrorState
        message="Custom failure message."
        title="Custom error"
      />
    );

    expect(
      screen.getByRole("alert", { name: /custom error/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Custom failure message.")).toBeInTheDocument();
    expect(
      document.querySelector('[data-metadata-runtime-state="error"]')
    ).not.toBeNull();
  });

  it("covers all non-ready runtime state placeholders", () => {
    const states = [
      MetadataLoadingState,
      MetadataEmptyState,
      MetadataErrorState,
      MetadataForbiddenState,
      MetadataInvalidState,
      MetadataDegradedState,
      MetadataPartialState,
      MetadataReadonlyState,
      MetadataMaintenanceState,
    ] as const;

    expect(states).toHaveLength(9);

    for (const StateComponent of states) {
      const { unmount } = render(<StateComponent />);
      const liveRegion =
        screen.queryByRole("alert") ?? screen.queryByRole("status");
      expect(liveRegion).toBeInTheDocument();
      unmount();
    }
  });
});
