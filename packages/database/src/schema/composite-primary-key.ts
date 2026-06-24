import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { primaryKey } from "drizzle-orm/pg-core";

export function compositePrimaryKey<
  TTableName extends string,
  TColumn extends AnyPgColumn<{ tableName: TTableName }>,
  TColumns extends AnyPgColumn<{ tableName: TTableName }>[],
>(config: { name?: string; columns: [TColumn, ...TColumns] }) {
  return primaryKey(config);
}
