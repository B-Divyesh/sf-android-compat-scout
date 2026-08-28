import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('desktop landing has no console errors and detects a release asset link', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Find what broke your Android setup');
  await expect(page.locator('#platform-download')).toHaveAttribute('href', /compat-scout-x86_64-unknown-linux-musl\.tar\.gz$/);
  await expect(page.locator('.install code')).toContainText('https://android-compat-scout.sociobot.in/install.sh');
  await expect(page.locator('.install code')).not.toContainText('--path .');
  expect(errors).toEqual([]);
});

test('mobile demo is keyboard-focusable and has no serious axe findings', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).press('Enter');
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('.demo-page pre')).toHaveAttribute('tabindex', '0');
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('demo has no third-party requests and navigation links meet touch-target height', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  expect(requests.every((url) => url.startsWith('http://127.0.0.1:4174/'))).toBe(true);
  const heights = await page.locator('.topbar nav a, footer a, .install a').evaluateAll((links) => links.map((link) => Math.round(link.getBoundingClientRect().height)));
  expect(heights.every((height) => height >= 44)).toBe(true);
});

test('@claim:demo-storage-isolation ?demo=1 demo does not persist sample or real data', async ({ page }) => {
  await page.goto('/?demo=1');
  const storageKeys = () => page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
  }));
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  expect(await storageKeys()).toEqual({ local: [], session: [] });
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await storageKeys()).toEqual({ local: [], session: [] });
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await storageKeys()).toEqual({ local: [], session: [] });
});

test('each real route supplies its own canonical, description, and social metadata', async ({ page }) => {
  const expected = [
    ['/', 'https://android-compat-scout.sociobot.in/', 'Find Android update changes that affect a customized phone or vehicle dongle.'],
    ['/demo', 'https://android-compat-scout.sociobot.in/demo', 'See a sample Android upgrade report without connecting a phone or saving data.'],
    ['/privacy', 'https://android-compat-scout.sociobot.in/privacy', 'Learn which Android device facts Compat Scout reads and which identifiers it omits.'],
    ['/terms', 'https://android-compat-scout.sociobot.in/terms', 'Read the safe-use terms for Android Compat Scout.'],
  ] as const;
  for (const [path, canonical, description] of expected) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description);
  }
});
