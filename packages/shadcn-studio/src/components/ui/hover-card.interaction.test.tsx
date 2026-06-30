import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

describe("hover-card interaction", () => {
  it("opens on hover and closes on unhover", async () => {
    const user = setupUser();

    render(
      <HoverCard>
        <HoverCardTrigger closeDelay={0} delay={0}>
          Profile link
        </HoverCardTrigger>
        <HoverCardContent>Card body</HoverCardContent>
      </HoverCard>
    );

    expect(screen.queryByText("Card body")).not.toBeInTheDocument();

    await user.hover(screen.getByText("Profile link"));
    expect(await screen.findByText("Card body")).toBeVisible();

    await user.unhover(screen.getByText("Profile link"));
    expect(screen.queryByText("Card body")).not.toBeInTheDocument();
  });
});
