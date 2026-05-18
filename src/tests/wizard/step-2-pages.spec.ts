import { test, expect } from "@playwright/test";
import { login, goToWizard, completeStepOne } from "../helpers/wizard";

test("wizard step 2: user selects pages", async ({ page }) => {
  await login(page);
  await goToWizard(page);
  await completeStepOne(page);

  await expect(
    page.getByRole("heading", { name: /select your pages/i }),
  ).toBeVisible();

  const projectsPage = page.getByRole("button", { name: /projects/i });

  if (await projectsPage.isVisible()) {
    await projectsPage.click();
  }

  await page.getByRole("button", { name: /next step/i }).click();

  await expect(
    page.getByRole("heading", { name: /website details/i }),
  ).toBeVisible();
});
