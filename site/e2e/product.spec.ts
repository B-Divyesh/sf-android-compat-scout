import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('desktop landing has no console errors and offers explicit release choices', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Find what broke your Android setup');
  await expect(page.locator('#platform-download')).toHaveText('Choose a platform and processor');
  await page.locator('#platform-download').click();
  await expect(page.locator('.download-options a')).toHaveCount(5);
  await expect(page.locator('.install code')).toContainText('https://android-compat-scout.sociobot.in/install.sh');
  await expect(page.locator('.install code')).not.toContainText('--path .');
  expect(errors).toEqual([]);
});

test('Android, iOS, macOS, and Linux visitors never receive a guessed binary', async ({ browser }) => {
  const cases = [
    { name: 'Android', mobile: true, userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/128 Mobile Safari/537.36' },
    { name: 'iOS', mobile: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148' },
    { name: 'Intel Mac', mobile: false, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/537.36 Chrome/128 Safari/537.36' },
    { name: 'Apple silicon', mobile: false, userAgent: 'Mozilla/5.0 (Macintosh; ARM Mac OS X 14_6) AppleWebKit/537.36 Chrome/128 Safari/537.36' },
    { name: 'Linux x64', mobile: false, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/128 Safari/537.36' },
    { name: 'Linux ARM', mobile: false, userAgent: 'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 Chrome/128 Safari/537.36' },
  ];
  for (const item of cases) {
    const context = await browser.newContext({ userAgent: item.userAgent });
    const page = await context.newPage();
    await page.goto('/');
    if (item.mobile) {
      await expect(page.getByText('Open install options on a computer', { exact: true }), item.name).toBeVisible();
      await expect(page.getByText('The command-line tool runs on Windows, macOS, or Linux.', { exact: true }), item.name).toBeVisible();
      await expect(page.locator('.download-options'), item.name).toHaveCount(0);
      await expect(page.locator('a[href*="releases/latest/download"]'), item.name).toHaveCount(0);
    } else {
      await expect(page.locator('#platform-download'), item.name).toHaveText('Choose a platform and processor');
      const hrefs = await page.locator('.download-options a').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      expect(hrefs, item.name).toEqual([
        'https://github.com/B-Divyesh/sf-android-compat-scout/releases/latest/download/compat-scout-x86_64-pc-windows-msvc.zip',
        'https://github.com/B-Divyesh/sf-android-compat-scout/releases/latest/download/compat-scout-aarch64-apple-darwin.tar.gz',
        'https://github.com/B-Divyesh/sf-android-compat-scout/releases/latest/download/compat-scout-x86_64-apple-darwin.tar.gz',
        'https://github.com/B-Divyesh/sf-android-compat-scout/releases/latest/download/compat-scout-x86_64-unknown-linux-musl.tar.gz',
        'https://github.com/B-Divyesh/sf-android-compat-scout/releases/latest/download/compat-scout-aarch64-unknown-linux-musl.tar.gz',
      ]);
    }
    await context.close();
  }
});

test('mobile demo is keyboard-focusable and has no serious axe findings', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('For owners of customized Android phones and vehicle dongles after an update, it groups setup changes into a JSON report.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  const lastFact = await page.locator('.facts li').last().boundingBox();
  expect(lastFact?.y ?? 1000).toBeLessThan(844);
  expect((lastFact?.y ?? 1000) + (lastFact?.height ?? 1000)).toBeLessThanOrEqual(844);
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

test('@claim:demo-storage-isolation ?demo=1 preserves real browser data and saves no sample data', async ({ page }) => {
  const requests: string[] = [];
  const downloads: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('download', (download) => downloads.push(download.suggestedFilename()));
  await page.goto('/');
  await page.evaluate(async () => {
    localStorage.setItem('real:compat-scout', 'local-sentinel');
    sessionStorage.setItem('real:compat-scout', 'session-sentinel');
    document.cookie = 'real_compat_scout=cookie-sentinel; path=/; SameSite=Strict';
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('real-compat-scout', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('records');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const transaction = request.result.transaction('records', 'readwrite');
        transaction.objectStore('records').put('indexeddb-sentinel', 'value');
        transaction.oncomplete = () => { request.result.close(); resolve(); };
        transaction.onerror = () => reject(transaction.error);
      };
    });
    const cache = await caches.open('real-compat-scout');
    await cache.put('/real-sentinel', new Response('cache-sentinel'));
  });
  const realData = () => page.evaluate(async () => {
    const indexed = await new Promise<string | undefined>((resolve, reject) => {
      const request = indexedDB.open('real-compat-scout', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const transaction = request.result.transaction('records', 'readonly');
        const get = transaction.objectStore('records').get('value');
        get.onsuccess = () => { request.result.close(); resolve(get.result); };
        get.onerror = () => reject(get.error);
      };
    });
    const cached = await (await caches.open('real-compat-scout')).match('/real-sentinel');
    return {
      local: [...Object.entries(localStorage)],
      session: [...Object.entries(sessionStorage)],
      indexed,
      cached: await cached?.text(),
      cookies: document.cookie,
      databases: (await indexedDB.databases()).map((database) => database.name),
      caches: await caches.keys(),
    };
  });
  const expected = {
    local: [['real:compat-scout', 'local-sentinel']],
    session: [['real:compat-scout', 'session-sentinel']],
    indexed: 'indexeddb-sentinel',
    cached: 'cache-sentinel',
    cookies: 'real_compat_scout=cookie-sentinel',
    databases: ['real-compat-scout'],
    caches: ['real-compat-scout'],
  };
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  expect(await realData()).toEqual(expected);
  await page.locator('.findings li').first().evaluate((item) => { item.textContent = 'altered sample'; });
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('.findings li').first()).toContainText('Android changed from 14 to 15');
  expect(await realData()).toEqual(expected);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await realData()).toEqual(expected);
  expect(downloads).toEqual([]);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4174')).toBe(true);
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
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  }
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Android Compat Scout');
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
});
