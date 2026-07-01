import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Calendar } from "./calendar";

const JUNE_2026 = new Date(2026, 5, 1);
const JUNE_15_2026_LABEL = /June 15th, 2026/i;

function ControlledSingleCalendar() {
  const [selected, setSelected] = React.useState<Date>();

  return (
    <Calendar
      defaultMonth={JUNE_2026}
      mode="single"
      onSelect={setSelected}
      selected={selected}
    />
  );
}

describe("calendar interaction", () => {
  it("renders governed root slot", () => {
    render(<Calendar defaultMonth={JUNE_2026} mode="single" />);

    expect(
      document.querySelector('[data-slot="calendar"]')
    ).toBeInTheDocument();
  });

  it("selects a day in single mode via click", async () => {
    const user = setupUser();

    render(<ControlledSingleCalendar />);

    await user.click(screen.getByRole("button", { name: JUNE_15_2026_LABEL }));

    expect(
      screen.getByRole("button", { name: JUNE_15_2026_LABEL })
    ).toHaveAttribute("data-selected-single", "true");
  });

  it("navigates to the next month via next button", async () => {
    const user = setupUser();

    render(<Calendar defaultMonth={JUNE_2026} mode="single" />);

    expect(screen.getByText("June 2026")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Go to the Next Month" })
    );

    expect(screen.getByText("July 2026")).toBeInTheDocument();
  });

  it("renders week number slot when showWeekNumber is enabled", () => {
    render(<Calendar defaultMonth={JUNE_2026} mode="single" showWeekNumber />);

    expect(
      document.querySelector('[data-slot="calendar-week-number"]')
    ).toBeInTheDocument();
  });

  it("does not select a disabled day", async () => {
    const user = setupUser();
    let selected: Date | undefined;

    render(
      <Calendar
        defaultMonth={JUNE_2026}
        disabled={{ from: new Date(2026, 5, 14), to: new Date(2026, 5, 16) }}
        mode="single"
        onSelect={(date) => {
          selected = date;
        }}
        selected={selected}
      />
    );

    await user.click(screen.getByRole("button", { name: JUNE_15_2026_LABEL }));

    expect(selected).toBeUndefined();
  });
});
