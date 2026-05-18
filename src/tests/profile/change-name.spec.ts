import { test, expect } from "@playwright/test";
import { login } from "../helpers/wizard";

test("TC_SAI_040 - user can change name successfully", async ({ page }) => {
  const newName = `Playwright User ${Date.now()}`;

  await login(page);

  await page.goto("/dashboard/profile");

  await expect(
    page.getByRole("heading", { name: /profile settings/i }),
  ).toBeVisible();

  await page.getByLabel(/full name/i).fill(newName);

  await page.getByRole("button", { name: /save changes/i }).click();

  await expect(page.getByText(/updated|success|saved/i)).toBeVisible({
    timeout: 30_000,
  });

  await expect(page.getByText(newName)).toBeVisible({
    timeout: 30_000,
  });
});
