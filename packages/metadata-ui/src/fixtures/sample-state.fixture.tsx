import type { MetadataRuntimeState } from "@afenda/metadata";
import type { ReactNode } from "react";

import type {
  MetadataSpecificStateProps,
  MetadataStateProps,
} from "../contracts/state.contract.js";
import { MetadataLoadingState, MetadataState } from "../states/index.js";

const LOADING_STATE = "loading" satisfies MetadataRuntimeState;

export type MetadataStateFixtureProps = MetadataSpecificStateProps;

interface SampleStateDefinition {
  readonly key: string;
  readonly state: MetadataRuntimeState;
  readonly title: string;
  readonly message: string;
  readonly diagnosticsKey: `metadata-ui.state.${string}`;
}

export interface SampleStateFixture {
  readonly state: MetadataRuntimeState;
  readonly key: string;
  readonly diagnosticsKey: SampleStateDefinition["diagnosticsKey"];
  readonly props: MetadataStateProps;
  readonly renderProps: MetadataStateFixtureProps;
  readonly element: ReactNode;
}

export const sampleStateCatalog = [
  {
    key: "loading",
    state: "loading",
    title: "Loading workspace",
    message:
      "Fetching governed metadata for this surface. Preview data only in Storybook.",
    diagnosticsKey: "metadata-ui.state.loading",
  },
  {
    key: "empty",
    state: "empty",
    title: "No records found",
    message:
      "This metadata surface has no rows to display for the current filters.",
    diagnosticsKey: "metadata-ui.state.empty",
  },
  {
    key: "error",
    state: "error",
    title: "Unable to load surface",
    message:
      "The metadata surface could not be rendered. Retry or contact support if the issue persists.",
    diagnosticsKey: "metadata-ui.state.error",
  },
  {
    key: "forbidden",
    state: "forbidden",
    title: "Access restricted",
    message:
      "You do not have permission to view this metadata surface in the current workspace.",
    diagnosticsKey: "metadata-ui.state.forbidden",
  },
  {
    key: "invalid",
    state: "invalid",
    title: "Invalid configuration",
    message:
      "The metadata definition for this surface failed validation and cannot be rendered.",
    diagnosticsKey: "metadata-ui.state.invalid",
  },
  {
    key: "degraded",
    state: "degraded",
    title: "Limited availability",
    message:
      "Some sections are temporarily unavailable. Remaining content is shown in a reduced mode.",
    diagnosticsKey: "metadata-ui.state.degraded",
  },
  {
    key: "partial",
    state: "partial",
    title: "Partial data available",
    message:
      "Only part of the metadata surface loaded successfully. Review the available sections below.",
    diagnosticsKey: "metadata-ui.state.partial",
  },
  {
    key: "readonly",
    state: "readonly",
    title: "Read-only surface",
    message:
      "This metadata surface is available for review only. Editing actions are disabled.",
    diagnosticsKey: "metadata-ui.state.readonly",
  },
  {
    key: "maintenance",
    state: "maintenance",
    title: "Maintenance in progress",
    message:
      "This metadata surface is temporarily unavailable while maintenance completes.",
    diagnosticsKey: "metadata-ui.state.maintenance",
  },
] as const satisfies readonly SampleStateDefinition[];

type SampleStateCatalogKey = (typeof sampleStateCatalog)[number]["key"];

function SampleStateFixtureShell({
  children,
  diagnosticsKey,
  state,
}: {
  readonly children: ReactNode;
  readonly diagnosticsKey: SampleStateDefinition["diagnosticsKey"];
  readonly state: MetadataRuntimeState;
}) {
  return (
    <div
      className="metadata-fixture-state"
      data-fixture-region="state"
      data-metadata-runtime-state={state}
      data-renderer-key={diagnosticsKey}
    >
      {children}
    </div>
  );
}

function SampleLoadingStateHint() {
  return (
    <p className="metadata-fixture-state-hint" data-fixture-region="hint">
      Storybook preview · governed metadata-ui loading placeholder
    </p>
  );
}

function createSampleStateFixture(
  definition: (typeof sampleStateCatalog)[number]
): SampleStateFixture {
  const props = {
    message: definition.message,
    state: definition.state,
    title: definition.title,
  } satisfies MetadataStateProps;

  const renderProps = {
    message: props.message,
    title: props.title,
  } satisfies MetadataStateFixtureProps;

  return {
    diagnosticsKey: definition.diagnosticsKey,
    element: (
      <SampleStateFixtureShell
        diagnosticsKey={definition.diagnosticsKey}
        state={definition.state}
      >
        <MetadataState {...props} />
      </SampleStateFixtureShell>
    ),
    key: definition.key,
    props,
    renderProps,
    state: definition.state,
  };
}

export const sampleLoadingStateDefinition = sampleStateCatalog[0];

export const sampleLoadingStateProps = {
  message: sampleLoadingStateDefinition.message,
  state: LOADING_STATE,
  title: sampleLoadingStateDefinition.title,
} satisfies MetadataStateProps;

export const sampleLoadingStateRenderProps = {
  message: sampleLoadingStateProps.message,
  title: sampleLoadingStateProps.title,
} satisfies MetadataStateFixtureProps;

export const sampleLoadingStateFixture = {
  diagnosticsKey: sampleLoadingStateDefinition.diagnosticsKey,
  element: (
    <SampleStateFixtureShell
      diagnosticsKey={sampleLoadingStateDefinition.diagnosticsKey}
      state={LOADING_STATE}
    >
      <MetadataLoadingState {...sampleLoadingStateRenderProps} />
      <SampleLoadingStateHint />
    </SampleStateFixtureShell>
  ),
  key: sampleLoadingStateDefinition.key,
  props: sampleLoadingStateProps,
  renderProps: sampleLoadingStateRenderProps,
  state: LOADING_STATE,
} as const satisfies SampleStateFixture;

export const sampleStateFixtures = {
  loading: createSampleStateFixture(sampleStateCatalog[0]),
  empty: createSampleStateFixture(sampleStateCatalog[1]),
  error: createSampleStateFixture(sampleStateCatalog[2]),
  forbidden: createSampleStateFixture(sampleStateCatalog[3]),
  invalid: createSampleStateFixture(sampleStateCatalog[4]),
  degraded: createSampleStateFixture(sampleStateCatalog[5]),
  partial: createSampleStateFixture(sampleStateCatalog[6]),
  readonly: createSampleStateFixture(sampleStateCatalog[7]),
  maintenance: createSampleStateFixture(sampleStateCatalog[8]),
} as const satisfies Record<SampleStateCatalogKey, SampleStateFixture>;

export const sampleStateFixtureList = sampleStateCatalog.map((definition) =>
  createSampleStateFixture(definition)
);
