import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";

export function expectGovernedPrimitive(
  element: HTMLElement,
  input: {
    readonly component: string;
    readonly slot: string;
    readonly recipe?: string;
    readonly state?: string;
  }
) {
  expect(element).toHaveAttribute("data-component", input.component);
  expect(element).toHaveAttribute("data-slot", input.slot);
  if (input.recipe !== undefined) {
    expect(element).toHaveAttribute("data-recipe", input.recipe);
  }
  if (input.state !== undefined) {
    expect(element).toHaveAttribute("data-state", input.state);
  }
}

export function expectGovernedDataAuthority(
  element: HTMLElement,
  governed: Record<string, string>
) {
  for (const [name, value] of Object.entries(governed)) {
    expect(element).toHaveAttribute(name, value);
  }
}
