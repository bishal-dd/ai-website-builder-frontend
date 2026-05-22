import { test, expect } from "@playwright/test";
import { login, goToWizard } from "../helpers/wizard";

test("wizard step 1: user selects website type", async ({ page }) => {
  await login(page);
  await goToWizard(page);

  await expect(
    page.getByRole("heading", { name: /choose your website type/i }),
  ).toBeVisible();

  await page.getByRole("button", { name: /portfolio/i }).click();
  await page.getByRole("button", { name: /next step/i }).click();

  await expect(
    page.getByRole("heading", { name: /select your pages/i }),
  ).toBeVisible();
});
