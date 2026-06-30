import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NativeSelect, NativeSelectOption } from "./native-select";

describe("native-select interaction", () => {
  it("selects an option via user interaction", async () => {
    const user = setupUser();
    const onChange = vi.fn();

    render(
      <NativeSelect aria-label="Warehouse" defaultValue="a" onChange={onChange}>
        <NativeSelectOption value="a">North</NativeSelectOption>
        <NativeSelectOption value="b">South</NativeSelectOption>
      </NativeSelect>
    );

    const select = screen.getByRole("combobox", { name: "Warehouse" });
    expect(select).toHaveValue("a");

    await user.selectOptions(select, "b");
    expect(select).toHaveValue("b");
    expect(onChange).toHaveBeenCalled();
  });

  it("does not change value when disabled", async () => {
    const user = setupUser();

    render(
      <NativeSelect aria-label="Warehouse" defaultValue="a" disabled>
        <NativeSelectOption value="a">North</NativeSelectOption>
        <NativeSelectOption value="b">South</NativeSelectOption>
      </NativeSelect>
    );

    const select = screen.getByRole("combobox", { name: "Warehouse" });
    expect(select).toBeDisabled();

    await user.selectOptions(select, "b");
    expect(select).toHaveValue("a");
  });
});
