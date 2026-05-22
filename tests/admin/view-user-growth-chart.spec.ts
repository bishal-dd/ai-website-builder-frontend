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

test("Admin can view user growth chart", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/admin/analytics");

  await expect(page.getByRole("heading", { name: /analytics/i })).toBeVisible({
    timeout: 30_000,
  });

  await page.getByText(/total users/i).click();

  await expect(page).toHaveURL(/\/admin\/analytics\/users/i, {
    timeout: 30_000,
  });

  await expect(page.getByText(/user growth/i)).toBeVisible({
    timeout: 30_000,
  });
});
