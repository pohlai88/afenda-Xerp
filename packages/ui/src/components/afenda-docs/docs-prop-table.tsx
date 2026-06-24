import type { ReactNode } from "react";

export interface DocsPropTableRow {
  readonly defaultValue?: string;
  readonly description?: string;
  readonly name: string;
  readonly required?: boolean;
  readonly type: string;
}

export type DocsPropTableVariant = "default" | "compact";

export interface DocsPropTableProps {
  readonly caption?: string;
  readonly rows: readonly DocsPropTableRow[];
  readonly variant?: DocsPropTableVariant;
}

export function DocsPropTable({
  caption,
  rows,
  variant = "default",
}: DocsPropTableProps): ReactNode {
  return (
    <figure className="afenda-docs-prop-table" data-variant={variant}>
      <div className="afenda-docs-prop-table__scroll">
        <table className="afenda-docs-prop-table__table">
          <thead>
            <tr>
              <th scope="col">Property</th>
              <th scope="col">Type</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row">
                  <code>{row.name}</code>
                  {row.required ? (
                    <span className="afenda-docs-prop-table__required">
                      required
                    </span>
                  ) : null}
                </th>
                <td>
                  <code>{row.type}</code>
                  {row.defaultValue ? (
                    <span className="afenda-docs-prop-table__default">
                      default: {row.defaultValue}
                    </span>
                  ) : null}
                </td>
                <td>{row.description ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? (
        <figcaption className="afenda-docs-prop-table__caption">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
