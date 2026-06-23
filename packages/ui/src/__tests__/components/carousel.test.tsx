import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Carousel governance", () => {
  it("renders root region with governed carousel slot and orientation", () => {
    render(
      <Carousel aria-label="Featured records" data-testid="carousel">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    const root = screen.getByRole("region", { name: "Featured records" });

    expect(root).toHaveAttribute("data-orientation", "horizontal");
    expect(root).toHaveAttribute("aria-roledescription", "carousel");
    expectGovernedPrimitive(root, {
      component: "Carousel",
      slot: "carousel",
      recipe: "surface",
      state: "ready",
    });
  });

  it("renders slide items with governed carousel-item slot", () => {
    render(
      <Carousel aria-label="Slides">
        <CarouselContent>
          <CarouselItem>Alpha</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(screen.getByText("Alpha")).toHaveAttribute(
      "data-slot",
      "carousel-item"
    );
    expect(screen.getByText("Alpha")).toHaveAttribute(
      "aria-roledescription",
      "slide"
    );
  });

  it("does not allow consumer data attributes to override governed root attributes", () => {
    render(
      <Carousel
        aria-label="Slides"
        data-component="Override"
        data-orientation="vertical"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="carousel"
        orientation="horizontal"
      >
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    const root = screen.getByTestId("carousel");

    expectGovernedDataAuthority(root, {
      "data-component": "Carousel",
      "data-recipe": "surface",
      "data-slot": "carousel",
      "data-state": "ready",
      "data-orientation": "horizontal",
    });
  });

  it("forwards ref to carousel root", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Carousel aria-label="Slides" ref={ref}>
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-slot", "carousel");
  });

  it("emits vertical orientation on root and content track", () => {
    render(
      <Carousel aria-label="Vertical slides" orientation="vertical">
        <CarouselContent>
          <CarouselItem>Top</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(
      screen.getByRole("region", { name: "Vertical slides" })
    ).toHaveAttribute("data-orientation", "vertical");
  });

  it("emits governed loading state on root", () => {
    render(
      <Carousel aria-label="Loading slides" state="loading">
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(
      screen.getByRole("region", { name: "Loading slides" })
    ).toHaveAttribute("data-state", "loading");
  });

  it("routes allowed layout className through governance on root", () => {
    render(
      <Carousel aria-label="Slides" className="w-full" data-testid="carousel">
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(screen.getByTestId("carousel")).toHaveClass("w-full");
  });

  it("merges carousel control positioning on wrapper around previous button", () => {
    render(
      <Carousel aria-label="Slides">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious data-testid="carousel-previous" />
      </Carousel>
    );

    const control = screen.getByTestId("carousel-previous").parentElement;

    expect(control).toHaveAttribute("data-slot", "carousel-previous");
    expect(
      screen.getByRole("button", { name: "Previous slide" })
    ).toHaveAttribute("data-slot", "button");
  });
});
