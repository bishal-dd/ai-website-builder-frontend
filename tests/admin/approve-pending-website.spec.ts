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

test("Admin can approve pending website and start deployment", async ({
  page,
}) => {
  test.setTimeout(120_000);

  await loginAsAdmin(page);

  await expect(
    page.getByRole("heading", { name: /pending websites/i }),
  ).toBeVisible({
    timeout: 30_000,
  });

  await page
    .getByRole("button", { name: /^approve$/i })
    .first()
    .click();

  await expect(
    page.getByRole("heading", { name: /approve payment for/i }),
  ).toBeVisible({
    timeout: 30_000,
  });

  await expect(page.getByLabel(/payment type/i)).toBeVisible();
  await expect(page.getByLabel(/payment date/i)).toBeVisible();
  await expect(page.getByLabel(/total amount/i)).toBeVisible();

  const approveResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() !== "GET" &&
      /approve|payment|deploy|deployment/i.test(response.url()),
    { timeout: 60_000 },
  );

  await page.getByRole("button", { name: /confirm approval/i }).click();

  const approveResponse = await approveResponsePromise;
  expect(approveResponse.ok()).toBeTruthy();

  await expect(page.getByText(/approved:/i)).toBeVisible({
    timeout: 30_000,
  });
});
