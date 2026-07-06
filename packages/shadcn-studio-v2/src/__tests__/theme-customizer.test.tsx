// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeCustomizer } from "../components/shared/theme-customizer";
import { ThemeProvider } from "../contexts/theme-provider";
import type { StudioThemeId } from "../types/theme";

const ACT_GLOBAL = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};
const mountedRoots: Root[] = [];

ACT_GLOBAL.IS_REACT_ACT_ENVIRONMENT = true;

function renderCustomizer(initialThemeId: StudioThemeId = "shadcn-default") {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push(root);

  act(() => {
    root.render(
      <ThemeProvider
        initialMode="light"
        initialThemeId={initialThemeId}
        storageKey={null}
      >
        <ThemeCustomizer />
      </ThemeProvider>
    );
  });

  return container;
}

afterEach(() => {
  while (mountedRoots.length > 0) {
    const root = mountedRoots.pop();
    if (root) {
      act(() => {
        root.unmount();
      });
    }
  }

  document.body.innerHTML = "";
  document.documentElement.classList.remove("dark");
  clearThemeTokenStyles();
});

function clearThemeTokenStyles(): void {
  const root = document.documentElement;
  const styles = root.style;

  for (let index = styles.length - 1; index >= 0; index -= 1) {
    const propertyName = styles.item(index);

    if (propertyName.startsWith("--")) {
      root.style.removeProperty(propertyName);
    }
  }
}

describe("ThemeCustomizer", () => {
  it("renders the active theme label in the select trigger", () => {
    const container = renderCustomizer();
    const trigger = container.querySelector('[data-slot="select-trigger"]');

    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain("shadcn Default");
  });

  it("lists AdminCN preset options when the theme select opens", async () => {
    const container = renderCustomizer();
    const trigger = container.querySelector('[data-slot="select-trigger"]');

    await act(async () => {
      if (!(trigger instanceof HTMLElement)) {
        throw new Error("Theme trigger not found.");
      }

      trigger.click();
      await Promise.resolve();
    });

    const caffeineOption = Array.from(
      document.querySelectorAll('[data-slot="select-item"]')
    ).find((item) => item.textContent?.includes("Caffeine"));

    expect(caffeineOption).not.toBeUndefined();
  });

  it("reflects a non-default preset in the trigger and document tokens", () => {
    const container = renderCustomizer("caffeine");
    const trigger = container.querySelector('[data-slot="select-trigger"]');

    expect(trigger?.textContent).toContain("Caffeine");
    expect(
      document.documentElement.style.getPropertyValue("--background")
    ).toBe("oklch(0.98 0 0)");
  });
});
