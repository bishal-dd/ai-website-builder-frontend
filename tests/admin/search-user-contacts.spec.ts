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

test("Admin can search user by name or email", async ({ page }) => {
  await loginAsAdmin(page);
  await openUserContacts(page);

  const searchInput = page.getByPlaceholder(/search by name or email/i);

  await expect(searchInput).toBeVisible();

  // Search by email
  await searchInput.fill("gyamtsho999@gmail.com");

  // Debounced search
  await page.waitForTimeout(500);

  await expect(
    page.getByRole("row").filter({
      hasText: "gyamtsho999@gmail.com",
    }),
  ).toBeVisible({
    timeout: 30_000,
  });

  await expect(
    page.getByRole("row").filter({
      hasText: "Choedra Gyamtsho",
    }),
  ).toBeVisible();

  // Optional: ensure filtered results reduced
  await expect(page.getByRole("row")).toHaveCount(2);
  // 1 header row + 1 matched row
});
