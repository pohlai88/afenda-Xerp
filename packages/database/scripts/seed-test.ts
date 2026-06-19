import { seedTest } from "../src/seeds/seed-test.js";
import { runSeedCommand } from "./run-seed.js";

const exitCode = await runSeedCommand({
  profile: "test",
  execute: seedTest,
});

process.exit(exitCode);
