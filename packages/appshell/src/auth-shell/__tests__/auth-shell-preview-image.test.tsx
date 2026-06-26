import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AUTH_SHELL_ENTRY_PREVIEW_ALT,
  AUTH_SHELL_ENTRY_PREVIEW_SRC,
} from "../auth-shell.contract.js";
import { AuthShellPreviewImage } from "../auth-shell-preview-image.client.js";

describe("AuthShellPreviewImage", () => {
  it("renders as a supporting preview asset with non-priority defaults", () => {
    render(<AuthShellPreviewImage />);

    const image = screen.getByRole("img", {
      name: AUTH_SHELL_ENTRY_PREVIEW_ALT,
    });
    expect(image).toHaveAttribute("src", AUTH_SHELL_ENTRY_PREVIEW_SRC);
    expect(image).toHaveClass(
      "app-shell-studio-auth-memory-gate__preview-image"
    );
    expect(image).not.toHaveAttribute("fetchpriority", "high");
  });
});
