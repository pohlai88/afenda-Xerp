import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Alert governance", () => {
  it("keeps governed data attributes authoritative on root", () => {
    render(
      <Alert
        data-component="Fake"
        data-slot="override"
        data-state="fake"
        data-testid="alert-root"
        tone="danger"
      >
        Warning
      </Alert>
    );

    const alert = screen.getByRole("alert");

    expectGovernedDataAuthority(alert, {
      "data-component": "Alert",
      "data-recipe": "status",
      "data-state": "ready",
      "data-tone": "danger",
    });
    expect(alert).not.toHaveAttribute("data-variant");
    expectGovernedPrimitive(alert, {
      component: "Alert",
      slot: "alert",
      recipe: "status",
      state: "ready",
    });
  });

  it("applies governed state to root", () => {
    render(
      <Alert data-testid="alert-root" state="loading" tone="info">
        Loading
      </Alert>
    );

    expect(screen.getByTestId("alert-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("uses role=status for non-critical Alert tones", () => {
    render(<Alert tone="info">FYI</Alert>);

    expect(screen.getByRole("status")).toHaveTextContent("FYI");
  });

  it("uses role=alert for danger and warning Alert tones", () => {
    const { rerender } = render(<Alert tone="warning">Heads up</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("Heads up");

    rerender(<Alert tone="danger">Critical</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("Critical");
  });

  it("allows caller role override on Alert", () => {
    render(
      <Alert role="alert" tone="info">
        Override
      </Alert>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Override");
  });

  it("maps deprecated destructive variant to danger tone", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Failed</AlertTitle>
      </Alert>
    );

    const alert = screen.getByRole("alert");

    expect(alert).toHaveAttribute("data-tone", "danger");
    expect(screen.getByText("Failed")).toHaveAttribute(
      "data-slot",
      "alert-title"
    );
  });

  it("prefers tone over deprecated variant", () => {
    render(
      <Alert tone="warning" variant="destructive">
        Warning
      </Alert>
    );

    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "warning");
  });

  it("does not emit data-variant", () => {
    render(<Alert variant="destructive">Failed</Alert>);

    expect(screen.getByRole("alert")).not.toHaveAttribute("data-variant");
  });

  it("renders governed slot names for title, description, and action", () => {
    render(
      <Alert tone="danger">
        <AlertTitle>Action required</AlertTitle>
        <AlertDescription>Review the failed journal entry.</AlertDescription>
        <AlertAction>Retry</AlertAction>
      </Alert>
    );

    expect(screen.getByText("Action required")).toHaveAttribute(
      "data-slot",
      "alert-title"
    );
    expect(
      screen.getByText("Review the failed journal entry.")
    ).toHaveAttribute("data-slot", "alert-description");
    expect(screen.getByText("Retry")).toHaveAttribute(
      "data-slot",
      "alert-action"
    );
  });

  it("forwards ref on Alert root", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Alert ref={ref} tone="info">
        FYI
      </Alert>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveTextContent("FYI");
  });

  it("forwards ref on AlertTitle", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Alert tone="info">
        <AlertTitle ref={ref}>Title</AlertTitle>
      </Alert>
    );

    expect(ref.current).toBe(screen.getByText("Title"));
    expect(ref.current).toHaveAttribute("data-slot", "alert-title");
  });
});
