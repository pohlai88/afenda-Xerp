import path from "node:path";
import { fileURLToPath } from "node:url";

import { createReactProject } from "../../vitest.shared";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const portableStoriesSetup = path.join(
  dirname,
  "src/__tests__/setup/portable-stories.tsx"
);

export default createReactProject(import.meta.url, "@afenda/appshell", {
  setupFiles: [portableStoriesSetup],
});
