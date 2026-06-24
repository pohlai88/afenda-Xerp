import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { withRawStoryCanvas } from "./_storybook/metadata-story.decorators";
import {
  metadataCenteredLayout,
  metadataDarkThemeGlobals,
  metadataFullscreenLayout,
  metadataMobileViewport,
  metadataStoryA11y,
} from "./_storybook/metadata-story.parameters";
import type { MetadataSpecificLayoutProps } from "./contracts/layout.contract";
import {
  sampleDiagnosticsRenderContext,
  sampleRenderContext,
} from "./fixtures/sample-runtime-context.fixture";
import {
  DashboardLayout,
  GridLayout,
  PanelLayout,
  StackLayout,
  TabsLayout,
  WizardLayout,
} from "./layouts/index";

const SHARED_LAYOUT_CONTEXT = sampleRenderContext;

function makeSharedSlots(content: ReactNode) {
  return {
    header: (
      <header>
        <h1 className="metadata-layout-title">Warehouse operations</h1>
        <p className="metadata-layout-description">
          Order fulfilment · Wave WH-22018
        </p>
      </header>
    ),
    toolbar: (
      <div className="metadata-layout-toolbar">
        <span style={{ fontSize: "0.875rem" }}>Shift 1 · 07:00 – 15:00</span>
        <span style={{ fontSize: "0.875rem", marginInlineStart: "auto" }}>
          142 open pick lines
        </span>
      </div>
    ),
    content,
    footer: (
      <footer>
        <p style={{ fontSize: "0.75rem" }}>Last refreshed 2 min ago</p>
      </footer>
    ),
  };
}

const LAYOUT_CONTENT = (
  <section className="metadata-section">
    <h2 className="metadata-section-title">Pick lines</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Wave</th>
          <th scope="col">Lines</th>
          <th scope="col">Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>W-22018</code>
          </td>
          <td className="metadata-numeric">142</td>
          <td>High</td>
        </tr>
        <tr>
          <td>
            <code>W-22019</code>
          </td>
          <td className="metadata-numeric">86</td>
          <td>Standard</td>
        </tr>
      </tbody>
    </table>
  </section>
);

const ASIDE_CONTENT = (
  <section className="metadata-section">
    <h2 className="metadata-section-title">Selected wave</h2>
    <dl>
      <div>
        <dt style={{ fontSize: "0.75rem", fontWeight: 600 }}>Wave</dt>
        <dd className="metadata-numeric">W-22018</dd>
      </div>
      <div>
        <dt style={{ fontSize: "0.75rem", fontWeight: 600 }}>Lines</dt>
        <dd className="metadata-numeric">142</dd>
      </div>
    </dl>
  </section>
);

const BASE_LAYOUT_ARGS = {
  context: SHARED_LAYOUT_CONTEXT,
  presentation: { contained: true, padded: true },
  slots: makeSharedSlots(LAYOUT_CONTENT),
} satisfies Partial<MetadataSpecificLayoutProps>;

const meta = {
  title: "Metadata/Layouts",
  tags: ["autodocs"],
  parameters: {
    ...metadataFullscreenLayout,
    docs: {
      description: {
        component:
          "Governed layout chrome from `@afenda/metadata-ui`. Each governed `LayoutType` from `@afenda/metadata` maps to a typed wrapper. Structural hooks and container queries only — visual tokens wire through `@afenda/ui/governance` (`resolveMetadataUiSlotClassName`). See Metadata/Authority Preview.",
      },
    },
    a11y: metadataStoryA11y,
  },
  decorators: [withRawStoryCanvas],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  render: () => (
    <DashboardLayout
      {...BASE_LAYOUT_ARGS}
      identity={{
        id: "story.layout.dashboard",
        label: "Warehouse shift dashboard",
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Fulfillment operations dashboard — `data-metadata-layout="dashboard"`. Aside stacks alongside content at ≥ 48rem container width.',
      },
    },
  },
};

export const DashboardWithAside: Story = {
  render: () => (
    <DashboardLayout
      {...BASE_LAYOUT_ARGS}
      identity={{
        id: "story.layout.dashboard-aside",
        label: "Dashboard with aside",
      }}
      slots={{
        ...makeSharedSlots(LAYOUT_CONTENT),
        aside: ASIDE_CONTENT,
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Dashboard layout with the optional aside slot populated — validates container-query side-by-side behaviour.",
      },
    },
  },
};

export const Grid: Story = {
  render: () => (
    <GridLayout
      {...BASE_LAYOUT_ARGS}
      identity={{ id: "story.layout.grid", label: "Product catalogue grid" }}
      slots={makeSharedSlots(
        <section className="metadata-section">
          <h2 className="metadata-section-title">SKU catalogue</h2>
          <p>Grid layout — use for multi-column item lists.</p>
          <p className="metadata-numeric">2,840 active SKUs · 16 categories</p>
        </section>
      )}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-layout="grid"` — multi-column item catalogue. Shell may inject responsive CSS grid on the content region.',
      },
    },
  },
};

export const Panel: Story = {
  render: () => (
    <PanelLayout
      {...BASE_LAYOUT_ARGS}
      identity={{ id: "story.layout.panel", label: "Order detail panel" }}
      slots={makeSharedSlots(
        <section className="metadata-section">
          <h2 className="metadata-section-title">Order ORD-10482</h2>
          <dl>
            <div>
              <dt style={{ fontSize: "0.75rem", fontWeight: 600 }}>Customer</dt>
              <dd>Sample Trading Co.</dd>
            </div>
            <div>
              <dt style={{ fontSize: "0.75rem", fontWeight: 600 }}>Total</dt>
              <dd className="metadata-numeric">$4,820.00</dd>
            </div>
            <div>
              <dt style={{ fontSize: "0.75rem", fontWeight: 600 }}>Status</dt>
              <dd>Credit hold</dd>
            </div>
          </dl>
        </section>
      )}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-layout="panel"` — bounded detail surface. Typically used for single-record inspection or slide-over panels.',
      },
    },
  },
};

export const Stack: Story = {
  render: () => (
    <StackLayout
      {...BASE_LAYOUT_ARGS}
      identity={{ id: "story.layout.stack", label: "Receiving queue" }}
      slots={makeSharedSlots(
        <section className="metadata-section">
          <h2 className="metadata-section-title">Inbound receipts</h2>
          <p>
            Stack layout — linear sections flow top-to-bottom. Preferred for
            settings, forms, and narrow surfaces.
          </p>
          <p className="metadata-numeric">7 pending receipts</p>
        </section>
      )}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-layout="stack"` — vertical composition of sequential sections (settings, forms, narrow surfaces).',
      },
    },
  },
};

export const Tabs: Story = {
  render: () => (
    <TabsLayout
      {...BASE_LAYOUT_ARGS}
      identity={{
        id: "story.layout.tabs",
        label: "Order fulfilment workspace",
      }}
      slots={{
        header: (
          <header>
            <h1 className="metadata-layout-title">
              ORD-10482 — Sample Trading Co.
            </h1>
          </header>
        ),
        toolbar: (
          <nav aria-label="Order sections" className="metadata-layout-toolbar">
            {["Details", "Lines", "Shipments", "Audit"].map((tab, index) => (
              <button
                aria-selected={index === 0}
                className="metadata-action-button"
                key={tab}
                role="tab"
                style={{ fontWeight: index === 0 ? 600 : undefined }}
                type="button"
              >
                {tab}
              </button>
            ))}
          </nav>
        ),
        content: (
          <section className="metadata-section">
            <h2 className="metadata-section-title">Order details</h2>
            <p>
              Active tab panel — metadata-ui provides
              `data-metadata-layout="tabs"` and toolbar slot for the tab list.
            </p>
          </section>
        ),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-layout="tabs"` — toolbar slot carries a tab list; content slot renders the active panel. Interaction logic is consumer-owned.',
      },
    },
  },
};

export const Wizard: Story = {
  render: () => (
    <WizardLayout
      {...BASE_LAYOUT_ARGS}
      identity={{ id: "story.layout.wizard", label: "Create purchase order" }}
      slots={{
        header: (
          <header>
            <h1 className="metadata-layout-title">Create purchase order</h1>
            <p className="metadata-layout-description">
              Step 2 of 4 — Line items
            </p>
          </header>
        ),
        toolbar: (
          <nav aria-label="Wizard steps" className="metadata-layout-toolbar">
            {["Supplier", "Line items", "Delivery", "Review"].map(
              (step, index) => (
                <span
                  aria-current={index === 1 ? "step" : undefined}
                  key={step}
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: index === 1 ? 600 : undefined,
                    opacity: index > 1 ? 0.5 : undefined,
                  }}
                >
                  {index + 1}. {step}
                </span>
              )
            )}
          </nav>
        ),
        content: (
          <section className="metadata-section">
            <h2 className="metadata-section-title">Line items</h2>
            <p>
              Wizard step panel — `data-metadata-layout="wizard"`. Progress
              indicator is consumer-owned; metadata-ui exposes the toolbar slot.
            </p>
          </section>
        ),
        footer: (
          <footer className="metadata-layout-footer">
            <div className="metadata-action-bar">
              <button className="metadata-action-button" type="button">
                Back
              </button>
              <button
                className="metadata-action-button"
                data-action-group="primary"
                style={{ marginInlineStart: "auto" }}
                type="button"
              >
                Continue
              </button>
            </div>
          </footer>
        ),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`data-metadata-layout="wizard"` — step indicator in toolbar slot, navigation actions in footer slot. Step state is consumer-owned.',
      },
    },
  },
};

export const DensityCompact: Story = {
  render: () => (
    <DashboardLayout
      {...BASE_LAYOUT_ARGS}
      context={{
        ...SHARED_LAYOUT_CONTEXT,
        runtime: {
          ...SHARED_LAYOUT_CONTEXT.runtime,
          density: "compact",
        },
      }}
      identity={{
        id: "story.layout.density-compact",
        label: "Compact density",
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Compact density (`data-metadata-density="compact"`) — body gap contracts to `clamp(0.5rem, 1.5cqi, 1rem)`.',
      },
    },
  },
};

export const DensityComfortable: Story = {
  render: () => (
    <DashboardLayout
      {...BASE_LAYOUT_ARGS}
      context={{
        ...SHARED_LAYOUT_CONTEXT,
        runtime: {
          ...SHARED_LAYOUT_CONTEXT.runtime,
          density: "comfortable",
        },
      }}
      identity={{
        id: "story.layout.density-comfortable",
        label: "Comfortable density",
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comfortable density (`data-metadata-density="comfortable"`) — body gap expands to `clamp(1rem, 3cqi, 2rem)`.',
      },
    },
  },
};

export const DiagnosticsEnabled: Story = {
  render: () => (
    <DashboardLayout
      {...BASE_LAYOUT_ARGS}
      context={sampleDiagnosticsRenderContext}
      diagnostics={{
        rendererKey: "story.diagnostics.layout",
        rendererVersion: "1",
      }}
      identity={{
        id: "story.layout.diagnostics",
        label: "Diagnostics preview",
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Layout with diagnostics enabled — `data-renderer-key` and `data-renderer-version` populate when diagnostics context is active.",
      },
    },
  },
};

export const Mobile: Story = {
  ...Dashboard,
  parameters: {
    ...metadataMobileViewport,
    docs: {
      description: {
        story:
          "Dashboard layout at mobile width — body regions stack, toolbar wraps.",
      },
    },
  },
};

export const DarkTheme: Story = {
  ...Dashboard,
  globals: metadataDarkThemeGlobals,
  parameters: {
    ...metadataCenteredLayout,
    docs: {
      description: {
        story:
          "Layout chrome under dark Afenda tokens. Structural hooks only — shell owns styling.",
      },
    },
  },
};
