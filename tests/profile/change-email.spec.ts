import { test, expect } from "@playwright/test";
import { login } from "../helpers/wizard";

test("TC_SAI_038 - user can request email change verification", async ({
  page,
}) => {
  const newEmail = `playwright-${Date.now()}@example.com`;

  await login(page);

  await page.goto("/dashboard/profile");

  await expect(
    page.getByRole("heading", { name: /profile settings/i }),
  ).toBeVisible();

  const emailInput = page.getByLabel(/email address/i);

  await emailInput.click();
  await emailInput.press(
    process.platform === "darwin" ? "Meta+A" : "Control+A",
  );
  await emailInput.type(newEmail);

  const saveButton = page.getByRole("button", {
    name: /save changes/i,
  });

  await expect(saveButton).toBeEnabled({
    timeout: 10_000,
  });

  await saveButton.click();

  await expect(page.getByText(/verification|verify|email/i)).toBeVisible({
    timeout: 30_000,
  });
});
