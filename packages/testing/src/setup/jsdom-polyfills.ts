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

  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.ResizeObserver === "undefined") {
    window.ResizeObserver = MockResizeObserver;
  }

  if (typeof window.IntersectionObserver === "undefined") {
    window.IntersectionObserver = MockIntersectionObserver;
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
