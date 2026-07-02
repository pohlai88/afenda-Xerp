import "@storybook/addon-vitest/internal/setup-file";

import a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react-vite";

import preview from "./preview";

setProjectAnnotations([a11yAddonAnnotations, preview]);
