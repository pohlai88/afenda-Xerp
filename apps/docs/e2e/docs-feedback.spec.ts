import { expect, test } from "@afenda/testing/e2e/playwright-base";

function isDocsFeedbackConfigured(): boolean {
  return Boolean(
    process.env["DOCS_GITHUB_APP_ID"]?.trim() &&
      process.env["DOCS_GITHUB_APP_PRIVATE_KEY"]?.trim()
  );
}

async function clearDocsFeedbackStorage(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("docs-feedback-")) {
        localStorage.removeItem(key);
      }
    }
  });
}

test.describe("docs feedback", () => {
  test("@smoke renders page feedback controls on a guide page", async ({
    page,
  }) => {
    await page.goto("/en/docs/getting-started", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByText("How is this guide?", { exact: true })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Good" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Bad" })).toBeVisible();
  });

  test("@smoke submits page feedback and shows thank-you state", async ({
    page,
  }) => {
    await page.goto("/en/docs/getting-started", {
      waitUntil: "domcontentloaded",
    });

    await clearDocsFeedbackStorage(page);
    await page.reload({ waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Good" }).click();
    await page
      .getByPlaceholder("Leave your feedback...")
      .fill(`E2E docs feedback ${Date.now()}`);
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText("Thank you for your feedback!", { exact: true })
    ).toBeVisible({ timeout: 20_000 });
  });

  test("@smoke forwards configured feedback to GitHub Discussions", async ({
    page,
  }) => {
    test.skip(
      process.env["DOCS_GITHUB_FEEDBACK_E2E"] !== "true",
      "Set DOCS_GITHUB_FEEDBACK_E2E=true after installing the GitHub App on pohlai88/afenda-Xerp and creating the Docs Feedback discussion category"
    );
    test.skip(
      !isDocsFeedbackConfigured(),
      "Set DOCS_GITHUB_APP_ID and DOCS_GITHUB_APP_PRIVATE_KEY in apps/docs/.env.local"
    );

    await page.goto("/en/docs/getting-started", {
      waitUntil: "domcontentloaded",
    });

    await clearDocsFeedbackStorage(page);
    await page.reload({ waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Good" }).click();
    await page
      .getByPlaceholder("Leave your feedback...")
      .fill(`E2E GitHub feedback ${Date.now()}`);
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByRole("link", { name: "View on GitHub" })
    ).toBeVisible({ timeout: 30_000 });
  });
});
