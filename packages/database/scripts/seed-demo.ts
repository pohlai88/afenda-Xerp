import { seedDemo } from "../src/seeds/seed-demo.js";
import { runSeedCommand } from "./run-seed.js";

const exitCode = await runSeedCommand({
  profile: "demo",
  execute: seedDemo,
});

process.exit(exitCode);
