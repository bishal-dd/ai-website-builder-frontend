import { test, expect, type FrameLocator, type Page } from "@playwright/test";
import path from "path";
import { login } from "../helpers/wizard";

const UPDATED_TEXT = "Updated Playwright Preview Text";

async function getPreviewWebsiteId() {
  const websiteId = process.env.E2E_WEBSITE_ID;

  if (!websiteId) {
    throw new Error("Missing E2E_WEBSITE_ID in .env.local");
  }

  return websiteId;
}

async function openPreviewPage(page: Page, websiteId: string) {
  await page.goto(`/preview/${websiteId}`);

  await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();

  await expect(page.locator("iframe")).toBeVisible();

  return page.frameLocator("iframe");
}

async function closeOnboardingTour(frame: FrameLocator) {
  const closeButton = frame.getByRole("button", { name: /close/i });

  if (await closeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await closeButton.click();
  }
}

async function editFirstEditableText(frame: FrameLocator, text: string) {
  const editableText = frame.locator('[data-tour="editable-text"]').first();

  await expect(editableText).toBeVisible({ timeout: 30_000 });

  await editableText.click();
  await editableText.press(
    process.platform === "darwin" ? "Meta+A" : "Control+A",
  );
  await editableText.fill(text);
  await editableText.press("Enter");

  await expect(editableText).toContainText(text);
}

async function changeFirstEditableImage(page: Page, frame: FrameLocator) {
  const imageFile = path.join(
    process.cwd(),
    "src/tests/fixtures/test-image.png",
  );

  const changeButton = frame
    .getByRole("button", { name: /change background|change/i })
    .first();

  await expect(changeButton).toBeVisible({ timeout: 30_000 });

  const imageWrapper = changeButton.locator("xpath=ancestor::*[.//img][1]");
  const targetImage = imageWrapper.locator("img").first();

  await expect(targetImage).toBeVisible({ timeout: 30_000 });

  const oldSrc = await targetImage.getAttribute("src");

  const fileChooserPromise = page.waitForEvent("filechooser");

  await changeButton.click();

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(imageFile);

  await expect(frame.getByText(/uploading/i)).toBeVisible({
    timeout: 10_000,
  });

  await expect(frame.getByText(/uploading/i)).toBeHidden({
    timeout: 60_000,
  });

  await expect
    .poll(async () => targetImage.getAttribute("src"), {
      timeout: 60_000,
    })
    .not.toBe(oldSrc);
}

test("user can edit text and change image in preview", async ({ page }) => {
  test.setTimeout(120_000);

  const websiteId = await getPreviewWebsiteId();

  await login(page);

  const frame = await openPreviewPage(page, websiteId);

  await closeOnboardingTour(frame);

  await editFirstEditableText(frame, UPDATED_TEXT);

  await changeFirstEditableImage(page, frame);
});
