import { TooltipProvider } from "@afenda/ui";
import type { Decorator, Preview } from "@storybook/react";
import React from "react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import "./preview.css";

// Expose React globally so Storybook addons pre-bundled with the classic JSX
// runtime (e.g. @storybook/addon-a11y withVisionSimulator) can find React even
// when they don't import it explicitly.
(globalThis as Record<string, unknown>)["React"] = React;

function StorybookThemeShell({
  isDark,
  isFullscreen,
  children,
}: {
  readonly children: ReactNode;
  readonly isDark: boolean;
  readonly isFullscreen: boolean;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";

    return () => {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    };
  }, [isDark]);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={
          isFullscreen
            ? "min-h-svh bg-background text-foreground"
            : "bg-background p-4 text-foreground"
        }
      >
        {children}
      </div>
    </TooltipProvider>
  );
}

const themeDecorator: Decorator = (Story, context) => {
  const theme = context.globals["theme"];
  const isDark = theme === "dark";
  const isFullscreen = context.parameters["layout"] === "fullscreen";

  return (
    <StorybookThemeShell isDark={isDark} isFullscreen={isFullscreen}>
      <Story />
    </StorybookThemeShell>
  );
};

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },
    layout: "centered",
    backgrounds: {
      disable: true,
    },
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "label", enabled: true },
        ],
      },
      test: "todo",
    },
    viewport: {
      defaultViewport: "responsive",
      viewports: {
        mobile: {
          name: "Mobile",
          styles: { width: "375px", height: "667px" },
        },
        tablet: {
          name: "Tablet",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Global theme for Afenda design tokens",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [themeDecorator],
};

export default preview;
