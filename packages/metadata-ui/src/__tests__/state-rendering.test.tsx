import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  MetadataEmptyState,
  MetadataForbiddenState,
  MetadataLoadingState,
} from "../states/metadata-loading-state.js";

describe("state rendering", () => {
  it("renders accessible state messages", () => {
    render(<MetadataLoadingState />);
    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();

    render(<MetadataEmptyState />);
    expect(screen.getByText(/no records match/i)).toBeInTheDocument();

    render(<MetadataForbiddenState />);
    expect(screen.getByText(/do not have access/i)).toBeInTheDocument();
  });
});
