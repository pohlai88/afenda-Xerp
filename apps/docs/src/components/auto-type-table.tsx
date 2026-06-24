import { createGenerator } from "fumadocs-typescript";
import {
  type AutoTypeTableProps,
  AutoTypeTable as FumadocsAutoTypeTable,
} from "fumadocs-typescript/ui";

const generator = createGenerator();

export function AutoTypeTable(props: Omit<AutoTypeTableProps, "generator">) {
  return <FumadocsAutoTypeTable generator={generator} {...props} />;
}
