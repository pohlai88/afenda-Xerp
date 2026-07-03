import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

// SB 10.4 manager UI: https://storybook.js.org/docs/configure#configure-storybooks-ui
const afendaLabTheme = create({
  base: "light",
  brandTitle: "Afenda Presentation Lab",
  brandTarget: "_self",
  appBg: "#fafafa",
  appContentBg: "#ffffff",
  appBorderColor: "#e5e5e5",
  appBorderRadius: 8,
  barBg: "#ffffff",
  barTextColor: "#171717",
  colorPrimary: "#171717",
  colorSecondary: "#737373",
  fontBase:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  textColor: "#171717",
  textInverseColor: "#fafafa",
  inputBg: "#ffffff",
  inputBorder: "#e5e5e5",
  inputTextColor: "#171717",
  inputBorderRadius: 6,
});

addons.setConfig({
  theme: afendaLabTheme,
  panelPosition: "bottom",
  enableShortcuts: true,
  showToolbar: true,
});
