import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('desktop landing has no console errors and offers explicit release choices', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Find Android setup changes after an update');
  await expect(page.locator('#platform-download')).toHaveText('Choose a platform and processor');
  await page.locator('#platform-download').click();
  await expect(page.locator('.download-options a')).toHaveCount(5);
  await expect(page.locator('.install code')).toContainText('https://android-compat-scout.sociobot.in/install.sh');
  await expect(page.locator('.install code')).not.toContainText('--path .');
  expect(errors).toEqual([]);
});

test('desktop first screen keeps the sample action, result, and all facts in view', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const required = [
    page.getByRole('link', { name: 'Try it with sample data' }),
    page.getByText('See a sample upgrade report first.', { exact: true }),
    ...await page.locator('.facts li').all(),
  ];
  for (const item of required) {
    const box = await item.boundingBox();
    expect(box, await item.textContent() ?? 'required first-screen item').not.toBeNull();
    expect((box?.y ?? 901) + (box?.height ?? 1), await item.textContent() ?? 'required first-screen item').toBeLessThanOrEqual(900);
  }
});

test('header Install reaches and focuses the install heading from home and a subroute', async ({ page }) => {
  for (const path of ['/', '/privacy']) {
    await page.goto(path);
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Install' }).click();
    await expect(page).toHaveURL(/\/#install$/);
    const installTitle = page.locator('#install-title');
    await expect(installTitle).toBeInViewport();
    await expect(installTitle).toBeFocused();
  }
});

test('Back and Forward restore route focus and saved scroll positions', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1100);

  await page.evaluate(() => document.querySelector<HTMLAnchorElement>('nav[aria-label="Main navigation"] a[href="/privacy"]')?.click());
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1100);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();

  await page.goForward();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
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
      await expect(page.getByText('Downloads are available for Windows, macOS, and Linux.', { exact: true }), item.name).toBeVisible();
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

test('demo has no third-party requests and every persistent control meets the touch-target minimum', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo', '/privacy', '/terms', '/404.html']) {
    await page.goto(path);
    if (path === '/') await page.locator('#platform-download').click();
    const undersized = await page.locator('a, button, summary').evaluateAll((controls) => controls
      .filter((control) => {
        const style = getComputedStyle(control);
        const rect = control.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      })
      .filter((control) => {
        const rect = control.getBoundingClientRect();
        return rect.width < 44 || rect.height < 44;
      })
      .map((control) => ({ text: control.textContent?.trim(), width: Math.round(control.getBoundingClientRect().width), height: Math.round(control.getBoundingClientRect().height) })));
    expect(undersized, path).toEqual([]);
  }
  const origin = new URL(page.url()).origin;
  expect(requests.every((url) => new URL(url).origin === origin)).toBe(true);
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
  const origin = new URL(page.url()).origin;
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
  expect(requests.every((url) => new URL(url).origin === origin)).toBe(true);
});

test('each real route supplies its own canonical, description, and social metadata', async ({ page }) => {
  const expected = [
    ['/', 'https://android-compat-scout.sociobot.in/', 'Find Android setup changes after an update for a customized phone or vehicle dongle.'],
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

test('every route has no automated accessibility violations at mobile and desktop sizes', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (const path of ['/', '/?demo=1', '/privacy', '/terms', '/404.html']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page: page as never }).analyze();
      expect(results.violations, `${path} at ${viewport.width}px`).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
});

test('an already loaded demo stays usable if the network drops', async ({ context, page }) => {
  await page.goto('/?demo=1');
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Found 6 changes.')).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Find Android setup changes after an update');
  await context.setOffline(false);
});

test('every route reflows at 390px and 200% text without page-level horizontal scrolling', async ({ page }) => {
  for (const textScale of ['100%', '200%']) {
    for (const path of ['/', '/?demo=1', '/privacy', '/terms', '/404.html']) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);
      await page.evaluate((scale) => { document.documentElement.style.fontSize = scale; }, textScale);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${path} at ${textScale}`).toBeLessThanOrEqual(390);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.evaluate((scale) => { document.documentElement.style.fontSize = scale; }, textScale);
    await page.locator('#platform-download').click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `platform chooser at ${textScale}`).toBeLessThanOrEqual(390);
  }
});
