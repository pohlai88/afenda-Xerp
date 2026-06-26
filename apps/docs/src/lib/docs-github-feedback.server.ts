"use server";

import { App, Octokit } from "octokit";
import {
  blockFeedback,
  type ActionResponse,
  type BlockFeedback,
  pageFeedback,
  type PageFeedback,
} from "@/components/feedback/schema";
import {
  docsGithubFeedbackCategory,
  docsGithubRepository,
} from "@/lib/docs-github.constants";
import {
  isDocsFeedbackConfigured,
  resolveDocsGithubAppPrivateKey,
} from "@/lib/docs-github-feedback-env";

let instance: Octokit | undefined;

async function getOctokit(): Promise<Octokit> {
  if (instance) {
    return instance;
  }

  const appId = process.env["DOCS_GITHUB_APP_ID"]?.trim();
  const privateKey = resolveDocsGithubAppPrivateKey();

  if (!appId || !privateKey) {
    throw new Error(
      "Docs feedback requires DOCS_GITHUB_APP_ID and DOCS_GITHUB_APP_PRIVATE_KEY."
    );
  }

  const app = new App({
    appId,
    privateKey,
  });

  const { owner, repo } = docsGithubRepository;
  const { data } = await app.octokit.request(
    "GET /repos/{owner}/{repo}/installation",
    {
      owner,
      repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  instance = await app.getInstallationOctokit(data.id);
  return instance;
}

interface RepositoryInfo {
  id: string;
  discussionCategories: {
    nodes: {
      id: string;
      name: string;
    }[];
  };
}

let cachedDestination: RepositoryInfo | undefined;

async function getFeedbackDestination(): Promise<RepositoryInfo> {
  if (cachedDestination) {
    return cachedDestination;
  }

  const octokit = await getOctokit();
  const { owner, repo } = docsGithubRepository;

  const { repository }: { repository: RepositoryInfo } = await octokit.graphql(`
    query {
      repository(owner: "${owner}", name: "${repo}") {
        id
        discussionCategories(first: 25) {
          nodes { id name }
        }
      }
    }
  `);

  cachedDestination = repository;
  return repository;
}

export async function onPageFeedbackAction(
  feedback: PageFeedback
): Promise<ActionResponse> {
  if (!isDocsFeedbackConfigured()) {
    return {};
  }

  try {
    const parsed = pageFeedback.parse(feedback);
    const url = new URL(parsed.url);

    return await createDiscussionThread(
      url.pathname,
      `[${parsed.opinion}] ${parsed.message}\n\n> Forwarded from user feedback.`
    );
  } catch {
    return {};
  }
}

export async function onBlockFeedbackAction(
  feedback: BlockFeedback
): Promise<ActionResponse> {
  if (!isDocsFeedbackConfigured()) {
    return {};
  }

  try {
    const parsed = blockFeedback.parse(feedback);
    const url = new URL(parsed.url);
    url.hash = parsed.blockId;

    return await createDiscussionThread(
      url.pathname,
      `> ${parsed.blockBody}\n\n${parsed.message}\n\n> [Forwarded from user feedback](${url.href}).`
    );
  } catch {
    return {};
  }
}

async function createDiscussionThread(
  pageId: string,
  body: string
): Promise<ActionResponse> {
  const octokit = await getOctokit();
  const destination = await getFeedbackDestination();
  const { owner, repo } = docsGithubRepository;

  const category = destination.discussionCategories.nodes.find(
    (entry) => entry.name === docsGithubFeedbackCategory
  );

  if (!category) {
    throw new Error(
      `Create a "${docsGithubFeedbackCategory}" category in GitHub Discussions.`
    );
  }

  const title = `Feedback for ${pageId}`;
  const queryResult: {
    search: {
      nodes: { id: string; title: string; url: string }[];
    };
  } = await octokit.graphql(`
    query {
      search(type: DISCUSSION, query: ${JSON.stringify(`"${title}" in:title repo:${owner}/${repo} author:@me`)}, first: 10) {
        nodes {
          ... on Discussion { id, title, url }
        }
      }
    }
  `);

  const discussion = queryResult.search.nodes.find(
    (entry) => entry.title === title
  );

  if (discussion) {
    const result: {
      addDiscussionComment: {
        comment: { id: string; url: string };
      };
    } = await octokit.graphql(`
      mutation {
        addDiscussionComment(input: { body: ${JSON.stringify(body)}, discussionId: "${discussion.id}" }) {
          comment { id, url }
        }
      }
    `);

    return {
      githubUrl: result.addDiscussionComment.comment.url,
    };
  }

  const result: {
    createDiscussion: {
      discussion: { id: string; url: string };
    };
  } = await octokit.graphql(`
    mutation {
      createDiscussion(input: { repositoryId: "${destination.id}", categoryId: "${category.id}", body: ${JSON.stringify(body)}, title: ${JSON.stringify(title)} }) {
        discussion { id, url }
      }
    }
  `);

  return {
    githubUrl: result.createDiscussion.discussion.url,
  };
}
