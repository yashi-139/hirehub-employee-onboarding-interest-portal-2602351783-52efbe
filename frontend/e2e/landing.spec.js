import { expect, test } from '@playwright/test';

/** Captures browser failures so an apparently rendered page cannot hide client errors. */
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

test('landing page presents discovery content and both calls to action navigate to apply', async ({ page }) => {
  const errors = [];
  captureBrowserErrors(page, errors);

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Build Your Future With Us' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Why Join Us?' })).toBeVisible();
  await expect(page.getByText('Innovation')).toBeVisible();
  await expect(page.getByText('Career Growth')).toBeVisible();
  await expect(page.getByText('Great Culture')).toBeVisible();
  await expect(page.getByText('Global Impact')).toBeVisible();

  await page.getByRole('link', { name: 'Express Your Interest' }).click();
  await expect(page).toHaveURL(/\/apply$/);

  await page.goto('/');
  await page.getByRole('link', { name: 'Apply Now' }).click();
  await expect(page).toHaveURL(/\/apply$/);
  expect(errors).toEqual([]);
});
