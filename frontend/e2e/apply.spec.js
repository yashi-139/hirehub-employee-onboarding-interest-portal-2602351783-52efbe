import { expect, test } from '@playwright/test';

/** Capture browser errors so a visible flow cannot conceal a client-side failure. */
function captureBrowserErrors(page, errors) {
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
}

test('candidate submits a valid application and persists the complete record', async ({ page }) => {
  const errors = [];
  captureBrowserErrors(page, errors);

  await page.goto('/apply');
  await page.getByLabel('Full Name').fill('Ava Smith');
  await page.getByLabel('Email Address').fill('ava@example.com');
  await page.getByLabel('Mobile Number').fill('1234567890');
  await page.getByLabel('Department of Interest').selectOption('Engineering');
  await page.getByRole('button', { name: 'Submit Application' }).click();

  await expect(
    page.getByRole('status', { name: 'Thank you! Your interest has been submitted successfully.' }),
  ).toBeVisible();
  await expect(page.getByLabel('Full Name')).toHaveValue('');

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('hirehub_submissions')));
  expect(stored).toHaveLength(1);
  expect(stored[0]).toMatchObject({
    fullName: 'Ava Smith',
    email: 'ava@example.com',
    mobile: '1234567890',
    department: 'Engineering',
  });
  expect(typeof stored[0].id).toBe('string');
  expect(new Date(stored[0].submittedAt).toISOString()).toBe(stored[0].submittedAt);
  expect(errors).toEqual([]);
});
