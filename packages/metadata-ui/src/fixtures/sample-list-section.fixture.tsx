import type { SectionType } from "@afenda/ui-composition";

import type { MetadataSectionProps } from "../contracts/section.contract.js";
import { ListSection } from "../sections/index.js";
import { sampleRenderContext } from "./sample-runtime-context.fixture.js";

const LIST_SECTION_TYPE = "list" satisfies SectionType;
const LIST_SECTION_DESCRIPTION_ID = "section-sample-orders-list-description";
const LIST_SECTION_HEADING_ID = "section-sample-orders-list-heading";

export type MetadataListSectionFixtureProps = Omit<
  MetadataSectionProps,
  "type"
>;

interface SampleListSectionOrderRow {
  readonly customer: string;
  readonly id: string;
  readonly key: string;
  readonly status: string;
  readonly total: string;
}

export const sampleListSectionIdentity = {
  id: "section.sample.orders.list",
  title: "Sample orders list",
  description:
    "Fixture list section for governed metadata-ui rendering and Storybook previews.",
} as const;

export const sampleListSectionOrderRows = [
  {
    key: "ord-33001",
    id: "ORD-33001",
    customer: "Sample Trading Co.",
    status: "Processing",
    total: "$1,240.00",
  },
  {
    key: "ord-32988",
    id: "ORD-32988",
    customer: "Example Manufacturing Ltd.",
    status: "Ready to ship",
    total: "$860.50",
  },
  {
    key: "ord-32971",
    id: "ORD-32971",
    customer: "Demo Retail Group",
    status: "Awaiting payment",
    total: "$420.00",
  },
] as const satisfies readonly SampleListSectionOrderRow[];

function SampleListSectionHeader() {
  return (
    <div
      className="metadata-fixture-section-header"
      data-fixture-region="header"
    >
      <h2
        className="metadata-fixture-section-title"
        id={LIST_SECTION_HEADING_ID}
      >
        {sampleListSectionIdentity.title}
      </h2>

      <p
        className="metadata-fixture-section-description"
        id={LIST_SECTION_DESCRIPTION_ID}
      >
        Review sample order rows rendered by the governed list section renderer.
      </p>
    </div>
  );
}

function SampleListSectionActions() {
  return (
    <div
      aria-label="Section actions"
      className="metadata-fixture-section-actions"
      data-fixture-region="actions"
      role="toolbar"
    >
      <button aria-label="Export section data" type="button">
        Export
      </button>

      <button aria-label="Refresh section data" type="button">
        Refresh
      </button>
    </div>
  );
}

function SampleListSectionContent() {
  return (
    <div
      className="metadata-fixture-section-content"
      data-fixture-region="content"
    >
      <table className="metadata-fixture-section-table">
        <caption className="metadata-fixture-section-table-caption">
          Sample orders for the list section fixture
        </caption>

        <thead>
          <tr>
            <th scope="col">Order</th>
            <th scope="col">Customer</th>
            <th scope="col">Status</th>
            <th scope="col">Total</th>
          </tr>
        </thead>

        <tbody>
          {sampleListSectionOrderRows.map((order) => (
            <tr data-order-key={order.key} key={order.key}>
              <td>
                <code>{order.id}</code>
              </td>
              <td>{order.customer}</td>
              <td>{order.status}</td>
              <td>{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SampleListSectionFooter() {
  return (
    <div
      className="metadata-fixture-section-footer"
      data-fixture-region="footer"
    >
      <p>Preview fixture · metadata-ui list section</p>
      <p>Showing sample data only</p>
    </div>
  );
}

export const sampleListSectionProps = {
  type: LIST_SECTION_TYPE,

  identity: sampleListSectionIdentity,

  context: sampleRenderContext,

  state: {
    visibility: "visible",
  },

  a11y: {
    ariaLabel: sampleListSectionIdentity.title,
    ariaLabelledBy: LIST_SECTION_HEADING_ID,
    ariaDescribedBy: LIST_SECTION_DESCRIPTION_ID,
  },

  presentation: {
    chrome: "card",
    padded: true,
  },

  diagnostics: {
    rendererKey: "metadata-ui.section.list",
    rendererVersion: "1.0.0",
    note: "Storybook and test fixture for governed list section regions.",
  },

  slots: {
    header: <SampleListSectionHeader />,
    actions: <SampleListSectionActions />,
    content: <SampleListSectionContent />,
    footer: <SampleListSectionFooter />,
  },
} satisfies MetadataSectionProps;

export const sampleListSectionRenderProps = {
  identity: sampleListSectionProps.identity,
  context: sampleListSectionProps.context,
  state: sampleListSectionProps.state,
  a11y: sampleListSectionProps.a11y,
  presentation: sampleListSectionProps.presentation,
  diagnostics: sampleListSectionProps.diagnostics,
  slots: sampleListSectionProps.slots,
} satisfies MetadataListSectionFixtureProps;

export const sampleListSectionFixture = {
  type: LIST_SECTION_TYPE,
  context: sampleListSectionProps.context,
  identity: sampleListSectionProps.identity,
  props: sampleListSectionProps,
  renderProps: sampleListSectionRenderProps,
  element: <ListSection {...sampleListSectionRenderProps} />,
} as const;
