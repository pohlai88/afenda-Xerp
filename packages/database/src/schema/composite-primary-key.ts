import type { AnyPgColumn } from "drizzle-orm/pg-core";
// biome-ignore lint/suspicious/noDeprecatedImports: object-form primaryKey is the supported Drizzle API; deprecated overload shares the export name
import { primaryKey } from "drizzle-orm/pg-core";

export function compositePrimaryKey<
  TTableName extends string,
  TColumn extends AnyPgColumn<{ tableName: TTableName }>,
  TColumns extends AnyPgColumn<{ tableName: TTableName }>[],
>(config: { name?: string; columns: [TColumn, ...TColumns] }) {
  return primaryKey(config);
}
