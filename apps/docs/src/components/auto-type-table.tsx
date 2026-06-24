import { createGenerator } from "fumadocs-typescript";
import {
  AutoTypeTable as FumadocsAutoTypeTable,
  type AutoTypeTableProps,
} from "fumadocs-typescript/ui";

const generator = createGenerator();

export function AutoTypeTable(
  props: Omit<AutoTypeTableProps, "generator">,
) {
  return <FumadocsAutoTypeTable generator={generator} {...props} />;
}
