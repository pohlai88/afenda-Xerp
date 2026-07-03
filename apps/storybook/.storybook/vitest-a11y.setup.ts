import "@storybook/addon-vitest/internal/setup-file";

import * as a11yPreview from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react-vite";

import preview from "./preview";

setProjectAnnotations([a11yPreview, preview]);
