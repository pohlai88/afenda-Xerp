import {
  type CreateMetadataRuntimeContextInput,
  createMetadataRuntimeContext,
} from "@afenda/metadata";

import type {
  CreateMetadataUiRenderContextInput,
  MetadataUiRenderContext,
} from "../contracts/render-context.contract.js";
import { createMetadataUiRenderContext } from "../runtime/index.js";

export const SAMPLE_RUNTIME_CORRELATION_ID = "corr_fixture_sample_001";

export const SAMPLE_METADATA_UI_FIXTURE_NAMESPACE = "metadata-ui.fixture";

export const SAMPLE_METADATA_UI_RENDER_SOURCE_STATIC_PREVIEW =
  "static-preview" as const;

export const SAMPLE_METADATA_UI_RENDER_SOURCE_CLIENT = "client" as const;

export const SAMPLE_METADATA_UI_RENDER_SOURCE_SERVER = "server" as const;

export const sampleRuntimeContextInput = {
  actorId: "actor_fixture_preview",
  tenantId: "tenant_fixture_sample",
  companyId: "company_fixture_sample",
  organizationId: "org_fixture_sample",
  workspaceId: "workspace_fixture_sample",
  correlationId: SAMPLE_RUNTIME_CORRELATION_ID,
  permissions: ["fixture.orders.read"],
  capabilities: ["fixture.orders.view"],
  featureFlags: ["fixture.metadata-ui.preview"],
  density: "comfortable",
  presentationMode: "compact",
  state: "ready",
  diagnosticsEnabled: false,
  readonlyMode: false,
} satisfies CreateMetadataRuntimeContextInput;

export const sampleDiagnosticsRuntimeContextInput = {
  ...sampleRuntimeContextInput,
  diagnosticsEnabled: true,
} satisfies CreateMetadataRuntimeContextInput;

export const sampleReadonlyRuntimeContextInput = {
  ...sampleRuntimeContextInput,
  readonlyMode: true,
} satisfies CreateMetadataRuntimeContextInput;

export const sampleRuntimeContext = createMetadataRuntimeContext(
  sampleRuntimeContextInput
);

export const sampleDiagnosticsRuntimeContext = createMetadataRuntimeContext(
  sampleDiagnosticsRuntimeContextInput
);

export const sampleReadonlyRuntimeContext = createMetadataRuntimeContext(
  sampleReadonlyRuntimeContextInput
);

export const sampleRenderContextInput = {
  runtime: sampleRuntimeContext,
  source: SAMPLE_METADATA_UI_RENDER_SOURCE_STATIC_PREVIEW,
  hydration: "none",
  diagnosticsLevel: "off",
} satisfies CreateMetadataUiRenderContextInput;

export const sampleDiagnosticsRenderContextInput = {
  runtime: sampleDiagnosticsRuntimeContext,
  source: SAMPLE_METADATA_UI_RENDER_SOURCE_STATIC_PREVIEW,
  hydration: "none",
  diagnosticsLevel: "summary",
  diagnosticsNamespace: SAMPLE_METADATA_UI_FIXTURE_NAMESPACE,
} satisfies CreateMetadataUiRenderContextInput;

export const sampleVerboseDiagnosticsRenderContextInput = {
  runtime: sampleDiagnosticsRuntimeContext,
  source: SAMPLE_METADATA_UI_RENDER_SOURCE_STATIC_PREVIEW,
  hydration: "none",
  diagnosticsLevel: "verbose",
  diagnosticsNamespace: SAMPLE_METADATA_UI_FIXTURE_NAMESPACE,
} satisfies CreateMetadataUiRenderContextInput;

export const sampleClientRenderContextInput = {
  runtime: sampleRuntimeContext,
  source: SAMPLE_METADATA_UI_RENDER_SOURCE_CLIENT,
  hydration: "full",
  diagnosticsLevel: "off",
} satisfies CreateMetadataUiRenderContextInput;

export const sampleStrictRenderContextInput = {
  runtime: sampleRuntimeContext,
  source: SAMPLE_METADATA_UI_RENDER_SOURCE_SERVER,
  hydration: "none",
  strict: true,
  diagnosticsLevel: "summary",
  diagnosticsNamespace: SAMPLE_METADATA_UI_FIXTURE_NAMESPACE,
} satisfies CreateMetadataUiRenderContextInput;

export const sampleReadonlyRenderContextInput = {
  runtime: sampleReadonlyRuntimeContext,
  source: SAMPLE_METADATA_UI_RENDER_SOURCE_STATIC_PREVIEW,
  hydration: "none",
  diagnosticsLevel: "summary",
  diagnosticsNamespace: SAMPLE_METADATA_UI_FIXTURE_NAMESPACE,
} satisfies CreateMetadataUiRenderContextInput;

export const sampleRenderContext: MetadataUiRenderContext =
  createMetadataUiRenderContext(sampleRenderContextInput);

export const sampleDiagnosticsRenderContext: MetadataUiRenderContext =
  createMetadataUiRenderContext(sampleDiagnosticsRenderContextInput);

export const sampleVerboseDiagnosticsRenderContext: MetadataUiRenderContext =
  createMetadataUiRenderContext(sampleVerboseDiagnosticsRenderContextInput);

export const sampleClientRenderContext: MetadataUiRenderContext =
  createMetadataUiRenderContext(sampleClientRenderContextInput);

export const sampleStrictRenderContext: MetadataUiRenderContext =
  createMetadataUiRenderContext(sampleStrictRenderContextInput);

export const sampleReadonlyRenderContext: MetadataUiRenderContext =
  createMetadataUiRenderContext(sampleReadonlyRenderContextInput);

export const sampleRuntimeContextFixture = {
  constants: {
    correlationId: SAMPLE_RUNTIME_CORRELATION_ID,
    diagnosticsNamespace: SAMPLE_METADATA_UI_FIXTURE_NAMESPACE,
    staticPreviewSource: SAMPLE_METADATA_UI_RENDER_SOURCE_STATIC_PREVIEW,
    clientSource: SAMPLE_METADATA_UI_RENDER_SOURCE_CLIENT,
    serverSource: SAMPLE_METADATA_UI_RENDER_SOURCE_SERVER,
  },

  runtime: {
    input: sampleRuntimeContextInput,
    context: sampleRuntimeContext,
  },

  diagnosticsRuntime: {
    input: sampleDiagnosticsRuntimeContextInput,
    context: sampleDiagnosticsRuntimeContext,
  },

  readonlyRuntime: {
    input: sampleReadonlyRuntimeContextInput,
    context: sampleReadonlyRuntimeContext,
  },

  render: {
    input: sampleRenderContextInput,
    context: sampleRenderContext,
  },

  diagnosticsRender: {
    input: sampleDiagnosticsRenderContextInput,
    context: sampleDiagnosticsRenderContext,
  },

  verboseDiagnosticsRender: {
    input: sampleVerboseDiagnosticsRenderContextInput,
    context: sampleVerboseDiagnosticsRenderContext,
  },

  clientRender: {
    input: sampleClientRenderContextInput,
    context: sampleClientRenderContext,
  },

  strictRender: {
    input: sampleStrictRenderContextInput,
    context: sampleStrictRenderContext,
  },

  readonlyRender: {
    input: sampleReadonlyRenderContextInput,
    context: sampleReadonlyRenderContext,
  },
} as const;
