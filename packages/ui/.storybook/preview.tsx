import type { Preview } from "@storybook/react-vite";
import type { ReactNode } from "react";

import "./preview.css";

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
      default: "canvas",
      values: [
        {
          name: "canvas",
          value: "oklch(0.986 0.006 85)",
        },
        {
          name: "card",
          value: "oklch(0.998 0.002 85)",
        },
        {
          name: "dark",
          value: "oklch(0.18 0.025 255)",
        },
      ],
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
      description: "Global theme",
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
  decorators: [
    (Story, context) => {
      const theme = context.globals["theme"] === "dark" ? "dark" : "";
      const wrapper = (
        <div className={theme}>
          <div className="bg-background text-foreground p-4">
            <Story />
          </div>
        </div>
      ) satisfies ReactNode;

      return wrapper;
    },
  ],
};

export default preview;
