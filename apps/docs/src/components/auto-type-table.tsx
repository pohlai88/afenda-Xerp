import {
  type AutoTypeTableProps,
  AutoTypeTable as FumadocsAutoTypeTable,
} from "fumadocs-typescript/ui";
import { docsTypeGenerator } from "@/lib/docs-type-generator";

export function AutoTypeTable(props: Omit<AutoTypeTableProps, "generator">) {
  return <FumadocsAutoTypeTable generator={docsTypeGenerator} {...props} />;
}
