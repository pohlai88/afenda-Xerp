import {
  shadcnStudioLabGlobalTypes,
  shadcnStudioLabInitialGlobals,
  shadcnStudioLabPreviewParameters,
  shadcnStudioStoryA11y,
  shadcnStudioThemeDecorator,
} from "@afenda/shadcn-studio-v2/lab";
import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import React from "react";
import { sb } from "storybook/test";
import { allModes } from "./modes";
import { mswHandlers } from "./msw-handlers";
import { storybookPortalDecorator } from "./portal.decorator";
// SB 10.4 preview config: https://storybook.js.org/docs/configure#configure-story-rendering
// SB 10.4 bundled CSS (HMR): https://storybook.js.org/docs/configure/styling-and-css
// SB 10.4 global loaders: https://storybook.js.org/docs/writing-stories/loaders
// SB 10.4 building pages (providers + mocks): https://storybook.js.org/docs/writing-stories/build-pages-with-storybook
// MSW bootstrap runs in parallel before render; mock routes live in parameters.msw (not loaded context).
import "./preview.css";

interface VitestStorybookGlobals {
  __AFENDA_VITEST_STORYBOOK__?: string;
  __AFENDA_VITEST_STORYBOOK_A11Y__?: string;
}

const vitestGlobals = globalThis as unknown as VitestStorybookGlobals;
const vitestStorybookRun = vitestGlobals.__AFENDA_VITEST_STORYBOOK__ === "true";
const vitestA11yRun = vitestGlobals.__AFENDA_VITEST_STORYBOOK_A11Y__ === "true";

// MSW — dev + Vitest. Bypass unhandled requests so Storybook internals are not intercepted.
initialize({ onUnhandledRequest: "bypass", quiet: true });

// Preview-level module mock registry (SB 10 agentic). Vite aliases remain fallback.
sb.mock(import("next/navigation"), { spy: true });

const preview: Preview = {
  // CSF layering: preview owns global tags, loaders (MSW), parameters, decorators.
  // Global tags: autodocs + implicit dev/manifest/test (SB 10.4 built-ins).
  // Meta/story files supply component, args, story-level tags/parameters, play, and smoke tags.
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
          "Agentic",
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
            "Auth Shell",
            "Auth Pattern Lab",
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
  decorators: [storybookPortalDecorator, shadcnStudioThemeDecorator],
};

(globalThis as Record<string, unknown>)["React"] = React;

export default preview;
