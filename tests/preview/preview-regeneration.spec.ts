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
  await expect(page.locator("iframe")).toBeVisible();
}

async function openAiHelper(page: Page) {
  await page.getByRole("button", { name: /ai helper/i }).click();

  await expect(page.getByText("Sencill AI")).toBeVisible({
    timeout: 10_000,
  });
}

async function submitRegenerationPrompt(page: Page, instruction: string) {
  const promptInput = page.getByPlaceholder(
    /describe what you want to change on this page/i,
  );

  await expect(promptInput).toBeVisible({
    timeout: 10_000,
  });

  await promptInput.fill(instruction);

  await page.keyboard.press("Enter");

  await expect(
    page.getByText(/changes are being applied to this page/i),
  ).toBeVisible({
    timeout: 30_000,
  });
}

async function waitForRegenerationToFinish(page: Page) {
  await expect(
    page.getByText(/changes are being applied to this page/i),
  ).toBeHidden({
    timeout: 120_000,
  });
}

test("user can regenerate website page using AI helper", async ({ page }) => {
  test.setTimeout(180_000);

  const websiteId = await getPreviewWebsiteId();

  await openPreviewPage(page, websiteId);

  await openAiHelper(page);

  await submitRegenerationPrompt(
    page,
    "Make the homepage hero section more modern and professional.",
  );

  await waitForRegenerationToFinish(page);
});
