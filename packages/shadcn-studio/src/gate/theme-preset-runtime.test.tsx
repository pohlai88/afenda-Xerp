import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";

import { SettingsProvider, useSettings } from "../theme/settings-context.js";

function SettingsProbe() {
  const { settings, updateSettings } = useSettings();

  return (
    <div>
      <span data-testid="preset">{settings.themePreset}</span>
      <button
        onClick={() => updateSettings({ themePreset: "caffeine" })}
        type="button"
      >
        Apply caffeine
      </button>
      <button
        onClick={() => updateSettings({ themePreset: "default" })}
        type="button"
      >
        Apply default
      </button>
    </div>
  );
}

describe("SettingsProvider theme preset runtime", () => {
  it("applies named preset CSS variables on documentElement", async () => {
    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <SettingsProvider initial={{ themePreset: "default" }}>
          <SettingsProbe />
        </SettingsProvider>
      </ThemeProvider>
    );

    screen.getByRole("button", { name: "Apply caffeine" }).click();

    await waitFor(() => {
      expect(
        document.documentElement.style.getPropertyValue("--primary")
      ).not.toBe("");
    });

    expect(document.documentElement.getAttribute("data-theme-font")).toBe(
      "geist"
    );
    expect(screen.getByTestId("preset")).toHaveTextContent("caffeine");
  });

  it("removes inline overrides when default preset is selected", async () => {
    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <SettingsProvider initial={{ themePreset: "caffeine" }}>
          <SettingsProbe />
        </SettingsProvider>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(
        document.documentElement.style.getPropertyValue("--primary")
      ).not.toBe("");
    });

    screen.getByRole("button", { name: "Apply default" }).click();

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue("--primary")).toBe(
        ""
      );
    });
  });

  it("throws on invalid preset slug updates", () => {
    let caught: Error | undefined;

    function InvalidPresetProbe() {
      const { updateSettings } = useSettings();

      return (
        <button
          onClick={() => {
            try {
              updateSettings({ themePreset: "invalid-slug" as never });
            } catch (error) {
              caught = error as Error;
            }
          }}
          type="button"
        >
          Invalid
        </button>
      );
    }

    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <SettingsProvider>
          <InvalidPresetProbe />
        </SettingsProvider>
      </ThemeProvider>
    );

    screen.getByRole("button", { name: "Invalid" }).click();
    expect(caught?.message).toBe('Invalid theme preset slug: "invalid-slug"');
  });

  it("throws on invalid mode updates", () => {
    let caught: Error | undefined;

    function InvalidModeProbe() {
      const { updateSettings } = useSettings();

      return (
        <button
          onClick={() => {
            try {
              updateSettings({ mode: "invalid-mode" as never });
            } catch (error) {
              caught = error as Error;
            }
          }}
          type="button"
        >
          Invalid mode
        </button>
      );
    }

    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <SettingsProvider>
          <InvalidModeProbe />
        </SettingsProvider>
      </ThemeProvider>
    );

    screen.getByRole("button", { name: "Invalid mode" }).click();
    expect(caught?.message).toBe('Invalid theme mode: "invalid-mode"');
  });
});
