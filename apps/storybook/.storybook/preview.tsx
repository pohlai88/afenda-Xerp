import {
  shadcnStudioLabGlobalTypes,
  shadcnStudioLabInitialGlobals,
  shadcnStudioLabPreviewParameters,
  shadcnStudioStoryA11y,
  shadcnStudioThemeDecorator,
} from "@afenda/shadcn-studio/lab";
import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import React from "react";
import { allModes } from "./modes";
import { mswHandlers } from "./msw-handlers";
import "./preview.css";

initialize({ onUnhandledRequest: "bypass" });

(globalThis as Record<string, unknown>)["React"] = React;

const vitestGlobals = globalThis as Record<string, string | undefined>;
const vitestStorybookRun = vitestGlobals.__AFENDA_VITEST_STORYBOOK__ === "true";
const vitestA11yRun = vitestGlobals.__AFENDA_VITEST_STORYBOOK_A11Y__ === "true";

const preview: Preview = {
  // CSF layering: preview owns global tags, loaders (MSW), parameters, decorators.
  // Meta/story files supply component, args, story-level parameters, play, and smoke tags.
  tags: ["autodocs"],
  loaders: [mswLoader],
  parameters: {
    ...shadcnStudioLabPreviewParameters,
    docs: {
      ...shadcnStudioLabPreviewParameters.docs,
      // Storybook 10 replacement for discontinued @storybook/addon-storysource
      codePanel: true,
    },
    msw: { handlers: mswHandlers },
    chromatic: {
      disableSnapshot: true,
      modes: {
        light: allModes.light,
        dark: allModes.dark,
        "mobile-light": allModes["mobile-light"],
        "mobile-dark": allModes["mobile-dark"],
      },
    },
    ...(vitestStorybookRun && !vitestA11yRun
      ? { a11y: { test: "off" as const } }
      : {}),
    ...(vitestA11yRun
      ? { a11y: { ...shadcnStudioStoryA11y, test: "error" as const } }
      : {}),
    options: {
      // Storybook 10 requires storySort inline (not imported reference).
      storySort: {
        order: [
          "Afenda",
          ["Lab"],
          "Presentation Lab",
          ["Swiss Noir Control Room", "Verdant Milk Noir"],
          "Shadcn Studio",
          [
            "Blocks",
            "Blocks Auto",
            "Blocks Flat",
            "Blocks Preview",
            "App Shell",
            "Assets",
            "Theme Lab",
            "Token Verification",
            "Primitives",
            "Primitives Catalog",
          ],
          "components-ui",
          "components-layouts",
        ],
      },
    },
  },
  globalTypes: shadcnStudioLabGlobalTypes as Preview["globalTypes"],
  initialGlobals: shadcnStudioLabInitialGlobals,
  decorators: [shadcnStudioThemeDecorator],
};

export default preview;
