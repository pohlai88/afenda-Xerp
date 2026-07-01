import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import React from "react";

import {
  shadcnStudioLabGlobalTypes,
  shadcnStudioLabInitialGlobals,
  shadcnStudioLabPreviewParameters,
  shadcnStudioThemeDecorator,
} from "@afenda/shadcn-studio/lab";

import { mswHandlers } from "./msw-handlers";
import { allModes } from "./modes";
import "./preview.css";

initialize({ onUnhandledRequest: "bypass" });

(globalThis as Record<string, unknown>)["React"] = React;

const vitestStorybookRun = __AFENDA_VITEST_STORYBOOK__ === "true";

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
      modes: {
        light: allModes.light,
        dark: allModes.dark,
        "mobile-light": allModes["mobile-light"],
        "mobile-dark": allModes["mobile-dark"],
      },
    },
    ...(vitestStorybookRun ? { a11y: { test: "off" as const } } : {}),
    options: {
      // Storybook 10 requires storySort inline (not imported reference).
      storySort: {
        order: [
          "Afenda",
          ["Lab"],
          "Presentation Lab",
          [
            "Swiss Noir Control Room",
            "Verdant Milk Noir",
          ],
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
        ],
      },
    },
  },
  globalTypes:
    shadcnStudioLabGlobalTypes as Preview["globalTypes"],
  initialGlobals: shadcnStudioLabInitialGlobals,
  decorators: [shadcnStudioThemeDecorator],
};

export default preview;
