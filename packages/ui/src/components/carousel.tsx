"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "#/lib/utils";
import { Button } from "#/components/button";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const CAROUSEL_RECIPE_NAME = "surface" as const;

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  readonly opts?: CarouselOptions;
  readonly plugins?: CarouselPlugin;
  readonly orientation?: "horizontal" | "vertical";
  readonly setApi?: (api: CarouselApi) => void;
};

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
    CarouselProps {
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
      if (!carouselApi) return;
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
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    const governed = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slot: "root",
      className,
    });

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
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
            governed
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
      slot: "body",
    });

    const content = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slot: "content",
      slotKey:
        orientation === "horizontal" ? "content-horizontal" : "content-vertical",
      className,
    });

    return (
      <div ref={carouselRef} {...body.dataAttributes} className={cn(body.className)}>
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
      slot: "label",
      slotKey: orientation === "horizontal" ? "item-horizontal" : "item-vertical",
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

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
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
      slot: "control",
      slotKey:
        orientation === "horizontal" ? "previous-horizontal" : "previous-vertical",
      className,
    });

    const srOnly = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slotKey: "sr-only",
    });

    return (
      <Button
        ref={ref}
        {...applyGovernedPresentation(
          {
            intent,
            emphasis,
            size,
            presentation,
            disabled: !canScrollPrev,
            onClick: scrollPrev,
            ...props,
          },
          governed
        )}
      >
        <ChevronLeftIcon />
        <span {...srOnly.dataAttributes} className={cn(srOnly.className)}>
          Previous slide
        </span>
      </Button>
    );
  }
);

CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
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
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    const governed = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slot: "control",
      slotKey: orientation === "horizontal" ? "next-horizontal" : "next-vertical",
      className,
    });

    const srOnly = resolvePrimitiveGovernance({
      componentName: "Carousel",
      recipeName: CAROUSEL_RECIPE_NAME,
      slotKey: "sr-only",
    });

    return (
      <Button
        ref={ref}
        {...applyGovernedPresentation(
          {
            intent,
            emphasis,
            size,
            presentation,
            disabled: !canScrollNext,
            onClick: scrollNext,
            ...props,
          },
          governed
        )}
      >
        <ChevronRightIcon />
        <span {...srOnly.dataAttributes} className={cn(srOnly.className)}>
          Next slide
        </span>
      </Button>
    );
  }
);

CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
