import { expect, test } from '@playwright/test';

/** Capture browser errors so an apparently successful workflow cannot hide client failures. */
function captureBrowserErrors(page, errors) {
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
}

test('admin logs in, manages seeded submissions, and persists edits and deletes', async ({ page }) => {
  const errors = [];
  captureBrowserErrors(page, errors);
  await page.addInitScript(() => {
    localStorage.setItem('hirehub_submissions', JSON.stringify([{ id: 'candidate-1', fullName: 'Ava Smith', email: 'ava@example.com', mobile: '1234567890', department: 'Engineering', submittedAt: '2026-03-04T12:00:00.000Z' }]));
  });
  await page.goto('/admin');
  await page.getByPlaceholder('Enter username').fill('wrong');
  await page.getByPlaceholder('Enter password').fill('wrong');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('alert')).toHaveText('Invalid credentials. Please try again.');
  await page.getByPlaceholder('Enter username').fill('admin');
  await page.getByPlaceholder('Enter password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Submissions Dashboard' })).toBeVisible();
  await expect(page.getByText('Ava Smith')).toBeVisible();
  await expect(page.getByText('Mar 4, 2026')).toBeVisible();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByLabel('Full Name').fill('Ava Jones');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText('Ava Jones')).toBeVisible();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('Are you sure you want to delete this submission?')).toBeVisible();
  await page.getByRole('dialog', { name: 'Delete Submission' }).getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByText('No submissions yet.')).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('hirehub_submissions')));
  expect(stored).toEqual([]);
  expect(errors).toEqual([]);
});
