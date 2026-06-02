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

async function openUserContacts(page: Page) {
  await page.getByRole("link", { name: /user contacts/i }).click();

  await expect(page).toHaveURL(/\/admin\/contacts/i, {
    timeout: 30_000,
  });

  await expect(
    page.getByRole("heading", { name: /^user contacts$/i }),
  ).toBeVisible({
    timeout: 30_000,
  });
}

test("Admin can view generated projects of a user", async ({ page }) => {
  await loginAsAdmin(page);
  await openUserContacts(page);

  const userRow = page.getByRole("row").filter({
    hasText: "Choedra Gyamtsho",
  });

  await expect(userRow).toBeVisible({
    timeout: 30_000,
  });

  await userRow.getByRole("button", { name: /projects/i }).click();

  const dialog = page.getByRole("dialog");

  await expect(dialog).toBeVisible();

  await expect(dialog.getByText(/projects created by/i)).toBeVisible();

  await expect(dialog.getByRole("heading").nth(1)).toBeVisible();
});
