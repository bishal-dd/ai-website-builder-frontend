import { test, expect, type Page } from "@playwright/test";
import { login } from "../helpers/wizard";

const TEST_DOMAIN = "playwrightdomain.com";

async function getPreviewWebsiteId() {
  const websiteId = process.env.E2E_WEBSITE_ID;

  if (!websiteId) {
    throw new Error("Missing E2E_WEBSITE_ID in .env.local");
  }

  return websiteId;
}

async function openDomainPageFromPreview(page: Page, websiteId: string) {
  await login(page);

  await page.goto(`/preview/${websiteId}`);

  await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();

  await page.getByRole("button", { name: /publish/i }).click();

  await expect(page).toHaveURL(new RegExp(`/domain/${websiteId}`), {
    timeout: 30_000,
  });
}

async function searchDomain(page: Page, domain: string) {
  const domainInput = page.getByPlaceholder(/enter domain name/i);

  await expect(domainInput).toBeVisible({ timeout: 30_000 });

  await domainInput.fill(domain);

  const suggestResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/domains/suggest") &&
      response.url().includes(`keyword=${domain}`),
    { timeout: 60_000 },
  );

  await page.getByRole("button", { name: /search domain/i }).click();

  const suggestResponse = await suggestResponsePromise;

  expect(suggestResponse.ok()).toBeTruthy();

  await expect(page.getByText(domain, { exact: true })).toBeVisible({
    timeout: 60_000,
  });
}

async function selectFirstAvailableDomain(page: Page) {
  await page.getByRole("button", { name: "Select" }).first().click();

  await expect(
    page.getByRole("heading", { name: /payment summary/i }),
  ).toBeVisible({
    timeout: 30_000,
  });
}

async function continuePaymentViaWhatsApp(page: Page) {
  const whatsappPopupPromise = page.waitForEvent("popup");

  await page.getByRole("button", { name: /pay full amount/i }).click();

  const whatsappPage = await whatsappPopupPromise;

  await expect(whatsappPage).toHaveURL(/wa\.me|whatsapp/i, {
    timeout: 30_000,
  });
}

test("user can select domain and continue payment via WhatsApp", async ({
  page,
}) => {
  test.setTimeout(180_000);

  const websiteId = await getPreviewWebsiteId();

  await openDomainPageFromPreview(page, websiteId);

  await searchDomain(page, TEST_DOMAIN);

  await selectFirstAvailableDomain(page);

  await continuePaymentViaWhatsApp(page);
});
