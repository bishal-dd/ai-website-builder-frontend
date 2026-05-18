import { test, expect } from "@playwright/test";

test("user can request password reset", async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL;

  if (!email) {
    throw new Error("Missing E2E_USER_EMAIL in .env.local");
  }

  await page.goto("/auth/forgot-password");

  await page.fill("#email", email);

  await page.getByRole("button", { name: /send reset link/i }).click();

  await expect(
    page.getByText(/we’ve sent a password reset link/i),
  ).toBeVisible();
});
