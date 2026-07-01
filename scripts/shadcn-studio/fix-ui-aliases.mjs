import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const SOURCE_FILE_PATTERN = /\.(ts|tsx|json)$/;

const roots = [
  join(process.cwd(), "packages/shadcn-studio/src"),
  join(process.cwd(), "apps/storybook/stories"),
  join(process.cwd(), "apps/storybook/.storybook"),
];

function normalizeImports(content) {
  return content
    .replaceAll("@/components-ui/", "@/components/ui/")
    .replaceAll("@/components-layouts/", "@/components/shadcn-studio/");
}

function walk(directory) {
  if (!existsSync(directory)) {
    return;
  }

  for (const name of readdirSync(directory)) {
    const filePath = join(directory, name);
    if (statSync(filePath).isDirectory()) {
      walk(filePath);
      continue;
    }

    if (!SOURCE_FILE_PATTERN.test(name)) {
      continue;
    }

    const before = readFileSync(filePath, "utf8");
    const after = normalizeImports(before);
    if (after !== before) {
      writeFileSync(filePath, after);
    }
  }
}

for (const root of roots) {
  walk(root);
}

const assetsDir = join(
  process.cwd(),
  "packages/shadcn-studio/src/components-assets"
);
const indexPath = join(assetsDir, "index.ts");
if (existsSync(assetsDir) && !existsSync(indexPath)) {
  const files = readdirSync(assetsDir).filter((file) => file.endsWith(".tsx"));
  writeFileSync(
    indexPath,
    `${files
      .map(
        (file) =>
          `export { default as ${file.replace(".tsx", "")} } from "./${file.replace(".tsx", "")}.js";`
      )
      .join("\n")}\n`
  );
}

console.log("fix-ui-aliases: ok");
