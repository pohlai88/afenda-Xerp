import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type EmblaListener = (api: ReturnType<typeof createMockEmblaApi>) => void;

const emblaHarness = vi.hoisted(() => ({
  selectedIndex: 0,
  slideCount: 3,
  selectListeners: [] as EmblaListener[],
  reInitListeners: [] as EmblaListener[],
}));

function createMockEmblaApi() {
  const api = {
    selectedScrollSnap: () => emblaHarness.selectedIndex,
    scrollNext: () => {
      if (emblaHarness.selectedIndex < emblaHarness.slideCount - 1) {
        emblaHarness.selectedIndex += 1;
        for (const listener of emblaHarness.selectListeners) {
          listener(api);
        }
      }
    },
    scrollPrev: () => {
      if (emblaHarness.selectedIndex > 0) {
        emblaHarness.selectedIndex -= 1;
        for (const listener of emblaHarness.selectListeners) {
          listener(api);
        }
      }
    },
    canScrollNext: () =>
      emblaHarness.selectedIndex < emblaHarness.slideCount - 1,
    canScrollPrev: () => emblaHarness.selectedIndex > 0,
    on: (event: string, listener: EmblaListener) => {
      if (event === "select") {
        emblaHarness.selectListeners.push(listener);
      }
      if (event === "reInit") {
        emblaHarness.reInitListeners.push(listener);
      }
    },
    off: (event: string, listener: EmblaListener) => {
      if (event === "select") {
        emblaHarness.selectListeners = emblaHarness.selectListeners.filter(
          (item) => item !== listener
        );
      }
    },
    reInit: () => {
      for (const listener of emblaHarness.reInitListeners) {
        listener(api);
      }
      for (const listener of emblaHarness.selectListeners) {
        listener(api);
      }
    },
  };

  return api;
}

vi.mock("embla-carousel-react", () => ({
  default: vi.fn(() => {
    const api = createMockEmblaApi();
    const setRef = vi.fn();
    return [setRef, api];
  }),
}));

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

function CarouselFixture() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        <CarouselItem>
          <div className="p-1">Slide one</div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">Slide two</div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">Slide three</div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

describe("carousel interaction", () => {
  beforeEach(() => {
    emblaHarness.selectedIndex = 0;
    emblaHarness.selectListeners = [];
    emblaHarness.reInitListeners = [];
  });

  it("renders governed root, content, and item slots", () => {
    render(<CarouselFixture />);

    expect(
      document.querySelector('[data-slot="carousel"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="carousel-content"]')
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="carousel-item"]')
    ).toHaveLength(3);
  });

  it("advances visible slide when next button is clicked", async () => {
    const user = setupUser();
    let carouselApi: CarouselApi | undefined;

    render(
      <Carousel
        className="w-full max-w-xs"
        setApi={(api) => {
          carouselApi = api;
        }}
      >
        <CarouselContent>
          <CarouselItem>
            <div className="p-1">Slide one</div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-1">Slide two</div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-1">Slide three</div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    await waitFor(() => {
      expect(carouselApi).toBeDefined();
    });

    expect(carouselApi?.selectedScrollSnap()).toBe(0);

    const nextButton = screen.getByRole("button", { name: "Next slide" });

    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });

    await user.click(nextButton);

    await waitFor(() => {
      expect(carouselApi?.selectedScrollSnap()).toBe(1);
    });
  });
});
