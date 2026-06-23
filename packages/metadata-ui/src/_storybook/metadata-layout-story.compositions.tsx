import React from "react";
import type { ReactNode } from "react";

import type { MetadataLayoutProps } from "../contracts/layout.contract.js";
import type { MetadataSurfaceProps } from "../contracts/surface.contract.js";
import { MetadataLayout } from "../layouts/metadata-layout.js";
import { MetadataPageSurface } from "../surfaces/index.js";
import { MetadataFixtureStoryCanvas } from "./metadata-story.decorators.js";

export function renderMetadataLayoutShellStory(
  args: Pick<
    MetadataLayoutProps,
    "context" | "identity" | "presentation" | "type"
  >
) {
  return (
    <MetadataLayout
      {...args}
      slots={{
        content: (
          <section className="metadata-section">
            <h2 className="metadata-section-title">Shift content region</h2>
            <p>
              Container-query layout regions with production class hooks only.
              No fixture composition markup.
            </p>
          </section>
        ),
        header: (
          <header>
            <h1 className="metadata-layout-title">{args.identity.label}</h1>
          </header>
        ),
      }}
    />
  );
}

export function renderMetadataPageSurfaceStructuralStory(
  args: Pick<MetadataSurfaceProps, "actions" | "context" | "identity" | "state">
) {
  return (
    <MetadataPageSurface
      {...args}
      slots={{
        content: (
          <section className="metadata-section">
            <h2 className="metadata-section-title">Queue content region</h2>
            <p>
              Structural page surface with governed action bar hooks. Inspect
              `data-action-group` on each control.
            </p>
            <table className="metadata-section">
              <caption className="metadata-section-title">
                Open pick lines awaiting release
              </caption>
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
        ),
      }}
    />
  );
}

export function renderMetadataDashboardStructuralStory(
  args: Omit<MetadataLayoutProps, "type">
) {
  return (
    <MetadataLayout
      {...args}
      slots={{
        content: (
          <section className="metadata-section">
            <h2 className="metadata-section-title">Operational summary</h2>
            <p className="metadata-numeric">1,284 open orders</p>
            <p className="metadata-truncate">
              Production region only — no fixture KPI grid or demo composition
              classes.
            </p>
            <p className="metadata-wrap-anywhere">
              Correlation {args.context.runtime.correlationId}
            </p>
          </section>
        ),
      }}
      type="dashboard"
    />
  );
}

export function renderMetadataProductionUtilitiesStory() {
  return (
    <section className="metadata-section">
      <h2 className="metadata-section-title">Production utility hooks</h2>
      <dl>
        <div>
          <dt>Numeric</dt>
          <dd className="metadata-numeric">$4,820.00 · 1,284 · 96.2%</dd>
        </div>
        <div>
          <dt>Truncate</dt>
          <dd className="metadata-truncate">
            Long warehouse location code WH-NORTHEAST-04-BULK-AISLE-12
          </dd>
        </div>
        <div>
          <dt>Wrap anywhere</dt>
          <dd className="metadata-wrap-anywhere">
            Exception ORD-10482 credit hold exceeded for Sample Trading Co.
          </dd>
        </div>
      </dl>
    </section>
  );
}

export function renderMetadataFixtureStory(element: ReactNode) {
  return <MetadataFixtureStoryCanvas>{element}</MetadataFixtureStoryCanvas>;
}

export function renderMetadataFixtureWithAnatomy(
  element: ReactNode,
  regions: readonly { readonly key: string; readonly label: string }[]
) {
  return (
    <MetadataFixtureStoryCanvas>
      <div className="metadata-section" data-story="fixture-anatomy">
        <h2 className="metadata-section-title">Composition regions</h2>
        <dl>
          {regions.map((region) => (
            <div key={region.key}>
              <dt>{region.label}</dt>
              <dd>
                <code>{region.key}</code>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {element}
    </MetadataFixtureStoryCanvas>
  );
}
