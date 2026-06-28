import { expect, test } from "@afenda/testing/e2e/playwright-base";

const CARD_GRID = "/en/docs/use-erp";
const PROSE_GUIDE = "/en/docs/getting-started";
const CARD_LINK = "#nd-page [data-card]";
const CARD_TITLE = "#nd-page [data-card] h3";
const CARD_DESCRIPTION = "#nd-page [data-card] p.text-fd-muted-foreground";
const SIDEBAR_LINK = "#nd-sidebar a";

async function readComputedTextStyle(
  page: import("@playwright/test").Page,
  selector: string
) {
  return page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) {
      return null;
    }
    const style = getComputedStyle(element);
    return {
      color: style.color,
      textDecorationLine: style.textDecorationLine,
    };
  }, selector);
}

async function applyDocsDarkTheme(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
  });
}

function colorsMatch(a: string, b: string): boolean {
  return a.replace(/\s+/g, "") === b.replace(/\s+/g, "");
}

async function readProseAccentRgb(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.color = "var(--docs-prose-accent)";
    document.body.append(probe);
    const rgb = getComputedStyle(probe).color;
    probe.remove();
    return rgb;
  });
}

async function expectCardChromeNeutral(page: import("@playwright/test").Page) {
  const description = await readComputedTextStyle(page, CARD_DESCRIPTION);
  expect(description, "card description must exist").not.toBeNull();
  expect(description?.textDecorationLine).toBe("none");

  const title = await readComputedTextStyle(page, CARD_TITLE);
  expect(title, "card title must exist").not.toBeNull();
  expect(title?.textDecorationLine).toBe("none");

  const proseAccentRgb = await readProseAccentRgb(page);
  expect(colorsMatch(title?.color ?? "", proseAccentRgb)).toBe(false);

  await page.locator(CARD_LINK).first().hover();

  const titleHover = await readComputedTextStyle(page, CARD_TITLE);
  expect(titleHover?.textDecorationLine).toBe("none");
  expect(colorsMatch(titleHover?.color ?? "", proseAccentRgb)).toBe(false);
}

async function expectInlineProseLinkUnderlined(page: import("@playwright/test").Page) {
  const inlineLink = page.locator("#nd-page .prose a").filter({
    hasNot: page.locator("[data-card]"),
  });
  await expect(inlineLink.first()).toBeVisible();

  const linkStyle = await readComputedTextStyle(
    page,
    "#nd-page .prose a:not([data-card])"
  );
  expect(linkStyle, "inline prose link must exist").not.toBeNull();
  expect(linkStyle?.textDecorationLine).toBe("underline");
}

function isDarkColor(color: string): boolean {
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const average =
      (Number(rgbMatch[1]) + Number(rgbMatch[2]) + Number(rgbMatch[3])) / 3;
    return average < 100;
  }

  const labMatch = color.match(/lab\(\s*([\d.]+)/);
  if (labMatch) {
    return Number(labMatch[1]) < 35;
  }

  const oklchMatch = color.match(/oklch\(\s*([\d.]+)/);
  if (oklchMatch) {
    return Number(oklchMatch[1]) < 0.35;
  }

  return false;
}

async function expectSidebarNotAccent(page: import("@playwright/test").Page) {
  const sidebar = await readComputedTextStyle(page, SIDEBAR_LINK);
  expect(sidebar, "sidebar link must exist").not.toBeNull();

  const proseAccentRgb = await readProseAccentRgb(page);
  expect(colorsMatch(sidebar?.color ?? "", proseAccentRgb)).toBe(false);
}

test.describe("docs visual contract", () => {
  test("@visual @smoke light — card grid has no accent underline or title tint", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });

    await page.goto(CARD_GRID, { waitUntil: "domcontentloaded" });
    await expect(page.locator(CARD_LINK).first()).toBeVisible({ timeout: 30_000 });

    await expectCardChromeNeutral(page);
    await expectSidebarNotAccent(page);

    expect(errors, "console must be clean").toEqual([]);
  });

  test("@visual @smoke light — inline prose links are underlined", async ({
    page,
  }) => {
    await page.goto(PROSE_GUIDE, { waitUntil: "domcontentloaded" });
    await expectInlineProseLinkUnderlined(page);
  });

  test("@visual @smoke dark — card grid stays neutral", async ({ page }) => {
    await page.goto(CARD_GRID, { waitUntil: "domcontentloaded" });

    await applyDocsDarkTheme(page);
    await page.waitForTimeout(100);

    await expectCardChromeNeutral(page);
    await expectSidebarNotAccent(page);
  });

  test("@visual @smoke dark — background uses graphite stack not flat gray", async ({
    page,
  }) => {
    await page.goto(CARD_GRID, { waitUntil: "domcontentloaded" });

    await applyDocsDarkTheme(page);

    const bodyBg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });

    expect(bodyBg).not.toBe("rgba(0, 0, 0, 0)");
    expect(isDarkColor(bodyBg), `body background should be dark: ${bodyBg}`).toBe(
      true
    );
  });
});
