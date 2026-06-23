import type { LayoutType } from "@afenda/metadata";

import type { MetadataLayoutProps } from "../contracts/layout.contract.js";
import { DashboardLayout } from "../layouts/index.js";
import { sampleRenderContext } from "./sample-runtime-context.fixture.js";

const DASHBOARD_LAYOUT_TYPE = "dashboard" satisfies LayoutType;
const DASHBOARD_LAYOUT_DESCRIPTION_ID = "dashboard-main-description";

interface SampleDashboardRailMetric {
  readonly context: string;
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

interface SampleDashboardAttentionItem {
  readonly detail: string;
  readonly key: string;
  readonly severity: "critical" | "warning" | "info";
  readonly title: string;
}

interface SampleDashboardActivityRow {
  readonly actor: string;
  readonly event: string;
  readonly id: string;
  readonly key: string;
  readonly when: string;
}

export const sampleDashboardLayoutIdentity = {
  id: "dashboard.main",
  label: "Fulfillment operations",
  description:
    "Shift-level fulfillment health, exception triage, and recent warehouse activity.",
} as const;

export const sampleDashboardDominantMetric = {
  key: "fulfillment-rate",
  label: "Fulfillment rate (14-day)",
  value: "96.2%",
  delta: "+0.8% vs prior period",
  evidence: "Based on 1,284 open orders across 3 regional depots",
} as const;

export const sampleDashboardRailMetrics = [
  {
    key: "open-orders",
    label: "Open orders",
    value: "1,284",
    context: "Across active depots",
  },
  {
    key: "inventory-risk",
    label: "SKUs below safety stock",
    value: "37",
    context: "Needs replenishment review",
  },
  {
    key: "cash-position",
    label: "Unallocated receipts",
    value: "$412K",
    context: "Awaiting bank reconciliation",
  },
] as const satisfies readonly SampleDashboardRailMetric[];

export const sampleDashboardAttentionQueue = [
  {
    key: "shipment-hold",
    title: "Shipment hold · ORD-10482",
    detail: "Credit limit exceeded for Sample Trading Co.",
    severity: "critical",
  },
  {
    key: "pick-shortage",
    title: "Pick shortage · WH-NE-04",
    detail: "14 lines missing on wave W-22018",
    severity: "warning",
  },
  {
    key: "asn-delay",
    title: "ASN delay · SUP-4410",
    detail: "Inbound ASN expected 2h ago from Example Manufacturing Ltd.",
    severity: "info",
  },
] as const satisfies readonly SampleDashboardAttentionItem[];

export const sampleDashboardTrendEvidence = {
  label: "Fulfillment trend",
  summary: "Throughput recovered after Tuesday maintenance window",
  points: ["Mon 94.1%", "Tue 91.8%", "Wed 95.4%", "Thu 96.2%"],
} as const;

export const sampleDashboardActivityRows = [
  {
    key: "act-01",
    id: "WAVE-22018",
    event: "Pick wave released",
    actor: "M. Chen",
    when: "4m ago",
  },
  {
    key: "act-02",
    id: "ORD-10479",
    event: "Ready-to-ship confirmed",
    actor: "System",
    when: "11m ago",
  },
  {
    key: "act-03",
    id: "RCPT-8821",
    event: "Goods receipt posted",
    actor: "J. Okonkwo",
    when: "18m ago",
  },
] as const satisfies readonly SampleDashboardActivityRow[];

function SampleDashboardLayoutHeader() {
  return (
    <div
      className="metadata-fixture-dashboard-header"
      data-fixture-region="header"
    >
      <nav
        aria-label="Breadcrumb"
        className="metadata-fixture-dashboard-breadcrumb"
      >
        <ol>
          <li>
            <a href="/workspace">Workspace</a>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">Fulfillment</span>
          </li>
        </ol>
      </nav>
      <h1 className="metadata-fixture-dashboard-title">
        Fulfillment operations
      </h1>
      <p
        className="metadata-fixture-dashboard-description"
        id={DASHBOARD_LAYOUT_DESCRIPTION_ID}
      >
        Shift-level fulfillment health, exception triage, and recent warehouse
        activity.
      </p>
    </div>
  );
}

function SampleDashboardLayoutToolbar() {
  return (
    <div
      aria-label="Shift controls"
      className="metadata-fixture-dashboard-toolbar"
      data-fixture-region="toolbar"
      role="group"
    >
      <div
        aria-label="Active shift filters"
        className="metadata-fixture-dashboard-filters"
        role="group"
      >
        <span className="metadata-fixture-dashboard-filter-chip">
          Shift: Day · WH-NE
        </span>
        <span className="metadata-fixture-dashboard-filter-chip">
          Horizon: 14 days
        </span>
      </div>
      <div className="metadata-fixture-dashboard-toolbar-actions">
        <button aria-label="Export shift report" type="button">
          Export shift report
        </button>
        <button aria-label="Refresh operations data" type="button">
          Refresh
        </button>
      </div>
    </div>
  );
}

function SampleDashboardLayoutAside() {
  return (
    <nav
      aria-label="Operations views"
      className="metadata-fixture-dashboard-aside"
      data-fixture-region="aside"
    >
      <ul className="metadata-fixture-dashboard-nav">
        <li>
          <a
            aria-current="page"
            className="metadata-fixture-dashboard-nav-link"
            data-nav-key="fulfillment"
            href="#fulfillment"
          >
            Fulfillment
          </a>
        </li>
        <li>
          <a
            className="metadata-fixture-dashboard-nav-link"
            data-nav-key="exceptions"
            href="#exceptions"
          >
            Exceptions
          </a>
        </li>
        <li>
          <a
            className="metadata-fixture-dashboard-nav-link"
            data-nav-key="inventory"
            href="#inventory"
          >
            Inventory risk
          </a>
        </li>
      </ul>
    </nav>
  );
}

function SampleDashboardLayoutContent() {
  return (
    <div
      className="metadata-fixture-dashboard-composition"
      data-fixture-region="content"
    >
      <section
        aria-labelledby="dashboard-dominant-metric-heading"
        className="metadata-fixture-dashboard-dominant-metric"
        data-fixture-composition="dominant-metric"
      >
        <h2
          className="metadata-fixture-dashboard-section-title"
          id="dashboard-dominant-metric-heading"
        >
          {sampleDashboardDominantMetric.label}
        </h2>
        <p className="metadata-fixture-dashboard-dominant-value metadata-numeric">
          {sampleDashboardDominantMetric.value}
        </p>
        <p className="metadata-fixture-dashboard-dominant-delta">
          {sampleDashboardDominantMetric.delta}
        </p>
        <p className="metadata-fixture-dashboard-dominant-evidence">
          {sampleDashboardDominantMetric.evidence}
        </p>
      </section>

      <aside
        aria-labelledby="dashboard-metric-rail-heading"
        className="metadata-fixture-dashboard-metric-rail"
        data-fixture-composition="metric-rail"
      >
        <h2
          className="metadata-fixture-dashboard-section-title"
          id="dashboard-metric-rail-heading"
        >
          Supporting metrics
        </h2>
        <ul className="metadata-fixture-dashboard-rail-list">
          {sampleDashboardRailMetrics.map((metric) => (
            <li
              className="metadata-fixture-dashboard-rail-item"
              data-rail-key={metric.key}
              key={metric.key}
            >
              <span className="metadata-fixture-dashboard-rail-label">
                {metric.label}
              </span>
              <strong className="metadata-fixture-dashboard-rail-value metadata-numeric">
                {metric.value}
              </strong>
              <span className="metadata-fixture-dashboard-rail-context">
                {metric.context}
              </span>
            </li>
          ))}
        </ul>
      </aside>

      <section
        aria-labelledby="dashboard-attention-heading"
        className="metadata-fixture-dashboard-attention-queue"
        data-fixture-composition="attention-queue"
      >
        <h2
          className="metadata-fixture-dashboard-section-title"
          id="dashboard-attention-heading"
        >
          Attention queue
        </h2>
        <ul className="metadata-fixture-dashboard-attention-list">
          {sampleDashboardAttentionQueue.map((item) => (
            <li
              className="metadata-fixture-dashboard-attention-item"
              data-attention-key={item.key}
              data-severity={item.severity}
              key={item.key}
            >
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="dashboard-trend-heading"
        className="metadata-fixture-dashboard-trend-slot"
        data-fixture-composition="trend-evidence"
      >
        <h2
          className="metadata-fixture-dashboard-section-title"
          id="dashboard-trend-heading"
        >
          {sampleDashboardTrendEvidence.label}
        </h2>
        <p>{sampleDashboardTrendEvidence.summary}</p>
        <ol className="metadata-fixture-dashboard-trend-points">
          {sampleDashboardTrendEvidence.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="dashboard-activity-heading"
        className="metadata-fixture-dashboard-activity-table"
        data-fixture-composition="recent-activity"
      >
        <h2
          className="metadata-fixture-dashboard-section-title"
          id="dashboard-activity-heading"
        >
          Recent warehouse activity
        </h2>
        <table className="metadata-fixture-dashboard-table metadata-fixture-dashboard-table-compact">
          <caption className="metadata-fixture-dashboard-table-caption">
            Latest fulfillment events for the active shift
          </caption>
          <thead>
            <tr>
              <th scope="col">Reference</th>
              <th scope="col">Event</th>
              <th scope="col">Actor</th>
              <th scope="col">When</th>
            </tr>
          </thead>
          <tbody>
            {sampleDashboardActivityRows.map((row) => (
              <tr data-activity-key={row.key} key={row.key}>
                <td>
                  <code>{row.id}</code>
                </td>
                <td>{row.event}</td>
                <td>{row.actor}</td>
                <td>{row.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function SampleDashboardLayoutFooter() {
  return (
    <div
      className="metadata-fixture-dashboard-footer"
      data-fixture-region="footer"
    >
      <p>Shift data synchronized 4 minutes ago</p>
      <p>Preview fixture · asymmetric operations dashboard</p>
    </div>
  );
}

export const sampleDashboardLayoutProps = {
  type: DASHBOARD_LAYOUT_TYPE,
  a11y: {
    ariaLabel: sampleDashboardLayoutIdentity.label,
    ariaDescribedBy: DASHBOARD_LAYOUT_DESCRIPTION_ID,
  },
  context: sampleRenderContext,
  diagnostics: {
    note: "Asymmetric dashboard fixture — dominant metric, rail, queue, trend, activity.",
    rendererKey: "metadata.dashboard.layout",
    rendererVersion: "1.1.0",
  },
  identity: sampleDashboardLayoutIdentity,
  presentation: {
    contained: true,
    padded: true,
    regionClassNames: {
      aside: "metadata-fixture-dashboard-aside-region",
      content: "metadata-fixture-dashboard-content-region",
      footer: "metadata-fixture-dashboard-footer-region",
      header: "metadata-fixture-dashboard-header-region",
      toolbar: "metadata-fixture-dashboard-toolbar-region",
    },
  },
  slots: {
    aside: <SampleDashboardLayoutAside />,
    content: <SampleDashboardLayoutContent />,
    footer: <SampleDashboardLayoutFooter />,
    header: <SampleDashboardLayoutHeader />,
    toolbar: <SampleDashboardLayoutToolbar />,
  },
} satisfies MetadataLayoutProps;

export const sampleDashboardLayoutRenderProps = {
  identity: sampleDashboardLayoutProps.identity,
  context: sampleDashboardLayoutProps.context,
  a11y: sampleDashboardLayoutProps.a11y,
  presentation: sampleDashboardLayoutProps.presentation,
  diagnostics: sampleDashboardLayoutProps.diagnostics,
  slots: sampleDashboardLayoutProps.slots,
} satisfies Omit<MetadataLayoutProps, "type">;

const {
  type: _dashboardLayoutType,
  ...sampleDashboardLayoutRenderPropsForFixture
} = sampleDashboardLayoutProps;

export const sampleDashboardLayoutFixture = {
  type: DASHBOARD_LAYOUT_TYPE,
  context: sampleDashboardLayoutProps.context,
  identity: sampleDashboardLayoutProps.identity,
  props: sampleDashboardLayoutProps,
  element: <DashboardLayout {...sampleDashboardLayoutRenderPropsForFixture} />,
} as const;
