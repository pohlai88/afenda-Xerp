import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { INPUT_SLOTS } from "../../components-ui/input.contract";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../../components-ui/input-group";
import { INPUT_GROUP_SLOTS } from "../../components-ui/input-group.contract";

describe("input-group interaction", () => {
  it("focuses and accepts typed text in grouped input", async () => {
    const user = setupUser();

    render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Username" />
      </InputGroup>
    );

    const field = screen.getByRole("textbox", { name: "Username" });
    await user.click(field);
    expect(field).toHaveFocus();

    await user.type(field, "ops@afenda.test");
    expect(field).toHaveValue("ops@afenda.test");
  });

  it("exposes governed slot markers on root, addon, and nested control", () => {
    render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Username" />
      </InputGroup>
    );

    const root = document.querySelector(
      `[data-slot="${INPUT_GROUP_SLOTS.root}"]`
    );
    expect(root).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${INPUT_GROUP_SLOTS.addon}"]`)
    ).toBeInTheDocument();
    expect(
      root?.querySelector(`[data-slot="${INPUT_SLOTS.root}"]`)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Username" })
    ).toBeInTheDocument();
  });
});
