// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeCustomizer } from "../components/shared/theme-customizer";
import { ThemeProvider } from "../contexts/ThemeProvider";

const ACT_GLOBAL = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};
const mountedRoots: Root[] = [];

ACT_GLOBAL.IS_REACT_ACT_ENVIRONMENT = true;

function renderCustomizer() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push(root);

  act(() => {
    root.render(
      <ThemeProvider initialMode="light">
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
});

describe("ThemeCustomizer", () => {
  it("renders reference preset options and applies a selected preset", () => {
    const container = renderCustomizer();
    const trigger = container.querySelector('[data-slot="select-trigger"]');

    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain("Shadcn Default");

    act(() => {
      if (!(trigger instanceof HTMLElement)) {
        throw new Error("Theme trigger not found.");
      }

      trigger.click();
    });

    const caffeineOption = Array.from(
      document.querySelectorAll('[data-slot="select-item"]')
    ).find((item) => item.textContent?.includes("Caffeine"));

    expect(caffeineOption).not.toBeUndefined();

    act(() => {
      if (!(caffeineOption instanceof HTMLElement)) {
        throw new Error("Caffeine option not found.");
      }

      caffeineOption.click();
    });

    expect(trigger?.textContent).toContain("Caffeine");
    expect(
      document.documentElement.style.getPropertyValue("--background")
    ).toBe("oklch(0.98 0 0)");
  });
});
