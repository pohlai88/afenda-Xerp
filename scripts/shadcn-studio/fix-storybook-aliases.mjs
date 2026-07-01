import { readFileSync, writeFileSync } from "node:fs";

const mainPath = "apps/storybook/.storybook/main.ts";
let t = readFileSync(mainPath, "utf8");
t = t.replace(
  `      {
        find: "@/components-ui",
        replacement: join(shadcnStudioSrcRoot, "components-ui"),
      },
      {
        find: "@/components-layouts",
        replacement: join(shadcnStudioSrcRoot, "components-layouts"),
      },`,
  `      {
        find: "@/components/ui",
        replacement: join(shadcnStudioSrcRoot, "components-ui"),
      },
      {
        find: "@/components/shadcn-studio",
        replacement: join(shadcnStudioSrcRoot, "components-layouts"),
      },
      {
        find: "@/components-auth-shell",
        replacement: join(shadcnStudioSrcRoot, "components-auth-shell"),
      },`
);
t = t.replace(
  `"@/components-ui": join(shadcnStudioSrcRoot, "components-ui"),
      "@/components-layouts": join(
        shadcnStudioSrcRoot,
        "components-layouts"
      ),`,
  `"@/components/ui": join(shadcnStudioSrcRoot, "components-ui"),
      "@/components/shadcn-studio": join(shadcnStudioSrcRoot, "components-layouts"),
      "@/components-auth-shell": join(shadcnStudioSrcRoot, "components-auth-shell"),`
);
writeFileSync(mainPath, t);
console.log("fixed main.ts aliases");
