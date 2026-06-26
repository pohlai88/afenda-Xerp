import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateDocsLinks } from "./validate-docs-links.ts";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

await validateDocsLinks(appRoot);
