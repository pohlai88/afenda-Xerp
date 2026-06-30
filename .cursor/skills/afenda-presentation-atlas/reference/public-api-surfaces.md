# Public API surfaces — `@afenda/shadcn-studio`

**Source:** `packages/shadcn-studio/src/index.ts`

---

## Package constants

| Export | Value |
| --- | --- |
| `SHADCN_STUDIO_PACKAGE_NAME` | `@afenda/shadcn-studio` |
| `SHADCN_STUDIO_PACKAGE_VERSION` | semver placeholder |
| `SHADCN_STUDIO_CSS_PATH` | `./shadcn-studio.css` |

---

## Storybook helpers — `@afenda/shadcn-studio/lab`

Not exported from the main barrel. Import from `@afenda/shadcn-studio/lab` in Storybook only.

| Export | Purpose |
| --- | --- |
| `shadcnStudioBlockDocs` | Docs parameters for blocks |
| `shadcnStudioPrimitivesDocs` | Docs for primitives |
| `shadcnStudioThemeLabDocs` | Theme lab docs |
| `shadcnStudioCenteredLayout` | Story layout |
| `shadcnStudioFullscreenLayout` | Story layout |
| `shadcnStudioPaddedLayout` | Story layout |
| `shadcnStudioPageBlockParameters` | Fullscreen page block params |
| `shadcnStudioDarkThemeGlobals` | Dark globals helper |
| `shadcnStudioStoryA11y` | a11y parameters |

---

## Block components (barrel)

`AccountSettings01Block` … `AccountSettings07Block`, `ChartEarningReportBlock`, `ChartSalesMetricsBlock`, `DatatableInvoiceBlock`, `ActivityDialogBlock`, `SearchDialogBlock`, `LanguageDropdownBlock`, `NotificationDropdownBlock`, `ProfileDropdownBlock`, `ErrorPage02Block`, `HeroSection01Block`, `LoginPage04Block`, `MenuTriggerBlock`, `SidebarUserDropdownBlock`, `StatisticsActivityCardBlock`, `StatisticsCard01Block` … `StatisticsCard03Block`, `StatisticsIncomeCardBlock`, `StatisticsLeadsCardBlock`, `StatisticsLineTrendsCardBlock`, `StatisticsOrdersProgressCardBlock`, `StatisticsProfileTrafficCardBlock`, `StatisticsRevenueCardBlock`, `StatisticsSalesOverviewCardBlock`, `StatisticsTrendCardBlock`, `WidgetPaymentHistoryBlock`, `WidgetSalesByCountriesBlock`, `WidgetTotalEarningBlock`, `WidgetTransactionsBlock`.

See [blocks-inventory.md](./blocks-inventory.md) for slug mapping.

---

## UI primitives (barrel)

| Export | Module |
| --- | --- |
| `Button`, `buttonVariants` | `./components/ui/button.js` |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` | `./components/ui/card.js` |

Other primitives: use filesystem catalog until barrel extended.

---

## Contracts

| Group | Key exports |
| --- | --- |
| Block lifecycle | `BLOCK_LIFECYCLE_ORDER`, `BlockLifecycleState`, `isBlockLifecycleState` |
| Acceptance / seal | `AcceptanceRecordWire`, `validateAcceptanceRecordSeal`, … |
| Block data | `BLOCK_DATA_CONTRACT_REGISTRY` types, `BlockDataContractWire`, … |
| DOM markers | `AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE`, `blockSlotDomMarkerProps` |
| Metadata binding | `MetadataBindingContractWire`, `METADATA_BINDING_PRESENTATION_KINDS`, … |
| Metadata waiver | `MetadataBindingWaiverWire`, … |
| Surface template | `SurfaceTemplateContractWire`, `SURFACE_TEMPLATE_CLASSES`, … |

---

## Registries & assertions

| Export | Role |
| --- | --- |
| `BLOCK_SLOT_REGISTRY`, `getBlockSlotsForBlockId` | Slot roles per block |
| `BLOCK_DATA_CONTRACT_REGISTRY` | Data shape per block |
| `METADATA_BINDING_REGISTRY` | Operator metadata wiring |
| `METADATA_BINDING_WAIVER_REGISTRY` | Waived blocks |
| `METADATA_BINDING_OVERRIDE_REGISTRY` | Overrides |
| `BLOCK_LIFECYCLE_REGISTRY` | Promotion lifecycle |
| `SURFACE_TEMPLATE_REGISTRY` | Surface templates |
| `STUDIO_BLOCK_COMPONENT_REGISTRY` | React component resolution |
| `SHADCN_STUDIO_BLOCK_PARITY_REGISTRY` | Install parity |
| `PRESENTATION_INVENTORY_REGISTRY` | Inventory layers |
| `MCP_SEED_BLOCK_MANIFEST` | MCP seed set |
| `assertBlockSlotDomMarkerCoverage` | Gate helper |
| `assertMetadataBindingCoverage` | Gate helper |
| `buildMetadataBindingFromDataContracts` | Builder |
| `buildPresentationInventoryFromParity` | Builder |

---

## Theme system

| Export | Role |
| --- | --- |
| `themePresets`, `THEME_PRESET_SLUGS`, `ThemePreset` | Preset catalog |
| `applyThemePresetStyles`, `clearThemePresetStyles` | Runtime apply |
| `SettingsProvider`, `useSettings`, `initialSettings` | Settings context |
| `ThemeCustomizer` | Lab customizer component |
| `themeConfig`, `themeConfigValues` | Config object |

**CSS:** import `@afenda/shadcn-studio/shadcn-studio.css` in app composition entries only.

---

## Governance gates touching exports

```bash
pnpm check:studio-metadata-binding
pnpm check:studio-block-slot-markers
pnpm --filter @afenda/shadcn-studio test:run
```
