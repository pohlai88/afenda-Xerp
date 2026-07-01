import { readFileSync, writeFileSync } from "node:fs";
const f = "scripts/storybook/lib/discover-block-stories.mjs";
let t = readFileSync(f, "utf8");
if (!t.includes("SHARED_LAYOUT_FILES")) {
  t = t.replace(
    "const TSX_FILE_EXTENSION_PATTERN = /\\.tsx$/;",
    `const TSX_FILE_EXTENSION_PATTERN = /\\.tsx$/;

const SHARED_LAYOUT_FILES = new Set(["logo.tsx"]);
const SKIP_DIR_NAMES = new Set(["__tests__", "_shared", "_internal"]);`
  );
  t = t.replace(
    '    if (name.startsWith("_")) {',
    '    if (name.startsWith("_") || SKIP_DIR_NAMES.has(name)) {'
  );
  t = t.replace(
    '    if (name.endsWith(".tsx")) {',
    '    if (name.endsWith(".tsx")) {\n      if (SHARED_LAYOUT_FILES.has(name)) continue;'
  );
  writeFileSync(f, t);
  console.log("updated");
}
