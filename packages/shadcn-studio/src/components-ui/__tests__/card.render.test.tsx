import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CARD_SLOTS } from "../card.contract.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card.js";

describe("card render", () => {
  it("renders governed card anatomy with slot markers", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
          <CardAction>
            <button type="button">Export</button>
          </CardAction>
        </CardHeader>
        <CardContent>$12,450</CardContent>
        <CardFooter>Updated today</CardFooter>
      </Card>
    );

    expect(screen.getByText("$12,450")).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${CARD_SLOTS.root}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${CARD_SLOTS.header}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${CARD_SLOTS.title}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${CARD_SLOTS.description}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${CARD_SLOTS.action}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${CARD_SLOTS.content}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${CARD_SLOTS.footer}"]`)
    ).toBeInTheDocument();
  });
});
