import type { MetadataRenderableAction } from "../contracts/action.contract.js";

export const hierarchyActionFixtures = [
  {
    key: "export-selection",
    label: "Export selection",
    kind: "button",
    presentation: { group: "secondary", order: 10 },
  },
  {
    key: "release-wave",
    label: "Release pick wave",
    kind: "button",
    presentation: { group: "primary", order: 20 },
  },
  {
    key: "fulfillment-guide",
    label: "Fulfillment guide",
    kind: "link",
    href: "/help/fulfillment",
    presentation: { group: "help", order: 30 },
  },
] as const satisfies readonly MetadataRenderableAction[];

export const multiplePrimaryActionFixtures = [
  {
    key: "release-wave",
    label: "Release pick wave",
    kind: "button",
    presentation: { group: "primary", order: 10 },
  },
  {
    key: "create-order",
    label: "Create order",
    kind: "button",
    presentation: { group: "primary", order: 20 },
  },
] as const satisfies readonly MetadataRenderableAction[];

export const disabledActionFixtures = [
  {
    key: "release-wave",
    label: "Release pick wave",
    kind: "button",
    visibility: "disabled",
    reason: "Period close is active for this company.",
    presentation: { group: "primary", order: 10 },
  },
  {
    key: "export-selection",
    label: "Export selection",
    kind: "button",
    presentation: { group: "secondary", order: 20 },
  },
] as const satisfies readonly MetadataRenderableAction[];

export const hiddenActionFixtures = [
  {
    key: "release-wave",
    label: "Release pick wave",
    kind: "button",
    visibility: "hidden",
    presentation: { group: "primary", order: 10 },
  },
  {
    key: "refresh-queue",
    label: "Refresh queue",
    kind: "button",
    presentation: { group: "secondary", order: 20 },
  },
] as const satisfies readonly MetadataRenderableAction[];

export const interactiveActionFixtures = [
  {
    key: "refresh-queue",
    label: "Refresh queue",
    kind: "button",
    presentation: { group: "secondary" },
  },
  {
    key: "save-draft",
    label: "Save draft",
    kind: "button",
    presentation: { group: "primary" },
  },
] as const satisfies readonly MetadataRenderableAction[];
