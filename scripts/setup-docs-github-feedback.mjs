#!/usr/bin/env node
import { loadMergedEnv, resolveRepoRoot } from "./env-utils.mjs";

const owner = "pohlai88";
const repo = "afenda-Xerp";
const categoryName = "Docs Feedback";

function resolveGithubToken(merged) {
  return (
    merged.entries.get("GITHUB_TOKEN")?.trim() ??
    process.env["GITHUB_TOKEN"]?.trim()
  );
}

async function githubRequest(token, path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      `${options.method ?? "GET"} ${path} failed (${response.status}): ${text}`
    );
  }

  return body;
}

async function githubGraphql(token, query, variables = {}) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors?.length) {
    throw new Error(
      `GraphQL failed: ${JSON.stringify(payload.errors ?? payload, null, 2)}`
    );
  }

  return payload.data;
}

const merged = loadMergedEnv(resolveRepoRoot(), {});
const token = resolveGithubToken(merged);

if (!token) {
  console.error(
    "[setup-docs-github-feedback] Missing GITHUB_TOKEN in .env.secret"
  );
  process.exit(1);
}

const repository = await githubRequest(token, `/repos/${owner}/${repo}`);
console.log(
  `[setup-docs-github-feedback] repo=${repository.full_name} discussions=${repository.has_discussions}`
);

if (!repository.has_discussions) {
  await githubRequest(token, `/repos/${owner}/${repo}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ has_discussions: true }),
  });
  console.log("[setup-docs-github-feedback] enabled Discussions");
}

const repoNode = await githubGraphql(
  token,
  `
    query ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        discussionCategories(first: 25) {
          nodes { id name }
        }
      }
    }
  `,
  { owner, name: repo }
);

const repositoryId = repoNode.repository.id;
const existing = repoNode.repository.discussionCategories.nodes.find(
  (entry) => entry.name === categoryName
);

if (existing) {
  console.log(
    `[setup-docs-github-feedback] category exists: ${existing.name} (${existing.id})`
  );
} else {
  const created = await githubGraphql(
    token,
    `
      mutation ($input: CreateDiscussionCategoryInput!) {
        createDiscussionCategory(input: $input) {
          discussionCategory { id name }
        }
      }
    `,
    {
      input: {
        repositoryId,
        name: categoryName,
        description: "Documentation feedback forwarded from @afenda/docs",
        emoji: ":memo:",
      },
    }
  );

  const category = created.createDiscussionCategory.discussionCategory;
  console.log(
    `[setup-docs-github-feedback] created category: ${category.name} (${category.id})`
  );
}

console.log(
  `[setup-docs-github-feedback] Next: install the GitHub App on ${owner}/${repo} if not installed yet.`
);
