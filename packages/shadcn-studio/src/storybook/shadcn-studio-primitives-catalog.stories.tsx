/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioStoryA11y,
} from "../lab/index.js";

const meta = {
  title: "Shadcn Studio/Primitives Catalog",
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "Stock shadcn/studio primitives from @afenda/shadcn-studio (MCP seed). Inventory of colocated primitive autodocs — open each component story for controls and prop tables.",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inventory: Story = {
  render: () => (
    <ul className="grid max-w-lg list-none gap-2 p-0 text-sm">
      <li key="accordion">
        <code>accordion</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="alert">
        <code>alert</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="alert-dialog">
        <code>alert-dialog</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="aspect-ratio">
        <code>aspect-ratio</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="attachment">
        <code>attachment</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="avatar">
        <code>avatar</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="background-ripple">
        <code>background-ripple</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="badge">
        <code>badge</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="bg-dot-grid">
        <code>bg-dot-grid</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="bg-silk">
        <code>bg-silk</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="border-beam">
        <code>border-beam</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="breadcrumb">
        <code>breadcrumb</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="bubble">
        <code>bubble</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="button">
        <code>button</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="button-group">
        <code>button-group</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="calendar">
        <code>calendar</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="card">
        <code>card</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="carousel">
        <code>carousel</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="category-bar">
        <code>category-bar</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="chart">
        <code>chart</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="checkbox">
        <code>checkbox</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="circular-progress">
        <code>circular-progress</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="collapsible">
        <code>collapsible</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="combobox">
        <code>combobox</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="command">
        <code>command</code>
        <span className="text-muted-foreground"> — complex</span>
      </li>
      <li key="context-menu">
        <code>context-menu</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="dialog">
        <code>dialog</code>
        <span className="text-muted-foreground"> — complex</span>
      </li>
      <li key="direction">
        <code>direction</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="drawer">
        <code>drawer</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="dropdown-menu">
        <code>dropdown-menu</code>
        <span className="text-muted-foreground"> — complex</span>
      </li>
      <li key="empty">
        <code>empty</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="field">
        <code>field</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="hover-card">
        <code>hover-card</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="input">
        <code>input</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="input-group">
        <code>input-group</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="input-otp">
        <code>input-otp</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="item">
        <code>item</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="kbd">
        <code>kbd</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="label">
        <code>label</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="marker">
        <code>marker</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="menubar">
        <code>menubar</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="message">
        <code>message</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="message-scroller">
        <code>message-scroller</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="native-select">
        <code>native-select</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="navigation-menu">
        <code>navigation-menu</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="number-ticker">
        <code>number-ticker</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="pagination">
        <code>pagination</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="popover">
        <code>popover</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="progress">
        <code>progress</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="radio-group">
        <code>radio-group</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="rating">
        <code>rating</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="resizable">
        <code>resizable</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="scroll-area">
        <code>scroll-area</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="select">
        <code>select</code>
        <span className="text-muted-foreground"> — complex</span>
      </li>
      <li key="separator">
        <code>separator</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="sheet">
        <code>sheet</code>
        <span className="text-muted-foreground"> — complex</span>
      </li>
      <li key="sidebar">
        <code>sidebar</code>
        <span className="text-muted-foreground"> — complex</span>
      </li>
      <li key="skeleton">
        <code>skeleton</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="slider">
        <code>slider</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="sonner">
        <code>sonner</code>
        <span className="text-muted-foreground"> — complex</span>
      </li>
      <li key="spinner">
        <code>spinner</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="switch">
        <code>switch</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="table">
        <code>table</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="tabs">
        <code>tabs</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="textarea">
        <code>textarea</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="timeline">
        <code>timeline</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="toggle">
        <code>toggle</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="toggle-group">
        <code>toggle-group</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
      <li key="tooltip">
        <code>tooltip</code>
        <span className="text-muted-foreground"> — simple</span>
      </li>
    </ul>
  ),
};

export const InventoryDark: Story = {
  ...Inventory,
  globals: shadcnStudioDarkThemeGlobals,
};
