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

test('candidate submits a valid application', async ({ page }, testInfo) => {
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
  await page.screenshot({ path: testInfo.outputPath('apply-desktop-success.png'), fullPage: true });
  expect(errors).toEqual([]);
});
