import './style.css';
import './overrides.css';
import hero from './assets/blueprint-hero.webp';

type Route = 'home' | 'demo' | 'privacy' | 'terms' | 'not-found';
const app = document.querySelector<HTMLDivElement>('#app')!;

const siteUrl = 'https://android-compat-scout.sociobot.in';
const pageMetadata: Record<Route, { title: string; description: string; path: string }> = {
  home: { title: 'Android Compat Scout — Find Android setup regressions', description: 'Find Android update changes that affect a customized phone or vehicle dongle.', path: '/' },
  demo: { title: 'Demo — Android Compat Scout', description: 'See a sample Android upgrade report without connecting a phone or saving data.', path: '/demo' },
  privacy: { title: 'Privacy — Android Compat Scout', description: 'Learn which Android device facts Compat Scout reads and which identifiers it omits.', path: '/privacy' },
  terms: { title: 'Terms — Android Compat Scout', description: 'Read the safe-use terms for Android Compat Scout.', path: '/terms' },
  'not-found': { title: 'Page not found — Android Compat Scout', description: 'This Android Compat Scout page does not exist.', path: '/404.html' },
};

const shell = (content: string) => `
<header class="topbar"><a class="wordmark" href="/" data-route>ANDROID<br><strong>COMPAT SCOUT</strong></a><nav aria-label="Main navigation"><a href="/demo" data-route>Demo</a><a href="/#install">Install</a><a href="/privacy" data-route>Privacy</a></nav></header>
<div class="route-note" aria-live="polite"></div><main id="main" tabindex="-1">${content}</main>
<footer><p>A command-line report for Android setup changes.</p><p><a href="/privacy" data-route>Privacy</a> · <a href="/terms" data-route>Terms</a> · Built by Param Factory · v0.1.2</p></footer>`;

const terminal = `<div class="terminal" aria-label="Terminal recording of the sample report"><p><span>$</span> compat-scout demo</p><p>Demo report written to /tmp/compat-scout-demo-&lt;timestamp&gt;</p><p>Found 6 compatibility signals.</p><p class="warn">[Permission] ACCESS FINE LOCATION permission changed</p><p class="fault">[Missing component] wireless bridge is no longer installed</p><p><span>$</span> cat /tmp/compat-scout-demo-&lt;timestamp&gt;/compat-report.json</p></div>`;

const home = () => shell(`
<section class="hero"><div class="hero-copy"><p class="eyebrow">LOCAL COMPATIBILITY INSPECTION / 01</p><h1>Find what broke your Android setup</h1><p class="lede">For owners of customized Android phones and vehicle dongles after an update, it turns device facts into a clear report.</p><div class="hero-actions"><a class="button primary" href="/?demo=1" data-route>Try it with sample data</a><span>See a sample upgrade report first.</span></div><ul class="facts"><li>Runs on your computer</li><li>Leaves out serials and Wi-Fi names</li><li>Release downloads include checksums</li></ul></div><figure class="hero-art"><img src="${hero}" width="1536" height="1024" fetchpriority="high" alt="Blueprint illustration of a phone, USB cable, and vehicle dongle used for compatibility inspection."><figcaption>The report lists each changed Android setting and app requirement.</figcaption></figure></section>
<section class="live-sheet" aria-labelledby="report-title"><div><p class="eyebrow">SAMPLE REPORT / ANDROID 14 → 15</p><h2 id="report-title">Sort changes by what to check</h2><p>A report marks the update, permission, connection, and missing app separately.</p></div>${terminal}</section>
<section class="method" aria-labelledby="how-title"><p class="eyebrow">WORKFLOW / 02</p><h2 id="how-title">Compare Android setup snapshots</h2><ol><li><strong>Capture a snapshot.</strong><span>Connect your phone and accept its USB-debugging prompt.</span></li><li><strong>Declare the setup.</strong><span>List the local app, permissions, and device roles it needs.</span></li><li><strong>Compare after changes.</strong><span>Save a report that names each meaningful difference.</span></li></ol></section>
<section class="boundary"><h2>It reports facts. It does not change your phone.</h2><p>Compat Scout never roots a device, bypasses Android Auto restrictions, changes installed apps, or encourages driving interaction.</p><p>Snapshots omit serial numbers, Wi-Fi names, and MAC addresses. Keep reports where you trust them.</p></section>
<section id="install" class="install" aria-labelledby="install-title"><div><p class="eyebrow">INSTALL / 03</p><h2 id="install-title">Install the command-line tool</h2><p>Install a verified release, then run the bundled sample from any folder.</p></div><div><pre tabindex="0"><code>curl -fsSL https://android-compat-scout.sociobot.in/install.sh | sh
compat-scout demo</code></pre><p><a id="platform-download" href="https://github.com/B-Divyesh/sf-android-compat-scout/releases/latest">Download for this computer</a> · <a href="/install.sh">Linux / macOS installer</a> · <a href="/install.ps1">Windows installer</a> · <a href="https://github.com/B-Divyesh/sf-android-compat-scout/releases" target="_blank" rel="noreferrer">Release page (opens GitHub)</a></p></div></section>`);

const demo = () => shell(`<aside class="demo-banner"><strong>Demo — sample data, nothing is saved</strong><button id="reset-demo">Reset demo</button><a href="/" data-route>Start for real</a></aside><section class="demo-page"><p class="eyebrow">SANDBOX / SAMPLE UPGRADE</p><h1>See an Android upgrade report</h1><p class="lede">This sample compares an invented Android 14 setup with its Android 15 snapshot.</p><div class="demo-grid"><article><h2>Changes to check</h2><ul class="findings"><li><b>OS version</b><span>Android changed from 14 to 15</span><em>Check app support notes.</em></li><li class="blocking"><b>Permission</b><span>ACCESS FINE LOCATION changed</span><em>Review the trusted app's permission page.</em></li><li class="blocking"><b>Missing component</b><span>Wireless bridge is no longer installed</span><em>Restore it from a trusted backup.</em></li></ul></article>${terminal}</div><h2>Run the same bundled demo</h2><pre tabindex="0"><code>compat-scout demo
# writes compat-report.json in a temporary folder</code></pre></section>`);

const legal = (kind: 'privacy' | 'terms') => shell(kind === 'privacy'
  ? `<section class="legal"><h1>Privacy for Android Compat Scout</h1><h2>Before you collect a snapshot</h2><p>Enable USB debugging and approve the phone prompt before the command-line tool reads device facts.</p><h2>What a snapshot omits</h2><p>Exports exclude serial numbers, Wi-Fi names, and MAC addresses.</p></section>`
  : `<section class="legal"><h1>Terms for Android Compat Scout</h1><h2>Use it for diagnosis</h2><p>Compat Scout compares information you are allowed to inspect. It does not root devices, bypass restrictions, or modify apps.</p><h2>Keep safe</h2><p>Do not use the tool while driving. Follow local laws and only connect devices you own or manage.</p></section>`);

const notFound = () => shell(`<section class="not-found"><p class="eyebrow">SHEET NOT FOUND</p><h1>This inspection page is missing</h1><p>Return to the Compat Scout overview to inspect a sample report.</p><a class="button primary" href="/" data-route>Go to overview</a></section>`);

function route(): Route {
  const path = location.pathname.replace(/\/$/, '') || '/';
  return path === '/demo' || new URLSearchParams(location.search).get('demo') === '1'
    ? 'demo'
    : path === '/' ? 'home' : path === '/privacy' ? 'privacy' : path === '/terms' ? 'terms' : 'not-found';
}

function setMetadata(current: Route) {
  const metadata = pageMetadata[current];
  document.title = metadata.title;
  const canonical = `${siteUrl}${metadata.path}`;
  const put = (selector: string, value: string) => document.querySelector<HTMLMetaElement | HTMLLinkElement>(selector)?.setAttribute(selector.startsWith('link') ? 'href' : 'content', value);
  put('meta[name="description"]', metadata.description);
  put('link[rel="canonical"]', canonical);
  put('meta[property="og:title"]', metadata.title);
  put('meta[property="og:description"]', metadata.description);
  put('meta[name="twitter:title"]', metadata.title);
  put('meta[name="twitter:description"]', metadata.description);
}

function render() {
  const current = route();
  app.innerHTML = current === 'home' ? home() : current === 'demo' ? demo() : current === 'privacy' ? legal('privacy') : current === 'terms' ? legal('terms') : notFound();
  setMetadata(current);
  document.querySelector('.route-note')!.textContent = document.title;
  const heading = document.querySelector<HTMLElement>('h1');
  heading?.setAttribute('tabindex', '-1');
  bind();
  requestAnimationFrame(() => heading?.focus({ preventScroll: true }));
}

function bind() {
  document.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    history.pushState({}, '', link.href);
    render();
  }));
  document.querySelector('#reset-demo')?.addEventListener('click', () => {
    sessionStorage.removeItem('demo:compat-scout');
    render();
  });
  const download = document.querySelector<HTMLAnchorElement>('#platform-download');
  if (download) {
    const asset = navigator.userAgent.includes('Windows')
      ? 'compat-scout-x86_64-pc-windows-msvc.zip'
      : /Macintosh|Mac OS/.test(navigator.userAgent)
        ? 'compat-scout-aarch64-apple-darwin.tar.gz'
        : 'compat-scout-x86_64-unknown-linux-musl.tar.gz';
    download.href = `https://github.com/B-Divyesh/sf-android-compat-scout/releases/latest/download/${asset}`;
  }
}

addEventListener('popstate', render);
render();
