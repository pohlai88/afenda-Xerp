import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useIsMobile } from "../../hooks/use-mobile.js";

type MatchMediaListener = (event: MediaQueryListEvent) => void;

function createMatchMedia(initialMatches: boolean) {
  const listeners = new Set<MatchMediaListener>();
  let matches = initialMatches;
  const mql = {
    get matches() {
      return matches;
    },
    media: "(max-width: 767px)",
    addEventListener: (_event: "change", listener: MatchMediaListener) => {
      listeners.add(listener);
    },
    removeEventListener: (_event: "change", listener: MatchMediaListener) => {
      listeners.delete(listener);
    },
    dispatch(nextMatches: boolean) {
      matches = nextMatches;
      for (const listener of listeners) {
        listener({ matches: nextMatches } as MediaQueryListEvent);
      }
    },
  };

  return mql;
}

describe("useIsMobile", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false before mount then follows matchMedia", async () => {
    const mql = createMatchMedia(false);
    vi.stubGlobal("matchMedia", () => mql);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    mql.dispatch(true);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("reflects desktop matchMedia on mount", async () => {
    const mql = createMatchMedia(false);
    vi.stubGlobal("matchMedia", () => mql);

    const { result } = renderHook(() => useIsMobile());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });
});
