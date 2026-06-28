import type {
  MetadataBoundaryWarningProps,
  MetadataDiagnosticsProps,
} from "../contracts/diagnostics.contract.js";
import { resolveMetadataUiGovernedClassName } from "../wiring/governance.js";

interface DiagnosticsItem {
  readonly key: string;
  readonly label: string;
  readonly value: string | number | boolean | undefined;
  readonly verboseOnly?: boolean;
}

function formatDiagnosticsBoolean(value: boolean): string {
  return value ? "yes" : "no";
}

function hasDiagnosticsValue(
  value: string | number | boolean | undefined
): value is string | number | boolean {
  return value !== undefined && value !== "";
}

function isVerboseDiagnosticsEnabled(
  context: MetadataDiagnosticsProps["context"]
): boolean {
  return context.diagnostics.level === "verbose";
}

function createIdentityDiagnosticsItems(
  identity: MetadataDiagnosticsProps["snapshot"]["identity"]
): readonly DiagnosticsItem[] {
  if (identity === undefined) {
    return [];
  }

  return [
    {
      key: "actor-id",
      label: "Actor",
      value: identity.actorId,
      verboseOnly: true,
    },
    {
      key: "tenant-id",
      label: "Tenant",
      value: identity.tenantId,
      verboseOnly: true,
    },
    {
      key: "company-id",
      label: "Company",
      value: identity.companyId,
      verboseOnly: true,
    },
    {
      key: "entity-group-id",
      label: "Entity group",
      value: identity.entityGroupId,
      verboseOnly: true,
    },
    {
      key: "organization-id",
      label: "Organization",
      value: identity.organizationId,
      verboseOnly: true,
    },
    {
      key: "project-id",
      label: "Project",
      value: identity.projectId,
      verboseOnly: true,
    },
    {
      key: "team-id",
      label: "Team",
      value: identity.teamId,
      verboseOnly: true,
    },
    {
      key: "workspace-id",
      label: "Workspace",
      value: identity.workspaceId,
      verboseOnly: true,
    },
  ];
}

function createDiagnosticsItems({
  context,
  snapshot,
}: MetadataDiagnosticsProps): readonly DiagnosticsItem[] {
  const { identity, surface, renderer, runtime, presentation } = snapshot;

  return [
    ...createIdentityDiagnosticsItems(identity),

    {
      key: "surface-type",
      label: "Surface",
      value: surface?.surfaceType,
    },
    {
      key: "layout-type",
      label: "Layout",
      value: surface?.layoutType,
    },
    {
      key: "section-type",
      label: "Section",
      value: surface?.sectionType,
    },
    {
      key: "renderer-key",
      label: "Renderer",
      value: renderer?.rendererKey,
    },
    {
      key: "renderer-capability",
      label: "Capability",
      value: renderer?.rendererCapability,
    },
    {
      key: "renderer-version",
      label: "Renderer version",
      value: renderer?.rendererVersion,
      verboseOnly: true,
    },
    {
      key: "runtime-state",
      label: "Runtime state",
      value: runtime.runtimeState,
    },
    {
      key: "density-mode",
      label: "Density",
      value: presentation.densityMode,
    },
    {
      key: "presentation-mode",
      label: "Presentation",
      value: presentation.presentationMode,
    },
    {
      key: "theme-preset-slug",
      label: "Theme preset",
      value: presentation.themePresetSlug,
      verboseOnly: true,
    },
    {
      key: "readonly-mode",
      label: "Read-only",
      value: formatDiagnosticsBoolean(runtime.readonlyMode),
    },
    {
      key: "diagnostics-level",
      label: "Diagnostics level",
      value: context.diagnostics.level,
      verboseOnly: true,
    },
    {
      key: "correlation-id",
      label: "Correlation",
      value: runtime.correlationId,
      verboseOnly: true,
    },
  ];
}

function MetadataDiagnosticsDescriptionList({
  items,
  verbose,
}: {
  readonly items: readonly DiagnosticsItem[];
  readonly verbose: boolean;
}) {
  const visibleItems = items.filter((item) => {
    if (item.verboseOnly === true && !verbose) {
      return false;
    }

    return hasDiagnosticsValue(item.value);
  });

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <dl className="metadata-diagnostics-list">
      {visibleItems.map((item) => (
        <div
          className="metadata-diagnostics-item"
          data-diagnostics-key={item.key}
          key={item.key}
        >
          <dt>{item.label}</dt>
          <dd>{String(item.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function MetadataDiagnosticsPanel({
  context,
  snapshot,
}: MetadataDiagnosticsProps) {
  if (!context.diagnostics.enabled) {
    return null;
  }

  const verbose = isVerboseDiagnosticsEnabled(context);
  const items = createDiagnosticsItems({ context, snapshot });

  return (
    <aside
      aria-label="Metadata diagnostics"
      className={resolveMetadataUiGovernedClassName("diagnostics", {
        structuralClassNames: ["metadata-diagnostics-panel"],
        density: context.runtime.density,
      })}
      data-diagnostics-level={context.diagnostics.level}
      data-metadata-diagnostics-enabled={
        context.diagnostics.enabled ? "true" : "false"
      }
      data-metadata-hydration={context.environment.hydration}
      data-metadata-runtime-state={snapshot.runtime.runtimeState}
      data-metadata-source={context.environment.source}
      data-runtime-state={snapshot.runtime.runtimeState}
      data-slot="metadata-diagnostics-panel"
    >
      <h2 className="metadata-diagnostics-title">Diagnostics</h2>

      <MetadataDiagnosticsDescriptionList items={items} verbose={verbose} />
    </aside>
  );
}

export function MetadataRenderTrace({
  context,
  snapshot,
}: MetadataDiagnosticsProps) {
  if (!context.diagnostics.enabled) {
    return null;
  }

  const rendererKey = snapshot.renderer?.rendererKey ?? "unknown-renderer";
  const sectionType = snapshot.surface?.sectionType ?? "unknown-section";
  const runtimeState = snapshot.runtime.runtimeState;

  return (
    <pre
      aria-label="Metadata render trace"
      className="metadata-render-trace"
      data-metadata-runtime-state={runtimeState}
      data-renderer-key={rendererKey}
      data-runtime-state={runtimeState}
      data-section-type={sectionType}
      data-slot="metadata-render-trace"
    >
      {`${rendererKey} → ${sectionType} [${runtimeState}]`}
    </pre>
  );
}

export function MetadataBoundaryWarning({
  context,
  message,
}: MetadataBoundaryWarningProps) {
  if (!context.diagnostics.enabled) {
    return null;
  }

  return (
    <p
      className="metadata-boundary-warning"
      data-diagnostics-level={context.diagnostics.level}
      data-slot="metadata-boundary-warning"
      role="note"
    >
      {message}
    </p>
  );
}
