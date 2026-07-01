import { readFileSync, writeFileSync } from "node:fs";

let t = readFileSync("vitest.shared.ts", "utf8");
if (!t.includes('find: "@/components/shadcn-studio"')) {
  t = t.replace(
    `      alias: [
        {
          find: "@/components/ui",`,
    `      alias: [
        {
          find: "@/components/shadcn-studio",
          replacement: resolve(shadcnStudioSrcRoot, "components-layouts"),
        },
        {
          find: "@/components-auth-shell",
          replacement: resolve(shadcnStudioSrcRoot, "components-auth-shell"),
        },
        {
          find: "@/components/ui",`
  );
  writeFileSync("vitest.shared.ts", t);
  console.log("added shadcn-studio alias");
} else {
  console.log("already present");
}

let manifest = readFileSync(
  "packages/shadcn-studio/src/meta-registry/mcp-seed-block-manifest.ts",
  "utf8"
);
manifest = manifest.replace(
  `{ blockId: "login-page-04", mcpPath: \`\${BLOCKS_ROOT}/login-page-04\` }`,
  `{ blockId: "login-page-04", mcpPath: "packages/shadcn-studio/src/components-auth-shell/login-page-04" }`
);
writeFileSync(
  "packages/shadcn-studio/src/meta-registry/mcp-seed-block-manifest.ts",
  manifest
);

let inv = readFileSync(
  "packages/shadcn-studio/src/gate/mcp-seed-inventory.test.ts",
  "utf8"
);
inv = inv.replace(
  `    for (const entry of MCP_SEED_BLOCK_MANIFEST) {
      const relativePath = entry.mcpPath.replace(
        "packages/shadcn-studio/src/components-layouts/",
        ""
      );
      const normalizedPath = relativePath.endsWith(".tsx")
        ? relativePath
        : relativePath;
      expect(blockEntries).toContain(normalizedPath.replace(/\\\\/g, "/"));
    }`,
  `    for (const entry of MCP_SEED_BLOCK_MANIFEST) {
      if (entry.mcpPath.includes("/components-auth-shell/")) {
        expect(existsSync(join(packageRoot, entry.mcpPath.replace("packages/shadcn-studio/", "")))).toBe(true);
        continue;
      }
      const relativePath = entry.mcpPath.replace(
        "packages/shadcn-studio/src/components-layouts/",
        ""
      );
      expect(blockEntries).toContain(relativePath.replace(/\\\\/g, "/"));
    }`
);
inv = inv.replace(
  `        "login-page-04",\n`,
  ``
);
inv = inv.replace(
  `const blocksDir = join(packageRoot, "src/components-layouts");`,
  `const blocksDir = join(packageRoot, "src/components-layouts");
const authShellDir = join(packageRoot, "src/components-auth-shell");`
);
inv = inv.replace(
  `  it("installs live MCP blocks under src/components-layouts/", () => {`,
  `  it("installs live MCP auth blocks under src/components-auth-shell/", () => {
    expect(existsSync(join(authShellDir, "login-page-04/login-page-04.tsx"))).toBe(true);
  });

  it("installs live MCP blocks under src/components-layouts/", () => {`
);
writeFileSync(
  "packages/shadcn-studio/src/gate/mcp-seed-inventory.test.ts",
  inv
);
console.log("updated manifest and inventory test");
