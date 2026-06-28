import type { MetadataRenderableAction } from "@afenda/metadata-ui";

export const METADATA_WORKSPACE_PREVIEW_SURFACE_ID =
  "erp.metadata-workspace.preview" as const;

export const METADATA_WORKSPACE_PREVIEW_SECTION_ID =
  "erp.metadata-workspace.scope-overview" as const;

export const METADATA_WORKSPACE_PREVIEW_ACTIONS = [
  {
    key: "refresh-workspace-preview",
    label: "Refresh view",
    kind: "button",
    visibility: "disabled",
    presentation: {
      group: "secondary",
      order: 10,
    },
  },
  {
    key: "open-workspace-home",
    label: "Workspace home",
    kind: "link",
    href: "/",
    visibility: "visible",
    presentation: {
      group: "tertiary",
      order: 20,
    },
  },
] as const satisfies readonly MetadataRenderableAction[];

export function resolveMetadataWorkspacePreviewActions(input: {
  readonly authorizationDenied: boolean;
}): readonly MetadataRenderableAction[] {
  return METADATA_WORKSPACE_PREVIEW_ACTIONS.map((action) => {
    if (action.key !== "refresh-workspace-preview") {
      return action;
    }

    return {
      ...action,
      visibility: input.authorizationDenied ? "disabled" : "visible",
    } satisfies MetadataRenderableAction;
  });
}
