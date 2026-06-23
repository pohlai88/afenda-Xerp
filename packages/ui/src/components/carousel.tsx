"use client";

import type { GovernedCarouselProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

const CAROUSEL_RECIPE_NAME = "surface" as const;

const CAROUSEL_SLOT_ROLES = {
  root: "root",
  body: "body",
  content: "content",
  label: "label",
  control: "control",
} as const satisfies Record<string, SlotRole>;

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

export type CarouselOrientation = "horizontal" | "vertical";

interface CarouselProps {
  readonly opts?: CarouselOptions;
  readonly orientation?: CarouselOrientation;
  readonly plugins?: CarouselPlugin;
  readonly setApi?: (api: CarouselApi) => void;
}

type CarouselContextProps = {
  readonly carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  readonly api: ReturnType<typeof useEmblaCarousel>[1];
  readonly scrollPrev: () => void;
  readonly scrollNext: () => void;
  readonly canScrollPrev: boolean;
  readonly canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

interface CarouselRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    CarouselProps,
    GovernedCarouselProps {
  readonly className?: string;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselRootProps>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      state,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((carouselApi: CarouselApi) => {
      if (!carouselApi) {
        return;
      }
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (orientation === "vertical") {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            scrollPrev();
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            scrollNext();
          }
          return;
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [orientation, scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!(api && setApi)) {
        return;
      }
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api.off("reInit", onSelect);
        api.off("select", onSelect);
      };
    }, [api, onSelect]);

    const governed = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      state,
      slot: CAROUSEL_SLOT_ROLES.root,
      className,
    });

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation,
          plugins,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          {...applyGovernedPresentation(
            {
              onKeyDownCapture: handleKeyDown,
              role: "region",
              "aria-roledescription": "carousel",
              ...props,
            },
            governed,
            { "data-orientation": orientation }
          )}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);

Carousel.displayName = "Carousel";

interface CarouselContentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    const body = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slot: CAROUSEL_SLOT_ROLES.body,
    });

    const content = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slot: CAROUSEL_SLOT_ROLES.content,
      slotKey:
        orientation === "horizontal"
          ? "content-horizontal"
          : "content-vertical",
      className,
    });

    return (
      <div ref={carouselRef} {...applyGovernedPresentation({}, body)}>
        <div ref={ref} {...applyGovernedPresentation(props, content)} />
      </div>
    );
  }
);

CarouselContent.displayName = "CarouselContent";

interface CarouselItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    const governed = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slot: CAROUSEL_SLOT_ROLES.label,
      slotKey:
        orientation === "horizontal" ? "item-horizontal" : "item-vertical",
      className,
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation(
          { ...props, role: "group", "aria-roledescription": "slide" },
          governed
        )}
      />
    );
  }
);

CarouselItem.displayName = "CarouselItem";

interface CarouselControlProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Button>,
    "className" | "onClick" | "disabled"
  > {
  readonly className?: string;
}

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  CarouselControlProps
>(
  (
    {
      className,
      intent = "secondary",
      emphasis = "outline",
      size = "sm",
      presentation = "icon",
      ...props
    },
    ref
  ) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    const governed = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slot: CAROUSEL_SLOT_ROLES.control,
      slotKey:
        orientation === "horizontal"
          ? "previous-horizontal"
          : "previous-vertical",
      className,
    });

    const srOnly = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slotKey: "sr-only",
    });

    return (
      <div {...applyGovernedPresentation({}, governed)}>
        <Button
          disabled={!canScrollPrev}
          emphasis={emphasis}
          intent={intent}
          onClick={scrollPrev}
          presentation={presentation}
          ref={ref}
          size={size}
          {...props}
        >
          <ChevronLeftIcon aria-hidden="true" />
          <span {...applyGovernedPresentation({}, srOnly)}>Previous slide</span>
        </Button>
      </div>
    );
  }
);

CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselControlProps>(
  (
    {
      className,
      intent = "secondary",
      emphasis = "outline",
      size = "sm",
      presentation = "icon",
      ...props
    },
    ref
  ) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    const governed = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slot: CAROUSEL_SLOT_ROLES.control,
      slotKey:
        orientation === "horizontal" ? "next-horizontal" : "next-vertical",
      className,
    });

    const srOnly = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slotKey: "sr-only",
    });

    return (
      <div {...applyGovernedPresentation({}, governed)}>
        <Button
          disabled={!canScrollNext}
          emphasis={emphasis}
          intent={intent}
          onClick={scrollNext}
          presentation={presentation}
          ref={ref}
          size={size}
          {...props}
        >
          <ChevronRightIcon aria-hidden="true" />
          <span {...applyGovernedPresentation({}, srOnly)}>Next slide</span>
        </Button>
      </div>
    );
  }
);

CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
};
