import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const binDir = path.join(packageRoot, "node_modules", ".bin");
const commandExtension = process.platform === "win32" ? ".CMD" : "";

const runLocalBin = (binName, args) => {
  const commandPath = path.join(binDir, `${binName}${commandExtension}`);
  const result = spawnSync(commandPath, args, {
    cwd: packageRoot,
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(
      `${binName} failed with exit code ${result.status ?? "unknown"}`
    );
  }
};

const copyThemeArtifacts = () => {
  mkdirSync(path.join(packageRoot, "dist", "themes"), { recursive: true });

  copyFileSync(
    path.join(packageRoot, "src", "styles", "shadcn-default.css"),
    path.join(packageRoot, "dist", "shadcn-default.css")
  );
  copyFileSync(
    path.join(packageRoot, "src", "types", "css-export.d.ts"),
    path.join(packageRoot, "dist", "shadcn-default.css.d.ts")
  );
  copyFileSync(
    path.join(packageRoot, "src", "styles", "themes", "swiss-noir.css"),
    path.join(packageRoot, "dist", "themes", "swiss-noir.css")
  );
  copyFileSync(
    path.join(packageRoot, "src", "types", "css-export.d.ts"),
    path.join(packageRoot, "dist", "themes", "swiss-noir.css.d.ts")
  );
  copyFileSync(
    path.join(packageRoot, "src", "styles", "themes", "verdant-noir.css"),
    path.join(packageRoot, "dist", "themes", "verdant-noir.css")
  );
  copyFileSync(
    path.join(packageRoot, "src", "types", "css-export.d.ts"),
    path.join(packageRoot, "dist", "themes", "verdant-noir.css.d.ts")
  );
};

runLocalBin("tsc", ["-b", "tsconfig.json"]);
runLocalBin("tsc-alias", ["-p", "tsconfig.json"]);
copyThemeArtifacts();
