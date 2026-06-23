import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "../../components/combobox";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

interface TestOption {
  readonly label: string;
  readonly value: string;
}

function labeledEquality(a: TestOption, b: TestOption) {
  return a.value === b.value;
}

const TEST_ITEMS: TestOption[] = [
  { value: "alpha", label: "Alpha vendor" },
  { value: "beta", label: "Beta vendor" },
];

describe("Combobox governance", () => {
  it("exposes displayName on exported subcomponents", () => {
    expect(Combobox.displayName).toBe("Combobox");
    expect(ComboboxValue.displayName).toBe("ComboboxValue");
    expect(ComboboxTrigger.displayName).toBe("ComboboxTrigger");
    expect(ComboboxInput.displayName).toBe("ComboboxInput");
    expect(ComboboxContent.displayName).toBe("ComboboxContent");
    expect(ComboboxList.displayName).toBe("ComboboxList");
    expect(ComboboxItem.displayName).toBe("ComboboxItem");
    expect(ComboboxGroup.displayName).toBe("ComboboxGroup");
    expect(ComboboxLabel.displayName).toBe("ComboboxLabel");
    expect(ComboboxCollection.displayName).toBe("ComboboxCollection");
    expect(ComboboxEmpty.displayName).toBe("ComboboxEmpty");
    expect(ComboboxSeparator.displayName).toBe("ComboboxSeparator");
    expect(ComboboxChips.displayName).toBe("ComboboxChips");
    expect(ComboboxChip.displayName).toBe("ComboboxChip");
    expect(ComboboxChipsInput.displayName).toBe("ComboboxChipsInput");
  });

  it("renders list items with governed combobox-item slot", () => {
    render(
      <Combobox defaultOpen isItemEqualToValue={labeledEquality} items={TEST_ITEMS}>
        <ComboboxContent>
          <ComboboxList>
            {(item: TestOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );

    expectGovernedPrimitive(screen.getByRole("option", { name: "Alpha vendor" }), {
      component: "Combobox",
      slot: "combobox-item",
      recipe: "surface",
      state: "ready",
    });
  });

  it("does not allow consumer data attributes to override governed item attributes", () => {
    render(
      <Combobox defaultOpen isItemEqualToValue={labeledEquality} items={TEST_ITEMS}>
        <ComboboxContent>
          <ComboboxList>
            {(item: TestOption) => (
              <ComboboxItem
                data-component="Override"
                data-recipe="override"
                data-slot="override"
                key={item.value}
                value={item}
              >
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );

    expectGovernedDataAuthority(
      screen.getByRole("option", { name: "Alpha vendor" }),
      {
        "data-component": "Combobox",
        "data-recipe": "surface",
        "data-slot": "combobox-item",
        "data-state": "ready",
      }
    );
  });

  it("emits governed loading state on combobox content popup", () => {
    render(
      <Combobox defaultOpen isItemEqualToValue={labeledEquality} items={TEST_ITEMS}>
        <ComboboxContent data-testid="combobox-popup" state="loading">
          <ComboboxList>
            {(item: TestOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );

    expect(screen.getByTestId("combobox-popup")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("keeps governed data attributes authoritative on empty state", () => {
    render(
      <Combobox defaultOpen isItemEqualToValue={labeledEquality} items={[]}>
        <ComboboxContent>
          <ComboboxEmpty
            data-component="Override"
            data-slot="override"
          >
            No results
          </ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    );

    const empty = screen.getByRole("status");
    expectGovernedDataAuthority(empty, {
      "data-slot": "combobox-empty",
      "data-component": "Combobox",
      "data-recipe": "surface",
    });
  });

  it("routes chip remove positioning through wrapper instead of button className", () => {
    render(
      <Combobox
        defaultValue={[{ id: "travel", value: "Travel" }]}
        isItemEqualToValue={(a, b) => a.id === b.id}
        items={[{ id: "travel", value: "Travel" }]}
        multiple
      >
        <ComboboxChips>
          <ComboboxValue>
            {(selected: { id: string; value: string }[]) =>
              selected.map((item) => (
                <ComboboxChip key={item.id}>{item.value}</ComboboxChip>
              ))
            }
          </ComboboxValue>
        </ComboboxChips>
      </Combobox>
    );

    const removeButton = screen.getByRole("button", { name: "Remove" });
    expect(removeButton).toHaveAttribute("data-slot", "button");
    expect(removeButton.parentElement).toHaveAttribute(
      "data-slot",
      "combobox-chip-remove"
    );
  });

  it("associates combobox input with label via htmlFor and id", () => {
    render(
      <label htmlFor="vendor-search">
        Vendor
        <Combobox isItemEqualToValue={labeledEquality} items={TEST_ITEMS}>
          <ComboboxInput
            id="vendor-search"
            placeholder="Search vendors…"
            showTrigger={false}
          />
        </Combobox>
      </label>
    );

    expect(screen.getByLabelText("Vendor")).toBeInTheDocument();
  });
});
