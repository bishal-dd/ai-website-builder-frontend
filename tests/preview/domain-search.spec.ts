import { test, expect, type Page } from "@playwright/test";
import { login } from "../helpers/wizard";

async function getPreviewWebsiteId() {
  const websiteId = process.env.E2E_WEBSITE_ID;

  if (!websiteId) {
    throw new Error("Missing E2E_WEBSITE_ID in .env.local");
  }

  return websiteId;
}

async function openPreviewPage(page: Page, websiteId: string) {
  await login(page);

  await page.goto(`/preview/${websiteId}`);

  await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();
}

test("user can open domain page and search for a domain", async ({ page }) => {
  test.setTimeout(120_000);

  const websiteId = await getPreviewWebsiteId();

  await openPreviewPage(page, websiteId);

  // Click Publish
  await page.getByRole("button", { name: /publish/i }).click();

  // Verify redirect
  await expect(page).toHaveURL(new RegExp(`/domain/${websiteId}`), {
    timeout: 30_000,
  });

  // Domain input
  const domainInput = page.getByPlaceholder(
    /search domain|enter domain|example\.com/i,
  );

  await expect(domainInput).toBeVisible({
    timeout: 30_000,
  });

  await domainInput.fill("playwrightdomain.com");

  const suggestResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/domains/suggest") &&
      response.url().includes("keyword=playwrightdomain.com"),
  );

  await page.getByRole("button", { name: /search domain/i }).click();

  const suggestResponse = await suggestResponsePromise;
  expect(suggestResponse.ok()).toBeTruthy();

  await expect(page.getByText("playwrightdomain.com")).toBeVisible({
    timeout: 60_000,
  });

  await expect(page.getByText("playwrightdomain.net")).toBeVisible({
    timeout: 60_000,
  });
});
