import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../../components-ui/combobox";

describe("combobox interaction", () => {
  it("opens popup and highlights an item on click", async () => {
    const user = setupUser();

    render(
      <Combobox>
        <ComboboxInput aria-label="Search cities" placeholder="Search" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>No results</ComboboxEmpty>
            <ComboboxItem value="nyc">New York</ComboboxItem>
            <ComboboxItem value="la">Los Angeles</ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );

    const input = screen.getByRole("combobox", { name: "Search cities" });
    await user.click(input);

    const listbox = await screen.findByRole("listbox");
    expect(within(listbox).getByText("New York")).toBeVisible();

    await user.click(within(listbox).getByText("Los Angeles"));
    expect(input).toHaveValue("la");
  });
});
