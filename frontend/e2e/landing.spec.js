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
  await expect(page.getByRole('heading', { name: 'Innovation' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Career Growth' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Great Culture' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Global Impact' })).toBeVisible();

  await page.getByRole('link', { name: 'Express Your Interest' }).click();
  await expect(page).toHaveURL(/\/apply$/);

  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole('link', { name: 'Apply Now' }).click();
  await expect(page).toHaveURL(/\/apply$/);
  expect(errors).toEqual([]);
});

test('primary navigation remains available on a mobile viewport', async ({ page }, testInfo) => {
  const errors = [];
  captureBrowserErrors(page, errors);

  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Apply', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Admin', exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('landing-mobile-navigation.png'), fullPage: true });
  expect(errors).toEqual([]);
});
