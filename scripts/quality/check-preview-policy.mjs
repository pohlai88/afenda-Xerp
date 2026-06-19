const eventName = process.env.GITHUB_EVENT_NAME ?? "local";
const refName = process.env.GITHUB_REF_NAME ?? "";
const vercelEnvironment = process.env.VERCEL_ENV ?? "preview";

if (eventName !== "local" && eventName !== "pull_request") {
  fail(
    `preview workflow may only run for pull_request events, got ${eventName}`
  );
}

if (vercelEnvironment === "production") {
  fail("preview workflow must never deploy with VERCEL_ENV=production");
}

if (["main", "master", "production"].includes(refName)) {
  fail(`preview workflow must not deploy protected branch ${refName}`);
}

console.log("preview deployment policy valid");

function fail(message) {
  console.error(`preview policy failed: ${message}`);
  process.exit(1);
}
