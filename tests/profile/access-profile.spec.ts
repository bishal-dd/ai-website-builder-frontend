import { test, expect } from "@playwright/test";
import { login } from "../helpers/wizard";

test("TC_SAI_037 - user can access profile settings page", async ({ page }) => {
  await login(page);

  await page.goto("/dashboard/profile");

  await expect(
    page.getByRole("heading", { name: /profile settings/i }),
  ).toBeVisible();

  await expect(page.getByRole("tab", { name: /general/i })).toBeVisible();
  await expect(page.getByRole("tab", { name: /security/i })).toBeVisible();

  await expect(page.getByRole("tabpanel", { name: /general/i })).toContainText(
    "General Information",
  );
});
