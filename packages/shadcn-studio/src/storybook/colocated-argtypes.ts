/**
 * Colocated primitive CSF — shared argTypes for args-first Gold/Silver stories (Step 8).
 * Import from `../storybook/colocated-argtypes.js` in components-ui/*.stories.tsx.
 */

export const buttonStoryArgTypes = {
  variant: {
    control: "select" as const,
    options: [
      "default",
      "outline",
      "secondary",
      "ghost",
      "destructive",
      "link",
    ],
  },
  size: {
    control: "select" as const,
    options: [
      "default",
      "xs",
      "sm",
      "lg",
      "icon",
      "icon-xs",
      "icon-sm",
      "icon-lg",
    ],
  },
  disabled: { control: "boolean" as const },
  onClick: { description: "Fires when the ERP action button is activated." },
} as const;

export const checkboxStoryArgTypes = {
  disabled: { control: "boolean" as const },
  defaultChecked: { control: "boolean" as const },
  onCheckedChange: {
    description: "Fires when the checkbox checked state changes.",
  },
} as const;

export const inputStoryArgTypes = {
  type: {
    control: "select" as const,
    options: ["text", "email", "password", "search", "tel", "url"],
  },
  disabled: { control: "boolean" as const },
  placeholder: { control: "text" as const },
  onChange: { description: "Fires when the field value changes." },
  onBlur: { description: "Fires when the field loses focus." },
} as const;

export const switchStoryArgTypes = {
  size: {
    control: "select" as const,
    options: ["default", "sm"],
  },
  variant: {
    control: "select" as const,
    options: ["default", "outline"],
  },
  disabled: { control: "boolean" as const },
  defaultChecked: { control: "boolean" as const },
  onCheckedChange: {
    description: "Fires when the switch checked state changes.",
  },
} as const;

export const toggleStoryArgTypes = {
  variant: {
    control: "select" as const,
    options: ["default", "outline"],
  },
  disabled: { control: "boolean" as const },
  onPressedChange: {
    description: "Fires when the toggle pressed state changes.",
  },
} as const;
