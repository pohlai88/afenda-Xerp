import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Switch } from "../../components-ui/switch";

describe("switch interaction", () => {
  it("toggles checked state via click", async () => {
    const user = setupUser();

    render(<Switch aria-label="Enable notifications" />);

    const control = screen.getByRole("switch", {
      name: "Enable notifications",
    });
    expect(control).not.toBeChecked();

    await user.click(control);
    expect(control).toBeChecked();

    await user.click(control);
    expect(control).not.toBeChecked();
  });
});
