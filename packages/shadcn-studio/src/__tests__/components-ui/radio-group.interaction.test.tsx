import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RadioGroup, RadioGroupItem } from "../../components-ui/radio-group";

describe("radio-group interaction", () => {
  it("selects an item via click", async () => {
    const user = setupUser();

    render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem aria-label="Option A" value="a" />
        <RadioGroupItem aria-label="Option B" value="b" />
      </RadioGroup>
    );

    const optionA = screen.getByRole("radio", { name: "Option A" });
    const optionB = screen.getByRole("radio", { name: "Option B" });

    expect(optionA).toBeChecked();
    expect(optionB).not.toBeChecked();

    await user.click(optionB);
    expect(optionB).toBeChecked();
    expect(optionA).not.toBeChecked();
  });
});
