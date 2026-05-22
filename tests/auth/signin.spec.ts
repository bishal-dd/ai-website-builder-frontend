import { test, expect } from "@playwright/test";

test("user can sign in", async ({ page }) => {
  await page.goto("/auth/login");

  await page.fill('input[name="email"]', process.env.E2E_USER_EMAIL!);
  await page.fill('input[name="password"]', process.env.E2E_USER_PASSWORD!);

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/);
});
