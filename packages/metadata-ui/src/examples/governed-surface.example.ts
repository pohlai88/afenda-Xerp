import { createPermissionKey } from "@afenda/permissions";
import type { MetadataExampleContract } from "../contracts/metadata-example.contract";
import { resolveMetadataState } from "../schemas/state-schema";

const readRecordsPermission = createPermissionKey("records", "read");
const exportRecordsPermission = createPermissionKey("records", "export");

export const governedMetadataSurfaceExample = {
  name: "GovernedRecordsListSurface",
  surface: {
    id: "surface.records.list",
    title: "Records",
    description: "Governed list surface example for AI IDE imitation.",
    layout: {
      density: "standard",
      recipe: "table",
      region: "main",
    },
    state: resolveMetadataState("ready"),
    actions: [
      {
        id: "action.records.export",
        label: "Export",
        category: "export",
        commandId: "records.export",
        executionMode: "command",
        permission: {
          denialEffect: "hide",
          permissionKey: exportRecordsPermission,
          reason: "Export requires the governed export permission.",
        },
        audit: {
          action: "records.export_requested",
          evidence: ["actorId", "permissionKey", "targetType"],
          targetType: "records",
        },
        policy: {
          confirmationRequired: true,
          policyKey: "records.export.confirmation",
        },
      },
    ],
    sections: [
      {
        id: "section.records.header",
        type: "page-header",
        title: "Records",
        description: "Governed metadata-driven page header.",
        layout: {
          density: "standard",
          recipe: "card",
          region: "header",
        },
        permission: {
          denialEffect: "hide",
          permissionKey: readRecordsPermission,
          reason: "Records require read permission.",
        },
      },
      {
        id: "section.records.list",
        type: "list",
        title: "Record list",
        layout: {
          density: "standard",
          recipe: "table",
          region: "main",
        },
        columns: [
          {
            key: "recordNumber",
            label: "Record number",
            sortable: true,
            valueType: "string",
          },
          {
            key: "status",
            label: "Status",
            sortable: true,
            valueType: "string",
          },
        ],
        state: resolveMetadataState("ready"),
      },
      {
        id: "section.records.audit",
        type: "audit-panel",
        title: "Audit evidence",
        layout: {
          density: "compact",
          recipe: "card",
          region: "aside",
        },
        auditPanel: {
          title: "Audit evidence",
          fields: [
            {
              evidenceType: "actor",
              key: "actorId",
              label: "Actor",
            },
            {
              evidenceType: "permission",
              key: "permissionKey",
              label: "Permission",
            },
            {
              evidenceType: "timestamp",
              key: "evaluatedAt",
              label: "Evaluated",
            },
          ],
        },
      },
    ],
  },
  driftWarnings: [
    "Do not add one-off table, form, or list patterns outside metadata sections.",
    "Do not execute actions from metadata; dispatch command IDs through module-owned behavior.",
    "Do not bypass TIP-005 permission checks before providing granted permissions.",
    "Do not style metadata surfaces outside TIP-006 recipes.",
  ],
} as const satisfies MetadataExampleContract;
