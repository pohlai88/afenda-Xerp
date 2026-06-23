import type { SurfaceType } from "@afenda/metadata";

import type { MetadataRenderableAction } from "../contracts/action.contract.js";
import type {
  MetadataSurfaceBreadcrumb,
  MetadataSurfaceProps,
} from "../contracts/surface.contract.js";
import { MetadataPageSurface } from "../surfaces/index.js";
import { sampleRenderContext } from "./sample-runtime-context.fixture.js";

const PAGE_SURFACE_TYPE = "page" satisfies SurfaceType;
const PAGE_SURFACE_DESCRIPTION_ID = "page-sample-orders-description";

export type MetadataPageSurfaceFixtureProps = Omit<
  MetadataSurfaceProps,
  "type"
>;

interface SamplePageSurfaceOrderRow {
  readonly customer: string;
  readonly id: string;
  readonly key: string;
  readonly selected?: boolean;
  readonly status: string;
  readonly total: string;
}

interface SamplePageSurfaceAuditEntry {
  readonly actor: string;
  readonly at: string;
  readonly event: string;
  readonly key: string;
  readonly reference: string;
}

export const samplePageSurfaceIdentity = {
  id: "page.sample.orders",
  title: "Order fulfillment queue",
  description:
    "Master-detail order workspace with contextual actions and audit evidence.",
} as const;

export const samplePageSurfaceBreadcrumbs = [
  { key: "workspace", label: "Workspace", href: "/workspace" },
  { key: "sales", label: "Sales", href: "/sales" },
  { key: "orders", label: "Order fulfillment queue" },
] as const satisfies readonly MetadataSurfaceBreadcrumb[];

export const samplePageSurfaceActions = [
  {
    key: "export-orders",
    label: "Export selection",
    kind: "button",
    visibility: "visible",
    presentation: {
      group: "secondary",
      order: 10,
    },
  },
  {
    key: "refresh-orders",
    label: "Refresh queue",
    kind: "button",
    visibility: "visible",
    presentation: {
      group: "secondary",
      order: 20,
    },
  },
  {
    key: "create-order",
    label: "Create order",
    kind: "button",
    visibility: "visible",
    presentation: {
      group: "primary",
      order: 30,
    },
  },
  {
    key: "order-help",
    label: "Fulfillment guide",
    kind: "link",
    href: "/help/order-fulfillment",
    target: "blank",
    visibility: "visible",
    presentation: {
      group: "help",
      order: 40,
    },
  },
] as const satisfies readonly MetadataRenderableAction[];

export const samplePageSurfaceSelectedOrder = {
  id: "ORD-22001",
  customer: "Sample Trading Co.",
  status: "Processing",
  total: "$4,820.00",
  shipBy: "2026-06-24",
  warehouse: "WH-NE-04",
  lines: 18,
  owner: "A. Patel",
} as const;

export const samplePageSurfaceOrderRows = [
  {
    key: "ord-22001",
    id: "ORD-22001",
    customer: "Sample Trading Co.",
    status: "Processing",
    total: "$4,820.00",
    selected: true,
  },
  {
    key: "ord-21988",
    id: "ORD-21988",
    customer: "Example Manufacturing Ltd.",
    status: "Ready to ship",
    total: "$2,140.50",
  },
  {
    key: "ord-21971",
    id: "ORD-21971",
    customer: "Demo Retail Group",
    status: "Awaiting payment",
    total: "$980.00",
  },
] as const satisfies readonly SamplePageSurfaceOrderRow[];

export const samplePageSurfaceAuditEntries = [
  {
    key: "audit-01",
    at: "2026-06-21 08:14",
    actor: "A. Patel",
    event: "Status changed to Processing",
    reference: "ORD-22001",
  },
  {
    key: "audit-02",
    at: "2026-06-21 07:52",
    actor: "System",
    event: "Credit check passed",
    reference: "ORD-22001",
  },
  {
    key: "audit-03",
    at: "2026-06-21 07:41",
    actor: "M. Chen",
    event: "Order created from quote Q-1182",
    reference: "ORD-22001",
  },
] as const satisfies readonly SamplePageSurfaceAuditEntry[];

function SamplePageSurfaceFilterRow() {
  return (
    <div
      aria-label="Queue filters"
      className="metadata-fixture-page-filter-row"
      data-fixture-region="filters"
      role="group"
    >
      <span className="metadata-fixture-page-filter-chip">
        Status: Processing
      </span>
      <span className="metadata-fixture-page-filter-chip">
        Warehouse: WH-NE-04
      </span>
      <span className="metadata-fixture-page-filter-chip">
        Ship-by: Next 48h
      </span>
    </div>
  );
}

function SamplePageSurfaceAside() {
  return (
    <aside
      aria-labelledby="page-surface-detail-heading"
      className="metadata-fixture-page-detail-panel"
      data-fixture-composition="detail-summary"
      data-fixture-region="aside"
    >
      <h2
        className="metadata-fixture-page-section-title"
        id="page-surface-detail-heading"
      >
        Selected order
      </h2>
      <dl className="metadata-fixture-page-detail-list">
        <div>
          <dt>Order</dt>
          <dd>
            <code>{samplePageSurfaceSelectedOrder.id}</code>
          </dd>
        </div>
        <div>
          <dt>Customer</dt>
          <dd>{samplePageSurfaceSelectedOrder.customer}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{samplePageSurfaceSelectedOrder.status}</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd className="metadata-numeric">
            {samplePageSurfaceSelectedOrder.total}
          </dd>
        </div>
        <div>
          <dt>Ship by</dt>
          <dd>{samplePageSurfaceSelectedOrder.shipBy}</dd>
        </div>
        <div>
          <dt>Warehouse</dt>
          <dd>{samplePageSurfaceSelectedOrder.warehouse}</dd>
        </div>
        <div>
          <dt>Lines</dt>
          <dd className="metadata-numeric">
            {samplePageSurfaceSelectedOrder.lines}
          </dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd>{samplePageSurfaceSelectedOrder.owner}</dd>
        </div>
      </dl>
    </aside>
  );
}

function SamplePageSurfaceContent() {
  return (
    <div
      className="metadata-fixture-page-master-detail"
      data-fixture-composition="master-detail"
      data-fixture-region="content"
    >
      <p
        className="metadata-fixture-page-description"
        id={PAGE_SURFACE_DESCRIPTION_ID}
      >
        Review the fulfillment queue, inspect the selected order, and verify
        audit evidence before releasing the next pick wave.
      </p>

      <SamplePageSurfaceFilterRow />

      <section
        aria-labelledby="page-surface-master-heading"
        className="metadata-fixture-page-master-list"
        data-fixture-composition="master-list"
      >
        <h2
          className="metadata-fixture-page-section-title"
          id="page-surface-master-heading"
        >
          Fulfillment queue
        </h2>
        <div className="metadata-fixture-page-table-section">
          <table className="metadata-fixture-page-table metadata-fixture-page-table-master">
            <caption className="metadata-fixture-page-table-caption">
              Orders awaiting fulfillment action in the selected warehouse
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
              {samplePageSurfaceOrderRows.map((order) => {
                const isSelected =
                  "selected" in order && order.selected === true;

                return (
                  <tr
                    aria-selected={isSelected ? true : undefined}
                    data-order-key={order.key}
                    data-selected={isSelected ? "true" : undefined}
                    key={order.key}
                  >
                    <td>
                      <code>{order.id}</code>
                    </td>
                    <td>{order.customer}</td>
                    <td>{order.status}</td>
                    <td className="metadata-numeric">{order.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="page-surface-audit-heading"
        className="metadata-fixture-page-audit-evidence"
        data-fixture-composition="audit-evidence"
      >
        <h2
          className="metadata-fixture-page-section-title"
          id="page-surface-audit-heading"
        >
          Audit evidence
        </h2>
        <div className="metadata-fixture-page-table-section">
          <table className="metadata-fixture-page-table metadata-fixture-page-table-audit">
            <caption className="metadata-fixture-page-table-caption">
              Immutable events for the selected order
            </caption>
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Actor</th>
                <th scope="col">Event</th>
                <th scope="col">Reference</th>
              </tr>
            </thead>
            <tbody>
              {samplePageSurfaceAuditEntries.map((entry) => (
                <tr data-audit-key={entry.key} key={entry.key}>
                  <td>{entry.at}</td>
                  <td>{entry.actor}</td>
                  <td>{entry.event}</td>
                  <td>
                    <code>{entry.reference}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SamplePageSurfaceFooter() {
  return (
    <div className="metadata-fixture-page-footer" data-fixture-region="footer">
      <p>Preview fixture · master-detail order page</p>
    </div>
  );
}

export const samplePageSurfaceProps = {
  type: PAGE_SURFACE_TYPE,
  identity: samplePageSurfaceIdentity,
  context: sampleRenderContext,
  breadcrumbs: samplePageSurfaceBreadcrumbs,
  actions: samplePageSurfaceActions,
  state: {
    visibility: "visible",
  },
  a11y: {
    ariaLabel: samplePageSurfaceIdentity.title,
    ariaDescribedBy: PAGE_SURFACE_DESCRIPTION_ID,
  },
  presentation: {
    chrome: "standard",
    width: "contained",
    padded: true,
  },
  diagnostics: {
    layoutRendererKey: "metadata.layout.page",
    surfaceRendererKey: "metadata.surface.page",
    note: "Master-detail page fixture with audit evidence and contextual actions.",
  },
  slots: {
    aside: <SamplePageSurfaceAside />,
    content: <SamplePageSurfaceContent />,
    footer: <SamplePageSurfaceFooter />,
  },
} satisfies MetadataSurfaceProps;

export const samplePageSurfaceRenderProps = {
  identity: samplePageSurfaceProps.identity,
  context: samplePageSurfaceProps.context,
  breadcrumbs: samplePageSurfaceProps.breadcrumbs,
  actions: samplePageSurfaceProps.actions,
  state: samplePageSurfaceProps.state,
  a11y: samplePageSurfaceProps.a11y,
  presentation: samplePageSurfaceProps.presentation,
  diagnostics: samplePageSurfaceProps.diagnostics,
  slots: samplePageSurfaceProps.slots,
} satisfies MetadataPageSurfaceFixtureProps;

export const samplePageSurfaceFixture = {
  type: PAGE_SURFACE_TYPE,
  context: samplePageSurfaceProps.context,
  identity: samplePageSurfaceProps.identity,
  props: samplePageSurfaceProps,
  renderProps: samplePageSurfaceRenderProps,
  element: <MetadataPageSurface {...samplePageSurfaceRenderProps} />,
} as const;
