# Primitives catalog — `@afenda/shadcn-studio`

**Path:** `packages/shadcn-studio/src/components/ui/`  
**Count:** 69 files  
**Import (ERP):** `@afenda/shadcn-studio` when exported in `index.ts`; otherwise deep `@/components/ui/<name>` inside studio package only.

**Barrel exports today:** `Button`, `buttonVariants`, `Card`, `CardAction`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle`.

---

## Actions

| File | Typical export name |
| --- | --- |
| `button.tsx` | `Button`, `buttonVariants` ✓ barrel |
| `button-group.tsx` | `ButtonGroup` |
| `toggle.tsx` | `Toggle` |
| `toggle-group.tsx` | `ToggleGroup` |

## Forms & input

| File | Notes |
| --- | --- |
| `input.tsx` | Text input |
| `textarea.tsx` | Multiline |
| `select.tsx` | Select |
| `native-select.tsx` | Native select |
| `checkbox.tsx` | Checkbox |
| `radio-group.tsx` | Radio group |
| `switch.tsx` | Switch |
| `slider.tsx` | Slider |
| `field.tsx` | Field wrapper |
| `input-group.tsx` | Input group |
| `input-otp.tsx` | OTP input |
| `combobox.tsx` | Combobox |
| `label.tsx` | Label |

## Overlays & menus

| File | Notes |
| --- | --- |
| `dialog.tsx` | Modal — Base UI `render` props (no `asChild`) |
| `alert-dialog.tsx` | Confirm dialog |
| `sheet.tsx` | Side sheet |
| `drawer.tsx` | Drawer |
| `popover.tsx` | Popover |
| `hover-card.tsx` | Hover card |
| `tooltip.tsx` | Tooltip |
| `dropdown-menu.tsx` | Dropdown |
| `context-menu.tsx` | Context menu |
| `menubar.tsx` | Menubar |
| `command.tsx` | Command palette |

## Navigation & structure

| File | Notes |
| --- | --- |
| `tabs.tsx` | Tabs |
| `breadcrumb.tsx` | Breadcrumb |
| `navigation-menu.tsx` | Nav menu |
| `sidebar.tsx` | App sidebar primitive |
| `pagination.tsx` | Pagination |
| `accordion.tsx` | Accordion |
| `collapsible.tsx` | Collapsible |
| `separator.tsx` | Separator |
| `scroll-area.tsx` | Scroll area |
| `resizable.tsx` | Resizable panels |
| `aspect-ratio.tsx` | Aspect ratio |

## Data display

| File | Notes |
| --- | --- |
| `card.tsx` | Card ✓ barrel |
| `table.tsx` | Table |
| `badge.tsx` | Badge |
| `avatar.tsx` | Avatar |
| `chart.tsx` | Chart (recharts) |
| `calendar.tsx` | Calendar |
| `timeline.tsx` | Timeline |
| `empty.tsx` | Empty state |
| `skeleton.tsx` | Skeleton |
| `spinner.tsx` | Spinner |
| `progress.tsx` | Progress bar |
| `circular-progress.tsx` | Circular progress |
| `category-bar.tsx` | Category bar |
| `rating.tsx` | Star rating |
| `number-ticker.tsx` | Animated number |

## Feedback

| File | Notes |
| --- | --- |
| `alert.tsx` | Inline alert |
| `sonner.tsx` | Toast (Sonner) |

## Media & carousel

| File | Notes |
| --- | --- |
| `carousel.tsx` | Carousel |

## Studio / decorative

| File | Notes |
| --- | --- |
| `message.tsx` | Chat message |
| `message-scroller.tsx` | Message scroller |
| `bubble.tsx` | Bubble UI |
| `marker.tsx` | Marker |
| `attachment.tsx` | Attachment chip |
| `item.tsx` | List item |
| `kbd.tsx` | Keyboard key |
| `direction.tsx` | RTL/LTR helper |
| `bg-silk.tsx` | Silk background |
| `bg-dot-grid.tsx` | Dot grid background |
| `border-beam.tsx` | Border beam effect |
| `background-ripple.tsx` | Ripple background |

---

## Storybook

Browse live examples: **Shadcn Studio/Primitives** (`shadcn-studio-primitives.stories.tsx`).

## Extend barrel

When ERP needs a primitive not in `index.ts`, add a named export in `packages/shadcn-studio/src/index.ts` and run `pnpm --filter @afenda/shadcn-studio typecheck`.
