import {
  type AutoTypeTableProps,
  AutoTypeTable as FumadocsAutoTypeTable,
} from "fumadocs-typescript/ui";
import {
  docsTypeGenerator,
  docsTypeTableOptions,
} from "@/lib/docs-type-generator";

/** RSC Auto Type Table — mirrors remark `<auto-type-table />` at runtime. */
export function AutoTypeTable(
  props: Omit<AutoTypeTableProps, "generator" | "options">
) {
  return (
    <FumadocsAutoTypeTable
      generator={docsTypeGenerator}
      options={docsTypeTableOptions}
      {...props}
    />
  );
}
