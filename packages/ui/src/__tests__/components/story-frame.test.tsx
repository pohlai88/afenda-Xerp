import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  StoryFrame,
  StoryInset,
  StoryRow,
  StoryStack,
} from "../../components/_storybook/story-frame";

describe("Storybook layout helpers", () => {
  it("StoryFrame applies width and layout markers", () => {
    render(
      <StoryFrame data-testid="frame" padding="sm" width="lg">
        Content
      </StoryFrame>
    );

    const frame = screen.getByTestId("frame");

    expect(frame).toHaveAttribute("data-story-layout", "frame");
    expect(frame.className).toContain("max-w-lg");
    expect(frame.className).toContain("p-2");
  });

  it("StoryRow maps layout props to flex utilities", () => {
    render(
      <StoryRow
        data-testid="row"
        gap="md"
        grow
        justify="between"
        shrink
        width="max"
        wrap
      >
        Item
      </StoryRow>
    );

    const row = screen.getByTestId("row");

    expect(row).toHaveAttribute("data-story-layout", "row");
    expect(row.className).toContain("gap-3");
    expect(row.className).toContain("justify-between");
    expect(row.className).toContain("flex-wrap");
    expect(row.className).toContain("flex-1");
    expect(row.className).toContain("min-w-0");
    expect(row.className).toContain("w-max");
  });

  it("StoryStack maps align and justify without raw items-center classNames", () => {
    render(
      <StoryStack align="center" data-testid="stack" gap="lg" justify="end">
        Item
      </StoryStack>
    );

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-story-layout", "stack");
    expect(stack.className).toContain("items-center");
    expect(stack.className).toContain("justify-end");
    expect(stack.className).toContain("gap-4");
  });

  it("StoryInset provides bordered story chrome", () => {
    render(
      <StoryInset data-testid="inset" overflow="hidden" padding="xs">
        Surface
      </StoryInset>
    );

    const inset = screen.getByTestId("inset");

    expect(inset).toHaveAttribute("data-story-layout", "inset");
    expect(inset.className).toContain("border");
    expect(inset.className).toContain("border-border");
    expect(inset.className).toContain("rounded-lg");
    expect(inset.className).toContain("overflow-hidden");
    expect(inset.className).toContain("p-1");
  });
});
