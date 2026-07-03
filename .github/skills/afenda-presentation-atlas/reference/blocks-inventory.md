# Blocks inventory — `@afenda/shadcn-studio`

**Path:** `packages/shadcn-studio/src/components-layouts/`  
**Manifest:** `packages/shadcn-studio/src/storybook/block-story-manifest.generated.json` (regenerate: `pnpm storybook generate`)

---

## Story classes

| Class | Count | Storybook | Rule |
| --- | --- | --- | --- |
| **Auto** (folder-based) | 10 | `Shadcn Studio/Blocks Auto` | Codegen one story per folder block |
| **Manual** (flat prop-driven) | 31 | `Shadcn Studio/Blocks` | Curated story in `shadcn-studio-blocks.stories.tsx` |

---

## Auto stories (folder blocks)

| Slug | Barrel export | Layout |
| --- | --- | --- |
| `account-settings-01` | `AccountSettings01Block` | fullscreen |
| `account-settings-02` | `AccountSettings02Block` | fullscreen |
| `account-settings-03` | `AccountSettings03Block` | fullscreen |
| `account-settings-04` | `AccountSettings04Block` | fullscreen |
| `account-settings-05` | `AccountSettings05Block` | fullscreen |
| `account-settings-06` | `AccountSettings06Block` | fullscreen |
| `account-settings-07` | `AccountSettings07Block` | fullscreen |
| `error-page-02` | `ErrorPage02Block` | fullscreen |
| `hero-section-01` | `HeroSection01Block` | centered |
| `login-page-04` | `LoginPage04Block` | fullscreen |

---

## Manual stories (flat blocks)

Curated stories required — add to `shadcn-studio-blocks.stories.tsx` when installing or changing these.

| Slug | Barrel export (if any) | Category |
| --- | --- | --- |
| `chart-earning-report` | `ChartEarningReportBlock` | chart |
| `chart-sales-metrics` | `ChartSalesMetricsBlock` | chart |
| `chart-total-revenue` | — (check filesystem) | chart |
| `dashboard-dialog-03` | — | dialog |
| `dashboard-dialog-09` | — | dialog |
| `datatable-invoice` | `DatatableInvoiceBlock` | data table |
| `dialog-activity` | `ActivityDialogBlock` | dialog |
| `dialog-search` | `SearchDialogBlock` | dialog |
| `dropdown-language` | `LanguageDropdownBlock` | dropdown |
| `dropdown-notification` | `NotificationDropdownBlock` | dropdown |
| `dropdown-profile` | `ProfileDropdownBlock` | dropdown |
| `menu-trigger` | `MenuTriggerBlock` | shell |
| `sidebar-user-dropdown` | `SidebarUserDropdownBlock` | shell |
| `statistics-activity-card` | `StatisticsActivityCardBlock` | statistics |
| `statistics-card-01` | `StatisticsCard01Block` | statistics |
| `statistics-card-02` | `StatisticsCard02Block` | statistics |
| `statistics-card-03` | `StatisticsCard03Block` | statistics |
| `statistics-card-04` | — | statistics |
| `statistics-expense-card` | — | statistics |
| `statistics-income-card` | `StatisticsIncomeCardBlock` | statistics |
| `statistics-leads-card` | `StatisticsLeadsCardBlock` | statistics |
| `statistics-line-trends-card` | `StatisticsLineTrendsCardBlock` | statistics |
| `statistics-orders-progress-card` | `StatisticsOrdersProgressCardBlock` | statistics |
| `statistics-profile-traffic-card` | `StatisticsProfileTrafficCardBlock` | statistics |
| `statistics-revenue-card` | `StatisticsRevenueCardBlock` | statistics |
| `statistics-sales-overview-card` | `StatisticsSalesOverviewCardBlock` | statistics |
| `statistics-trend-card` | `StatisticsTrendCardBlock` | statistics |
| `widget-payment-history` | `WidgetPaymentHistoryBlock` | widget |
| `widget-sales-by-countries` | `WidgetSalesByCountriesBlock` | widget |
| `widget-total-earning` | `WidgetTotalEarningBlock` | widget |
| `widget-transactions` | `WidgetTransactionsBlock` | widget |

**Barrel gap:** rows marked `—` may exist on disk but lack `index.ts` export — add export before ERP import.

---

## MCP registry names

Filesystem `blockId` ≠ `@ss-blocks/*` registry id. Install map: [`shadcn-studio/reference/base-vega-install.md`](../../shadcn-studio/reference/base-vega-install.md).

Post-install: restore `blockSlotDomMarkerProps`, fix Base UI `render` props, `pnpm storybook generate`.
