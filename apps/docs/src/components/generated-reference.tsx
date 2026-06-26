import type {
  AuthRoutesCatalog,
  CatalogId,
  EnvCatalog,
  ModulesCatalog,
  PermissionsCatalog,
  SystemAdminCatalog,
} from "@/lib/docs-product-catalog.contract";
import { readProductCatalog } from "@/lib/docs-product-catalog.schema";

function AuthRoutesTable({ catalog }: { catalog: AuthRoutesCatalog }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Path</th>
          <th>Lane</th>
        </tr>
      </thead>
      <tbody>
        {catalog.routes.map((route) => (
          <tr key={route.path}>
            <td>
              <code>{route.path}</code>
            </td>
            <td>{route.lane}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SystemAdminTable({ catalog }: { catalog: SystemAdminCatalog }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Section</th>
          <th>Path</th>
          <th>Read permission</th>
        </tr>
      </thead>
      <tbody>
        {catalog.sections.map((section) => (
          <tr key={section.sectionId}>
            <td>{section.label}</td>
            <td>
              <code>{section.href}</code>
            </td>
            <td>
              <code>{section.readPermissionKey}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PermissionsTable({ catalog }: { catalog: PermissionsCatalog }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Domain</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {catalog.permissions.map((permission) => (
          <tr key={permission.key}>
            <td>
              <code>{permission.key}</code>
            </td>
            <td>{permission.domain}</td>
            <td>{permission.action}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EnvTable({ catalog }: { catalog: EnvCatalog }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Variable</th>
          <th>Section</th>
          <th>Description</th>
          <th>Deprecated</th>
        </tr>
      </thead>
      <tbody>
        {catalog.variables.map((variable) => (
          <tr key={variable.name}>
            <td>
              <code>{variable.name}</code>
            </td>
            <td>{variable.section}</td>
            <td>{variable.description ?? "—"}</td>
            <td>{variable.deprecated ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ModulesTable({ catalog }: { catalog: ModulesCatalog }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Module</th>
          <th>Route</th>
          <th>Permission</th>
          <th>Required entitlements</th>
        </tr>
      </thead>
      <tbody>
        {catalog.modules.map((module) => (
          <tr key={module.moduleId}>
            <td>{module.label}</td>
            <td>
              <code>{module.routePath}</code>
            </td>
            <td>
              <code>{module.permissionKey}</code>
            </td>
            <td>
              {module.requiredEntitlements.length > 0
                ? module.requiredEntitlements.join(", ")
                : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export interface GeneratedReferenceProps {
  readonly catalog: CatalogId;
}

export function GeneratedReference({ catalog }: GeneratedReferenceProps) {
  const snapshot = readProductCatalog(catalog);

  switch (snapshot.catalogId) {
    case "auth-routes":
      return <AuthRoutesTable catalog={snapshot} />;
    case "system-admin":
      return <SystemAdminTable catalog={snapshot} />;
    case "permissions":
      return <PermissionsTable catalog={snapshot} />;
    case "env":
      return <EnvTable catalog={snapshot} />;
    case "modules":
      return <ModulesTable catalog={snapshot} />;
    default: {
      const _exhaustive: never = snapshot;
      return _exhaustive;
    }
  }
}
