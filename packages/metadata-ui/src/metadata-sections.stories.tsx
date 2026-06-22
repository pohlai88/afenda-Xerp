import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { withRawStoryCanvas } from "./_storybook/metadata-story.decorators";
import {
  metadataDarkThemeGlobals,
  metadataFullscreenLayout,
  metadataMobileViewport,
  metadataPaddedLayout,
  metadataStoryA11y,
} from "./_storybook/metadata-story.parameters";
import type { MetadataSpecificSectionProps } from "./contracts/section.contract";
import {
  sampleDiagnosticsRenderContext,
  sampleRenderContext,
} from "./fixtures/sample-runtime-context.fixture";
import {
  ActionSection,
  AuditSection,
  ChartSection,
  DetailSection,
  FormSection,
  ListSection,
  MetadataSection,
  StatSection,
} from "./sections/index";

const BASE_SECTION_ARGS = {
  context: sampleRenderContext,
  presentation: { padded: true },
} satisfies Partial<MetadataSpecificSectionProps>;

const meta = {
  title: "Metadata/Sections",
  tags: ["autodocs"],
  parameters: {
    ...metadataPaddedLayout,
    docs: {
      description: {
        component:
          "Governed section chrome from `@afenda/metadata-ui`. Each governed `SectionType` from `@afenda/metadata` (list, stat, chart, form, detail, audit, action) has a typed wrapper. All emit `data-metadata-section`, structural slot hooks, and container queries. Design tokens are not owned here — the consuming shell applies visual styling.",
      },
    },
    a11y: metadataStoryA11y,
  },
  decorators: [withRawStoryCanvas],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = {
  render: () => (
    <ListSection
      {...BASE_SECTION_ARGS}
      identity={{ id: "story.section.list", title: "Open pick lines" }}
      slots={{
        content: (
          <table>
            <thead>
              <tr>
                <th scope="col">Wave</th>
                <th scope="col">Location</th>
                <th scope="col">Lines</th>
                <th scope="col">Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>W-22018</code>
                </td>
                <td className="metadata-truncate" style={{ maxWidth: "12rem" }}>
                  WH-NORTHEAST-04-BULK-AISLE-12
                </td>
                <td className="metadata-numeric">142</td>
                <td>High</td>
              </tr>
              <tr>
                <td>
                  <code>W-22019</code>
                </td>
                <td className="metadata-truncate" style={{ maxWidth: "12rem" }}>
                  WH-NORTHEAST-02-PICK-AISLE-07
                </td>
                <td className="metadata-numeric">86</td>
                <td>Standard</td>
              </tr>
              <tr>
                <td>
                  <code>W-22020</code>
                </td>
                <td className="metadata-truncate" style={{ maxWidth: "12rem" }}>
                  WH-SOUTHEAST-01-BULK-AISLE-03
                </td>
                <td className="metadata-numeric">34</td>
                <td>Low</td>
              </tr>
            </tbody>
          </table>
        ),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-section="list"` — ERP pick-line table with `metadata-truncate` on long location codes and `metadata-numeric` on counts.',
      },
    },
  },
};

export const Stat: Story = {
  render: () => (
    <StatSection
      {...BASE_SECTION_ARGS}
      identity={{
        id: "story.section.stat",
        title: "Shift metrics",
        description: "Wave WH-22018 · current shift",
      }}
      slots={{
        content: (
          <dl
            style={{
              display: "grid",
              gap: "0.75rem 1.5rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))",
            }}
          >
            {[
              { label: "Open orders", value: "1,284" },
              { label: "Fulfillment rate", value: "96.2%" },
              { label: "Cycle time", value: "4.3 h" },
              { label: "At risk", value: "38" },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                  {label}
                </dt>
                <dd
                  className="metadata-numeric"
                  style={{
                    fontSize: "clamp(1.25rem, 1.5cqi, 1.75rem)",
                    margin: 0,
                  }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        ),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-section="stat"` — shift KPI stat block. Numbers use `metadata-numeric` for tabular-nums rendering. Accent styling is shell-owned.',
      },
    },
  },
};

export const Chart: Story = {
  render: () => (
    <ChartSection
      {...BASE_SECTION_ARGS}
      identity={{
        id: "story.section.chart",
        title: "Fulfillment trend",
        description: "Last 7 shifts — daily rate",
      }}
      slots={{
        content: (
          <div
            aria-label="Fulfillment rate trend placeholder — 7-day sparkline"
            role="img"
            style={{
              alignItems: "flex-end",
              display: "flex",
              gap: "6px",
              height: "4rem",
            }}
          >
            {(
              [
                { day: "d-6", value: 82 },
                { day: "d-5", value: 89 },
                { day: "d-4", value: 91 },
                { day: "d-3", value: 87 },
                { day: "d-2", value: 94 },
                { day: "d-1", value: 96 },
                { day: "d-0", value: 96 },
              ] as const
            ).map(({ day, value }) => (
              <div
                key={day}
                style={{
                  background: "currentColor",
                  flex: "1 1 0",
                  height: `${(value / 100) * 100}%`,
                  opacity: day === "d-0" ? 1 : 0.4,
                }}
                title={`${value}%`}
              />
            ))}
          </div>
        ),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-section="chart"` — shell-rendered chart placeholder. metadata-ui provides structural chrome only; the consuming shell or a chart library owns rendering.',
      },
    },
  },
};

export const Form: Story = {
  render: () => (
    <FormSection
      {...BASE_SECTION_ARGS}
      identity={{
        id: "story.section.form",
        title: "Release wave",
        description: "Assign and release pick wave to warehouse staff",
      }}
      slots={{
        content: (
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
            }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                htmlFor="story-wave-id"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                Wave
              </label>
              <input
                defaultValue="W-22018"
                id="story-wave-id"
                readOnly
                style={{ fontSize: "1rem", padding: "0.5rem", width: "100%" }}
                type="text"
              />
            </div>
            <div>
              <label
                htmlFor="story-assignee"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                Assign to
              </label>
              <input
                id="story-assignee"
                placeholder="Staff member name"
                style={{ fontSize: "1rem", padding: "0.5rem", width: "100%" }}
                type="text"
              />
            </div>
            <div className="metadata-action-bar">
              <button
                className="metadata-action-button"
                data-action-group="primary"
                style={{ marginInlineStart: "auto" }}
                type="submit"
              >
                Release pick wave
              </button>
            </div>
          </form>
        ),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-section="form"` — section chrome wrapping a wave release form. Form controls and validation logic are consumer-owned.',
      },
    },
  },
};

export const Detail: Story = {
  render: () => (
    <DetailSection
      {...BASE_SECTION_ARGS}
      identity={{
        id: "story.section.detail",
        title: "Order ORD-10482",
      }}
      slots={{
        content: (
          <dl
            style={{
              display: "grid",
              gap: "0.5rem 1.5rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))",
            }}
          >
            {[
              { label: "Customer", value: "Sample Trading Co." },
              { label: "Order date", value: "2026-06-18" },
              { label: "Requested ship", value: "2026-06-22" },
              { label: "Net value", value: "$4,820.00" },
              { label: "Credit status", value: "Hold" },
              { label: "Warehouse", value: "WH-NORTHEAST" },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                  {label}
                </dt>
                <dd className="metadata-wrap-anywhere" style={{ margin: 0 }}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        ),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-section="detail"` — structured record detail layout using `metadata-wrap-anywhere` on long values.',
      },
    },
  },
};

export const Audit: Story = {
  render: () => (
    <AuditSection
      {...BASE_SECTION_ARGS}
      identity={{
        id: "story.section.audit",
        title: "Audit trail",
        description: "Immutable event log for ORD-10482",
      }}
      slots={{
        content: (
          <ol
            aria-label="Audit events"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {[
              {
                actor: "system",
                event: "Order created",
                meta: "Customer PO REF-22081",
                time: "2026-06-18 09:14",
              },
              {
                actor: "finance",
                event: "Credit check initiated",
                meta: "Limit $5,000 · exposure $4,820",
                time: "2026-06-18 09:15",
              },
              {
                actor: "finance",
                event: "Credit hold applied",
                meta: "Exposure exceeds limit for Sample Trading Co.",
                time: "2026-06-18 09:16",
              },
              {
                actor: "jordan.chen",
                event: "Manual override requested",
                meta: "Approval pending CFO",
                time: "2026-06-20 14:03",
              },
            ].map(({ time, event, actor, meta }) => (
              <li key={time} style={{ display: "grid", gap: "0.125rem" }}>
                <strong style={{ fontSize: "0.875rem" }}>{event}</strong>
                <span style={{ fontSize: "0.75rem" }}>
                  <time dateTime={time}>{time}</time> · {actor}
                </span>
                <span
                  className="metadata-wrap-anywhere"
                  style={{ fontSize: "0.8125rem" }}
                >
                  {meta}
                </span>
              </li>
            ))}
          </ol>
        ),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-section="audit"` — immutable audit trail for an order. `metadata-wrap-anywhere` prevents long strings from overflowing narrow viewports.',
      },
    },
  },
};

export const Action: Story = {
  render: () => (
    <ActionSection
      {...BASE_SECTION_ARGS}
      identity={{
        id: "story.section.action",
        title: "Bulk actions",
      }}
      slots={{
        content: (
          <div className="metadata-action-bar">
            <button
              className="metadata-action-button"
              data-action-group="secondary"
              type="button"
            >
              Export selection
            </button>
            <button
              className="metadata-action-button"
              data-action-group="secondary"
              type="button"
            >
              Print pick list
            </button>
            <button
              className="metadata-action-button"
              data-action-group="primary"
              style={{ marginInlineStart: "auto" }}
              type="button"
            >
              Release pick wave
            </button>
          </div>
        ),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-section="action"` — governed action group section. `data-action-group` hooks are structural; shell owns accent treatment on primary.',
      },
    },
  },
};

export const SectionCollapsed: Story = {
  render: () => (
    <ListSection
      {...BASE_SECTION_ARGS}
      identity={{ id: "story.section.collapsed", title: "Collapsed section" }}
      slots={{
        content: <p>This content is not rendered when collapsed.</p>,
      }}
      state={{
        visibility: "collapsed",
        reason: "Collapsed for brevity in this story.",
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`visibility: "collapsed"` — content slot is suppressed; header and actions still render. Useful for progressive disclosure patterns.',
      },
    },
  },
};

export const SectionDisabled: Story = {
  render: () => (
    <ListSection
      {...BASE_SECTION_ARGS}
      identity={{ id: "story.section.disabled", title: "Period close active" }}
      slots={{
        content: <p>Section content rendered but interactions are disabled.</p>,
      }}
      state={{
        visibility: "disabled",
        reason: "Period close is active for this company.",
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`visibility: "disabled"` — section chrome applies `metadata-section-disabled`. `data-visibility-reason` is available for consumer tooltip or screen-reader copy.',
      },
    },
  },
};

export const SectionReadonly: Story = {
  render: () => (
    <ListSection
      {...BASE_SECTION_ARGS}
      identity={{ id: "story.section.readonly", title: "Archived order lines" }}
      slots={{
        content: <p>Content is read-only. No actions permitted.</p>,
      }}
      state={{
        visibility: "visible",
        readonly: true,
        reason: "Order archived.",
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`readonly: true` — section emits `metadata-section-readonly` class and `data-metadata-readonly="true"`. No line-through on actions by default.',
      },
    },
  },
};

export const AllSectionsOverview: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "1.5rem",
      }}
    >
      {(
        [
          ["list", "Pick lines", "Open pick waves by priority"],
          ["stat", "Shift metrics", "Fulfillment KPIs for current shift"],
          ["chart", "Trend", "7-shift fulfillment rate trend"],
          ["form", "Release wave", "Assign and release wave to staff"],
          ["detail", "ORD-10482", "Order master data"],
          ["audit", "Audit trail", "Immutable event log"],
          ["action", "Bulk actions", "Governed action group"],
        ] as const
      ).map(([type, title, description]) => (
        <MetadataSection
          context={sampleRenderContext}
          identity={{
            description,
            id: `story.section.overview.${type}`,
            title,
          }}
          key={type}
          presentation={{ padded: true }}
          slots={{
            content: (
              <p style={{ fontSize: "0.875rem" }}>
                <code>data-metadata-section=&quot;{type}&quot;</code> —{" "}
                {description}.
              </p>
            ),
          }}
          type={type}
        />
      ))}
    </div>
  ),
  parameters: {
    ...metadataFullscreenLayout,
    docs: {
      description: {
        story:
          "All 7 governed section types rendered sequentially. Use as a fast visual scan of structural hook coverage before design-system styling is applied.",
      },
    },
  },
};

export const DiagnosticsEnabled: Story = {
  render: () => (
    <ListSection
      {...BASE_SECTION_ARGS}
      context={sampleDiagnosticsRenderContext}
      diagnostics={{
        rendererKey: "story.diagnostics.list",
        rendererVersion: "1",
      }}
      identity={{
        id: "story.section.diagnostics",
        title: "Pick lines (diagnostics)",
      }}
      slots={{
        content: (
          <p>
            Diagnostics panel renders when `context.diagnostics.enabled` is
            true.
          </p>
        ),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Section with diagnostics enabled — `data-renderer-key` and `data-renderer-version` attributes visible in the DOM.",
      },
    },
  },
};

export const Mobile: Story = {
  ...AllSectionsOverview,
  parameters: {
    ...AllSectionsOverview.parameters,
    ...metadataMobileViewport,
    docs: {
      description: {
        story:
          "All section types at mobile width — validates wrap and overflow behaviour.",
      },
    },
  },
};

export const DarkTheme: Story = {
  ...Stat,
  globals: metadataDarkThemeGlobals,
  parameters: {
    docs: {
      description: {
        story:
          "Stat section under dark Afenda tokens. Shell owns accent; metadata-ui provides structure.",
      },
    },
  },
};
