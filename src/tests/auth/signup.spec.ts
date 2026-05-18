import { test, expect } from "@playwright/test";

test("user can sign up", async ({ page }) => {
  const email = `test-${Date.now()}@example.com`;

  await page.goto("/auth/signup");

  await page.fill('input[name="name"]', "Test User");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "Password123!");

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/verify|dashboard|sign-in/);
});
