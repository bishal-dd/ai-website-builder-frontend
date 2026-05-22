import { test, expect, type Page } from "@playwright/test";

async function loginAsAdmin(page: Page) {
  const adminEmail = process.env.E2E_ADMIN_EMAIL;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Missing E2E_ADMIN_EMAIL or E2E_ADMIN_PASSWORD");
  }

  await page.goto("/auth/login");

  await page.getByLabel(/email/i).fill(adminEmail);
  await page.getByLabel(/password/i).fill(adminPassword);

  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/admin\/dashboard/i, {
    timeout: 30_000,
  });
}

async function openApprovedWebsites(page: Page) {
  await page.getByRole("link", { name: /approved websites/i }).click();

  await expect(page).toHaveURL(/\/admin\/dashboard\/approved/i, {
    timeout: 30_000,
  });

  await expect(
    page.getByRole("heading", { name: /approved websites/i }),
  ).toBeVisible({
    timeout: 30_000,
  });
}

test("Admin can search approved websites by website ID", async ({ page }) => {
  const websiteId = process.env.E2E_WEBSITE_ID;

  if (!websiteId) {
    throw new Error("Missing E2E_WEBSITE_ID");
  }

  await loginAsAdmin(page);
  await openApprovedWebsites(page);

  const searchInput = page.getByPlaceholder(/search by website id/i);

  await expect(searchInput).toBeVisible();

  await searchInput.fill(websiteId);

  await expect(page).toHaveURL(new RegExp(`websiteId=${websiteId}`), {
    timeout: 30_000,
  });

  const rows = page.getByRole("row");

  await expect(rows).toHaveCount(2, {
    timeout: 30_000,
  });

  await expect(page.getByText(/total approved:\s*1/i)).toBeVisible();
  await expect(rows.nth(1)).toContainText(/view payment/i);
});
