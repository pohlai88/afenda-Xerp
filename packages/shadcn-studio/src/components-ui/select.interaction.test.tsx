import "@testing-library/jest-dom/vitest";
import {
  openListbox,
  selectListboxOption,
  setupUser,
} from "@afenda/testing/react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

describe("select interaction", () => {
  it("opens listbox and selects an option", async () => {
    const user = setupUser();

    render(
      <Select>
        <SelectTrigger aria-label="Choose fruit">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    );

    const listbox = await openListbox(user, "Choose fruit");
    expect(
      within(listbox).getByRole("option", { name: "Apple" })
    ).toBeVisible();

    await selectListboxOption(user, listbox, "Banana");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Choose fruit" })
    ).toHaveTextContent(/banana/i);
  });
});
