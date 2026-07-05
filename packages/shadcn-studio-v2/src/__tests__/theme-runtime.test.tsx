// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  StudioProvider,
  ThemeProvider,
  ThemeScript,
  ThemeToggle,
  useStudio,
  useTheme,
} from "../clients";
import { studioThemeConfig } from "../configs/theme-config";
import { StudioPresentationProviders } from "../contexts/theme-boundary";
import type { StudioThemeUpdate } from "../types/theme";

interface BrowserThemeRuntimeOptions {
  readonly getItemThrows?: boolean;
  readonly mediaMatches?: boolean;
  readonly setItemThrows?: boolean;
  readonly storedTheme?: string | null;
}

interface ClientRenderResult {
  readonly container: HTMLElement;
  readonly root: Root;
}

const ACT_GLOBAL = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};
const ORIGINAL_LOCAL_STORAGE = Object.getOwnPropertyDescriptor(
  window,
  "localStorage"
);
const ORIGINAL_MATCH_MEDIA = window.matchMedia;
const mountedRoots: Root[] = [];
let mediaListener: (() => void) | undefined;
let mediaMatches = false;

ACT_GLOBAL.IS_REACT_ACT_ENVIRONMENT = true;

function installBrowserThemeRuntime({
  getItemThrows = false,
  mediaMatches: nextMediaMatches = false,
  setItemThrows = false,
  storedTheme = null,
}: BrowserThemeRuntimeOptions = {}) {
  mediaListener = undefined;
  mediaMatches = nextMediaMatches;
  document.documentElement.removeAttribute(studioThemeConfig.themeAttribute);
  document.documentElement.classList.remove(studioThemeConfig.darkClassName);

  const getItem = vi.fn(() => {
    if (getItemThrows) {
      throw new Error("localStorage getItem unavailable");
    }

    return storedTheme;
  });
  const setItem = vi.fn(() => {
    if (setItemThrows) {
      throw new Error("localStorage setItem unavailable");
    }
  });
  const mediaQuery = {
    addEventListener: vi.fn((_eventName: "change", listener: () => void) => {
      mediaListener = listener;
    }),
    get matches() {
      return mediaMatches;
    },
    removeEventListener: vi.fn(),
  };
  const matchMedia = vi.fn(() => mediaQuery);

  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem,
      setItem,
    },
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: matchMedia,
  });

  return {
    getItem,
    matchMedia,
    mediaQuery,
    setItem,
  };
}

function renderClient(element: ReactNode): ClientRenderResult {
  const container = document.createElement("div");
  document.body.append(container);

  const root = createRoot(container);
  mountedRoots.push(root);

  act(() => {
    root.render(element);
  });

  return { container, root };
}

function ThemeProbe() {
  const theme = useTheme();

  return (
    <section>
      <output
        data-mode={theme.mode}
        data-resolved-mode={theme.resolvedMode}
        data-theme-id={theme.themeId}
      >
        {theme.themeId}
      </output>
      <button
        onClick={() => {
          theme.setTheme({ mode: "dark", themeId: "verdant-noir" });
        }}
        type="button"
      >
        Set valid theme
      </button>
      <button
        onClick={() => {
          theme.setTheme({
            mode: "invalid",
            themeId: "invalid",
          } as unknown as StudioThemeUpdate);
        }}
        type="button"
      >
        Set invalid theme
      </button>
    </section>
  );
}

function readProbe(container: HTMLElement): HTMLOutputElement {
  const output = container.querySelector("output");

  if (!(output instanceof HTMLOutputElement)) {
    throw new Error("Theme probe output was not rendered.");
  }

  return output;
}

function clickButton(container: HTMLElement, label: string): void {
  const button = Array.from(container.querySelectorAll("button")).find(
    (candidate) => candidate.textContent === label
  );

  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Button not found: ${label}`);
  }

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

afterEach(() => {
  act(() => {
    for (const root of mountedRoots.splice(0)) {
      root.unmount();
    }
  });

  document.body.replaceChildren();
  document.documentElement.removeAttribute(studioThemeConfig.themeAttribute);
  document.documentElement.classList.remove(studioThemeConfig.darkClassName);
  mediaListener = undefined;

  if (ORIGINAL_LOCAL_STORAGE) {
    Object.defineProperty(window, "localStorage", ORIGINAL_LOCAL_STORAGE);
  }

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: ORIGINAL_MATCH_MEDIA,
  });
});

beforeEach(() => {
  installBrowserThemeRuntime();
});

describe("shadcn-studio-v2 theme runtime stabilization", () => {
  it("renders children and returns theme state inside the provider", () => {
    const { container } = renderClient(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    const output = readProbe(container);

    expect(output.dataset.mode).toBe("system");
    expect(output.dataset.themeId).toBe("shadcn-default");
  });

  it("throws when useTheme is called outside ThemeProvider", () => {
    function OutsideProviderProbe() {
      useTheme();

      return null;
    }

    expect(() => renderToStaticMarkup(<OutsideProviderProbe />)).toThrow(
      "useTheme must be used within ThemeProvider."
    );
  });

  it("applies data-theme, dark class, and persisted state from valid stored values", () => {
    const storedTheme = JSON.stringify({
      mode: "dark",
      themeId: "verdant-noir",
    });
    const { setItem } = installBrowserThemeRuntime({ storedTheme });
    const { container } = renderClient(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );
    const output = readProbe(container);

    expect(output.dataset.mode).toBe("dark");
    expect(output.dataset.resolvedMode).toBe("dark");
    expect(output.dataset.themeId).toBe("verdant-noir");
    expect(document.documentElement.dataset.theme).toBe("verdant-noir");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(setItem).toHaveBeenCalledWith(
      studioThemeConfig.storageKey,
      storedTheme
    );
    expect(setItem).not.toHaveBeenCalledWith(
      studioThemeConfig.storageKey,
      JSON.stringify({ mode: "system", themeId: "shadcn-default" })
    );
  });

  it("ignores invalid stored values and persists the default theme", () => {
    const { setItem } = installBrowserThemeRuntime({
      storedTheme: JSON.stringify({ mode: "invalid", themeId: "invalid" }),
    });
    const { container } = renderClient(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );
    const output = readProbe(container);

    expect(output.dataset.mode).toBe("system");
    expect(output.dataset.themeId).toBe("shadcn-default");
    expect(setItem).toHaveBeenCalledWith(
      studioThemeConfig.storageKey,
      JSON.stringify({ mode: "system", themeId: "shadcn-default" })
    );
  });

  it("does not crash when localStorage getItem throws", () => {
    installBrowserThemeRuntime({ getItemThrows: true });

    const { container } = renderClient(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(readProbe(container).dataset.themeId).toBe("shadcn-default");
  });

  it("does not crash when localStorage setItem throws while still applying DOM theme", () => {
    installBrowserThemeRuntime({ setItemThrows: true });

    const { container } = renderClient(
      <ThemeProvider initialMode="dark" initialThemeId="swiss-noir">
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(readProbe(container).dataset.resolvedMode).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("swiss-noir");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("resolves system mode from matchMedia and updates when media changes", () => {
    installBrowserThemeRuntime({ mediaMatches: false });

    const { container } = renderClient(
      <ThemeProvider initialMode="system">
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(readProbe(container).dataset.resolvedMode).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    mediaMatches = true;

    act(() => {
      mediaListener?.();
    });

    expect(readProbe(container).dataset.resolvedMode).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("setTheme updates mode and themeId while rejecting invalid runtime values", () => {
    const { container } = renderClient(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    clickButton(container, "Set valid theme");

    expect(readProbe(container).dataset.mode).toBe("dark");
    expect(readProbe(container).dataset.themeId).toBe("verdant-noir");

    clickButton(container, "Set invalid theme");

    expect(readProbe(container).dataset.mode).toBe("dark");
    expect(readProbe(container).dataset.themeId).toBe("verdant-noir");
  });

  it("still honors explicit initial props when no stored theme exists", () => {
    const markup = renderToStaticMarkup(
      <ThemeProvider initialMode="dark" initialThemeId="swiss-noir">
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(markup).toContain('data-mode="dark"');
    expect(markup).toContain('data-theme-id="swiss-noir"');
    expect(markup).toContain('data-resolved-mode="dark"');
  });

  it("composes studio and theme providers while passing initial theme props", () => {
    const { container } = renderClient(
      <StudioPresentationProviders
        initialMode="dark"
        initialThemeId="verdant-noir"
      >
        <ThemeProbe />
      </StudioPresentationProviders>
    );
    const output = readProbe(container);

    expect(output.dataset.mode).toBe("dark");
    expect(output.dataset.resolvedMode).toBe("dark");
    expect(output.dataset.themeId).toBe("verdant-noir");
    expect(document.documentElement.dataset.theme).toBe("verdant-noir");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("exposes static studio runtime config through the studio provider", () => {
    function RuntimeProbe() {
      const studio = useStudio();

      return (
        <output data-package={studio.packageConfig.packageName}>
          {studio.themeConfig.defaultThemeId}
        </output>
      );
    }

    const markup = renderToStaticMarkup(
      <StudioProvider>
        <RuntimeProbe />
      </StudioProvider>
    );

    expect(markup).toContain('data-package="@afenda/shadcn-studio-v2"');
    expect(markup).toContain("shadcn-default");
  });

  it("renders a deterministic theme bootstrap script without entering neutral exports", () => {
    const markup = renderToStaticMarkup(
      <ThemeScript initialMode="dark" initialThemeId="verdant-noir" />
    );

    expect(markup).toContain('data-slot="theme-script"');
    expect(markup).toContain("afenda-studio-v2-theme");
    expect(markup).toContain("verdant-noir");
    expect(markup).toContain("swiss-noir");
    expect(markup).toContain("data-theme");
  });
});
