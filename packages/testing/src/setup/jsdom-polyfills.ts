import { vi } from "vitest";

interface BoundingClientRectLike {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly right: number;
  toJSON(): this;
  readonly top: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

function createDefaultBoundingClientRect(): BoundingClientRectLike {
  return {
    width: 1024,
    height: 768,
    top: 0,
    left: 0,
    bottom: 768,
    right: 1024,
    x: 0,
    y: 0,
    toJSON() {
      return this;
    },
  };
}

class MockResizeObserver implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

interface CanvasRenderingContext2DStub {
  arc(): void;
  beginPath(): void;
  clearRect(): void;
  fill(): void;
  fillStyle: string;
  globalAlpha: number;
  setTransform(): void;
  shadowBlur: number;
  shadowColor: string;
}

function createCanvasRenderingContext2DStub(): CanvasRenderingContext2DStub {
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    setTransform: vi.fn(),
    fillStyle: "",
    globalAlpha: 1,
    shadowBlur: 0,
    shadowColor: "",
  };
}

const cssTransformValues = new WeakMap<
  CSSStyleDeclaration,
  Partial<Record<"mozTransform" | "transform" | "webkitTransform", string>>
>();

/** Installs DOM APIs required by Radix, cmdk, and Floating UI under jsdom. */
export function installJsdomPolyfills(): void {
  if (typeof Element !== "undefined") {
    Element.prototype.scrollIntoView = vi.fn();

    const elementPrototype = Element.prototype as Element & {
      getBoundingClientRect: () => DOMRect;
      hasPointerCapture?: (pointerId: number) => boolean;
      setPointerCapture?: (pointerId: number) => void;
      releasePointerCapture?: (pointerId: number) => void;
    };

    elementPrototype.getBoundingClientRect = vi.fn(
      function getBoundingClientRect(this: Element): DOMRect {
        const rect = createDefaultBoundingClientRect();
        return {
          ...rect,
          width: this.clientWidth || rect.width,
          height: this.clientHeight || rect.height,
        } as DOMRect;
      }
    );

    if (elementPrototype.hasPointerCapture === undefined) {
      elementPrototype.hasPointerCapture = () => false;
    }

    if (elementPrototype.setPointerCapture === undefined) {
      elementPrototype.setPointerCapture = vi.fn();
    }

    if (elementPrototype.releasePointerCapture === undefined) {
      elementPrototype.releasePointerCapture = vi.fn();
    }
  }

  if (typeof HTMLCanvasElement !== "undefined") {
    HTMLCanvasElement.prototype.getContext = vi
      .fn()
      .mockImplementation((contextId: string) =>
        contextId === "2d" ? createCanvasRenderingContext2DStub() : null
      ) as HTMLCanvasElement["getContext"];
  }

  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.CSSStyleDeclaration !== "undefined") {
    for (const propertyName of [
      "transform",
      "webkitTransform",
      "mozTransform",
    ] as const) {
      Object.defineProperty(
        window.CSSStyleDeclaration.prototype,
        propertyName,
        {
          configurable: true,
          get() {
            return cssTransformValues.get(this)?.[propertyName] ?? "none";
          },
          set(value: string) {
            const values = cssTransformValues.get(this) ?? {};
            values[propertyName] = value;
            cssTransformValues.set(this, values);
          },
        }
      );
    }
  }

  if (typeof window.ResizeObserver === "undefined") {
    window.ResizeObserver = MockResizeObserver;
  }

  if (typeof window.IntersectionObserver === "undefined") {
    window.IntersectionObserver = MockIntersectionObserver;
  }

  if (typeof window.PointerEvent === "undefined") {
    class MockPointerEvent extends MouseEvent implements PointerEvent {
      readonly altitudeAngle = 0;
      readonly azimuthAngle = 0;
      readonly height = 1;
      readonly isPrimary = true;
      readonly pointerId: number;
      readonly pointerType: string;
      readonly pressure = 0;
      readonly tangentialPressure = 0;
      readonly tiltX = 0;
      readonly tiltY = 0;
      readonly twist = 0;
      readonly width = 1;
      readonly coalescedEvents: PointerEvent[] = [];
      readonly predictedEvents: PointerEvent[] = [];

      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params);
        this.pointerId = params.pointerId ?? 0;
        this.pointerType = params.pointerType ?? "mouse";
      }

      getCoalescedEvents(): PointerEvent[] {
        return this.coalescedEvents;
      }

      getPredictedEvents(): PointerEvent[] {
        return this.predictedEvents;
      }
    }

    window.PointerEvent = MockPointerEvent as typeof PointerEvent;
  }

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  });
}
