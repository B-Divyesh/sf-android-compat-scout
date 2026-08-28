import './style.css';
import './overrides.css';
import hero from './assets/blueprint-hero.webp';

type Route = 'home' | 'demo' | 'privacy' | 'terms' | 'not-found';
const app = document.querySelector<HTMLDivElement>('#app')!;

const shell = (content: string) => `
<header class="topbar"><a class="wordmark" href="/" data-route>ANDROID<br><strong>COMPAT SCOUT</strong></a><nav aria-label="Main navigation"><a href="/demo" data-route>Demo</a><a href="/#install">Install</a><a href="/privacy" data-route>Privacy</a></nav></header>
<div class="route-note" aria-live="polite"></div><main id="main" tabindex="-1">${content}</main>
<footer><p>Private evidence for Android setup changes.</p><p><a href="/privacy" data-route>Privacy</a> · <a href="/terms" data-route>Terms</a> · Built by Param Factory · v0.1.1</p></footer>`;

const terminal = `<div class="terminal" aria-label="Terminal recording of the sample report"><p><span>$</span> compat-scout demo</p><p>Demo report written to /tmp/compat-scout-demo</p><p>Found 6 compatibility signals.</p><p class="warn">[Permission] ACCESS FINE LOCATION permission changed</p><p class="fault">[Missing component] wireless bridge is no longer installed</p><p><span>$</span> cat /tmp/compat-scout-demo/compat-report.json</p></div>`;

const home = () => shell(`
<section class="hero"><div class="hero-copy"><p class="eyebrow">LOCAL COMPATIBILITY INSPECTION / 01</p><h1>Find what broke your Android setup</h1><p class="lede">For custom-phone and dongle owners after an update, it turns scattered device facts into a clear report.</p><div class="hero-actions"><a class="button primary" href="/demo" data-route>Try it with sample data</a><span>See a private upgrade report first.</span></div><ul class="facts"><li>Runs on your computer</li><li>Leaves out serials and Wi-Fi names</li><li>Release downloads include checksums</li></ul></div><figure class="hero-art"><img src="${hero}" width="1536" height="1024" fetchpriority="high" alt="Blueprint illustration of a phone, USB cable, and vehicle dongle used for compatibility inspection."><figcaption>Trace the change. Keep the evidence.</figcaption></figure></section>
<section class="live-sheet" aria-labelledby="report-title"><div><p class="eyebrow">SAMPLE REPORT / ANDROID 14 → 15</p><h2 id="report-title">Sort changes by what to check</h2><p>A report marks the update, permission, connection, and missing app separately.</p></div>${terminal}</section>
<section class="method" aria-labelledby="how-title"><p class="eyebrow">WORKFLOW / 02</p><h2 id="how-title">Take evidence before guessing</h2><ol><li><strong>Capture a snapshot.</strong><span>Connect your phone and accept its USB-debugging prompt.</span></li><li><strong>Declare the setup.</strong><span>List the local app, permissions, and device roles it needs.</span></li><li><strong>Compare after changes.</strong><span>Save a report that names each meaningful difference.</span></li></ol></section>
<section class="boundary"><h2>It reports facts. It does not change your phone.</h2><p>Compat Scout never roots a device, bypasses Android Auto restrictions, changes installed apps, or encourages driving interaction.</p><p>Snapshots omit serial numbers, Wi-Fi names, and MAC addresses. Keep reports where you trust them.</p></section>
<section id="install" class="install" aria-labelledby="install-title"><div><p class="eyebrow">INSTALL / 03</p><h2 id="install-title">Install the command-line tool</h2><p>Download a release for your computer, then run the bundled sample.</p></div><div><pre tabindex="0"><code>cargo install --path .
compat-scout snapshot --out before.json
compat-scout compare before.json after.json</code></pre><p><a id="platform-download" href="https://github.com/B-Divyesh/sf-android-compat-scout/releases/latest">Download for this computer</a> · <a href="/install.sh">Linux / macOS installer</a> · <a href="/install.ps1">Windows installer</a> · <a href="https://github.com/B-Divyesh/sf-android-compat-scout/releases" target="_blank" rel="noreferrer">Release page</a></p></div></section>`);

const demo = () => shell(`<aside class="demo-banner"><strong>Demo — sample data, nothing is saved</strong><button id="reset-demo">Reset demo</button><a href="/">Start for real</a></aside><section class="demo-page"><p class="eyebrow">SANDBOX / SAMPLE UPGRADE</p><h1>See an Android upgrade report</h1><p class="lede">This sample compares an invented Android 14 setup with its Android 15 snapshot.</p><div class="demo-grid"><article><h2>Compatibility signals</h2><ul class="findings"><li><b>OS version</b><span>Android changed from 14 to 15</span><em>Check app support notes.</em></li><li class="blocking"><b>Permission</b><span>ACCESS FINE LOCATION changed</span><em>Review the trusted app's permission page.</em></li><li class="blocking"><b>Missing component</b><span>Wireless bridge is no longer installed</span><em>Restore it from a trusted backup.</em></li></ul></article>${terminal}</div><h2>Run the same bundled demo</h2><pre tabindex="0"><code>compat-scout demo
# writes compat-report.json in a temporary folder</code></pre></section>`);

const legal = (kind: 'privacy' | 'terms') => shell(kind === 'privacy'
  ? `<section class="legal"><h1>Privacy for Android Compat Scout</h1><h2>Your snapshots stay on your computer</h2><p>The command-line tool reads device facts only after you enable USB debugging and approve the phone prompt.</p><h2>What a snapshot omits</h2><p>Exports exclude serial numbers, Wi-Fi names, and MAC addresses. You choose where report files are stored.</p></section>`
  : `<section class="legal"><h1>Terms for Android Compat Scout</h1><h2>Use it for diagnosis</h2><p>Compat Scout compares information you are allowed to inspect. It does not root devices, bypass restrictions, or modify apps.</p><h2>Keep safe</h2><p>Do not use the tool while driving. Follow local laws and only connect devices you own or manage.</p></section>`);

const notFound = () => shell(`<section class="not-found"><p class="eyebrow">SHEET NOT FOUND</p><h1>This inspection page is missing</h1><p>Return to the Compat Scout overview to inspect a sample report.</p><a class="button primary" href="/" data-route>Go to overview</a></section>`);

function route(): Route {
  const path = location.pathname.replace(/\/$/, '') || '/';
  return path === '/' ? 'home' : path === '/demo' ? 'demo' : path === '/privacy' ? 'privacy' : path === '/terms' ? 'terms' : 'not-found';
}

function render() {
  const current = route();
  app.innerHTML = current === 'home' ? home() : current === 'demo' ? demo() : current === 'privacy' ? legal('privacy') : current === 'terms' ? legal('terms') : notFound();
  const titles: Record<Route, string> = { home: 'Android Compat Scout — Find Android setup regressions', demo: 'Demo — Android Compat Scout', privacy: 'Privacy — Android Compat Scout', terms: 'Terms — Android Compat Scout', 'not-found': 'Page not found — Android Compat Scout' };
  document.title = titles[current];
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
