import type { ReactNode } from "react";
import type { DocsIdentityBlockProps } from "./docs-block.types";

const IDENTITY_ROWS: ReadonlyArray<{
  readonly label: string;
  readonly key: keyof DocsIdentityBlockProps;
}> = [
  { label: "Package", key: "packageName" },
  { label: "Path", key: "path" },
  { label: "Port", key: "port" },
  { label: "PKG code", key: "pkgCode" },
  { label: "Owner", key: "owner" },
] as const;

export function DocsIdentityBlock({
  packageName,
  path,
  port,
  pkgCode,
  owner,
}: DocsIdentityBlockProps): ReactNode {
  const values: DocsIdentityBlockProps = {
    packageName,
    path,
    port,
    pkgCode,
    owner,
  };

  return (
    <figure className="afenda-docs-identity-block">
      <div className="afenda-docs-identity-block__scroll">
        <table className="afenda-docs-identity-block__table">
          <caption className="afenda-docs-identity-block__caption">
            Application identity
          </caption>
          <tbody>
            {IDENTITY_ROWS.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                <td>
                  {row.key === "packageName" || row.key === "path" ? (
                    <code translate="no">{values[row.key]}</code>
                  ) : (
                    values[row.key]
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export type { DocsIdentityBlockProps } from "./docs-block.types";
