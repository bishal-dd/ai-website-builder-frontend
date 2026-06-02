import { expect, type Page } from "@playwright/test";

export async function login(page: Page) {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing E2E_USER_EMAIL or E2E_USER_PASSWORD");
  }

  await page.goto("/auth/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.getByRole("button", { name: /login|sign in/i }).click();
  await expect(page).toHaveURL(/dashboard/);
}

export async function goToWizard(page: Page) {
  await page.getByTestId("create-project-header").click();
  await expect(page).toHaveURL(/wizard/);
}

export async function completeStepOne(page: Page) {
  await page.getByRole("button", { name: /portfolio/i }).click();
  await page.getByRole("button", { name: /next step/i }).click();

  await expect(
    page.getByRole("heading", { name: /select your pages/i }),
  ).toBeVisible();
}
