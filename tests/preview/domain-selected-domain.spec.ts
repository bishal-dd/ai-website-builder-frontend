import { test, expect, type Page } from "@playwright/test";
import { login } from "../helpers/wizard";

const FIRST_DOMAIN = "playwrightdomain.com";
const SECOND_DOMAIN = "playwrightnewdomain.com";

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

async function openDomainPage(page: Page, websiteId: string) {
  await page.getByRole("button", { name: /publish/i }).click();

  await expect(page).toHaveURL(new RegExp(`/domain/${websiteId}`), {
    timeout: 30_000,
  });

  await expect(
    page.getByRole("heading", { name: /find a domain/i }),
  ).toBeVisible({
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

async function selectFirstDomain(page: Page) {
  await page.getByRole("button", { name: "Select" }).first().click();

  await expect(
    page.getByRole("heading", { name: /payment summary/i }),
  ).toBeVisible({
    timeout: 30_000,
  });
}

async function goBackToDomainSelection(page: Page) {
  await page.getByRole("button").first().click();

  await expect(
    page.getByRole("heading", { name: /find a domain/i }),
  ).toBeVisible({
    timeout: 30_000,
  });
}

test("TC_SAI_024 - user can view previously selected domain", async ({
  page,
}) => {
  test.setTimeout(180_000);

  const websiteId = await getPreviewWebsiteId();

  await openPreviewPage(page, websiteId);
  await openDomainPage(page, websiteId);

  await searchDomain(page, FIRST_DOMAIN);
  await selectFirstDomain(page);

  await page.goto(`/preview/${websiteId}`);

  await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();

  await openDomainPage(page, websiteId);

  await expect(page.getByText(`Current domain: ${FIRST_DOMAIN}`)).toBeVisible({
    timeout: 30_000,
  });

  await page.getByRole("button", { name: /continue/i }).click();

  await expect(
    page.getByRole("heading", { name: /payment summary/i }),
  ).toBeVisible({
    timeout: 30_000,
  });
});

test("TC_SAI_025 - user can change selected domain", async ({ page }) => {
  test.setTimeout(180_000);

  const websiteId = await getPreviewWebsiteId();

  await openPreviewPage(page, websiteId);
  await openDomainPage(page, websiteId);

  await searchDomain(page, FIRST_DOMAIN);
  await selectFirstDomain(page);

  await goBackToDomainSelection(page);

  await searchDomain(page, SECOND_DOMAIN);
  await selectFirstDomain(page);

  await expect(page.getByText(SECOND_DOMAIN, { exact: true })).toBeVisible({
    timeout: 30_000,
  });

  await expect(page.getByText(FIRST_DOMAIN, { exact: true })).not.toBeVisible();
});
