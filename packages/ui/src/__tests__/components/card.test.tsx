import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Card governance", () => {
  it("keeps governed data attributes authoritative on root", () => {
    render(
      <Card data-component="Fake" data-recipe="fake" data-state="fake">
        Content
      </Card>
    );

    const card = screen.getByText("Content");

    expectGovernedDataAuthority(card, {
      "data-component": "Card",
      "data-recipe": "card",
      "data-state": "ready",
    });
    expect(card).toHaveAttribute("data-density", "standard");
    expect(card).toHaveAttribute("data-radius", "md");
    expect(card).toHaveAttribute("data-shadow", "raised");
    expect(card).not.toHaveAttribute("data-size");
    expectGovernedPrimitive(card, { component: "Card", slot: "card" });
  });

  it("emits governed layout size through data-size on root", () => {
    render(
      <Card size="sm">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
      </Card>
    );

    const card = screen.getByText("Overview").closest("[data-slot=card]");

    expect(card).toHaveAttribute("data-size", "sm");
  });

  it("renders correct governed slot names for all card parts", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(
      screen.getByText("Title").closest("[data-slot=card-header]")
    ).toBeTruthy();
    expect(screen.getByText("Title")).toHaveAttribute(
      "data-slot",
      "card-title"
    );
    expect(screen.getByText("Description")).toHaveAttribute(
      "data-slot",
      "card-description"
    );
    expect(screen.getByText("Action")).toHaveAttribute(
      "data-slot",
      "card-action"
    );
    expect(screen.getByText("Body")).toHaveAttribute(
      "data-slot",
      "card-content"
    );
    expect(screen.getByText("Footer")).toHaveAttribute(
      "data-slot",
      "card-footer"
    );
  });

  it("does not emit root-only variant attributes on slot elements", () => {
    render(
      <Card shadow="raised">
        <CardHeader>Header</CardHeader>
      </Card>
    );

    const header = screen.getByText("Header");

    expect(header).not.toHaveAttribute("data-shadow");
    expect(header).not.toHaveAttribute("data-density");
    expect(header).not.toHaveAttribute("data-radius");
  });

  it("forwards ref on CardHeader and CardContent", () => {
    const headerRef = createRef<HTMLDivElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Card>
        <CardHeader ref={headerRef}>Header</CardHeader>
        <CardContent ref={contentRef}>Content</CardContent>
      </Card>
    );

    expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders card composition with governed density", () => {
    render(
      <Card density="standard" radius="md" shadow="raised">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>Metrics</CardContent>
      </Card>
    );

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Metrics")).toBeInTheDocument();
    expect(
      screen.getByText("Overview").closest("[data-slot=card]")
    ).toHaveAttribute("data-recipe", "card");
  });
});
