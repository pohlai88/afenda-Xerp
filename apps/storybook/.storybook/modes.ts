/** Chromatic Story Modes — globals must match `.storybook/preview.tsx` toolbar keys. */
export const allModes = {
  light: {
    theme: "light",
  },
  dark: {
    theme: "dark",
  },
  "mobile-light": {
    theme: "light",
    viewport: "mobile",
  },
  "mobile-dark": {
    theme: "dark",
    viewport: "mobile",
  },
} as const;

export type AfendaStorybookMode = keyof typeof allModes;
