import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const assets = [
  {
    from: "src/app-shell.module.css",
    to: "dist/app-shell.module.css",
  },
];

for (const asset of assets) {
  const destination = resolve(packageRoot, asset.to);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(resolve(packageRoot, asset.from), destination);
}
