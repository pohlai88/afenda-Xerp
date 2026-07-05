import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  StudioProvider,
  ThemeProvider,
  ThemeScript,
  ThemeToggle,
  useStudio,
} from "../clients";

const ORIGINAL_WINDOW = globalThis.window;

function installWindowMock(storedTheme: string | null): void {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: vi.fn(() => storedTheme),
        setItem: vi.fn(),
      },
      matchMedia: vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: true,
        removeEventListener: vi.fn(),
      })),
    },
  });
}

afterEach(() => {
  if (typeof ORIGINAL_WINDOW === "undefined") {
    Reflect.deleteProperty(globalThis, "window");
    return;
  }

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: ORIGINAL_WINDOW,
  });
});

describe("shadcn-studio-v2 theme runtime stabilization", () => {
  it("keeps the initial render deterministic even when stored theme data exists", () => {
    installWindowMock(
      JSON.stringify({ mode: "dark", themeId: "verdant-noir" })
    );

    const markup = renderToStaticMarkup(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(markup).toContain('data-mode="system"');
    expect(markup).toContain('data-theme-id="shadcn-default"');
    expect(markup).not.toContain('data-mode="dark"');
    expect(markup).not.toContain('data-theme-id="verdant-noir"');
  });

  it("still honors explicit initial props on first render", () => {
    installWindowMock(null);

    const markup = renderToStaticMarkup(
      <ThemeProvider initialMode="dark" initialThemeId="swiss-noir">
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(markup).toContain('data-mode="dark"');
    expect(markup).toContain('data-theme-id="swiss-noir"');
    expect(markup).toContain('data-resolved-mode="dark"');
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
