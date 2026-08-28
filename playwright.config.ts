import { defineConfig } from 'playwright/test';

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './site/e2e',
  use: { baseURL: externalBaseUrl ?? 'http://127.0.0.1:4174' },
  ...(externalBaseUrl ? {} : { webServer: {
    command: 'npm run build:site && npx vite preview site --host 127.0.0.1 --port 4174 --strictPort --outDir ../dist/site',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
  } }),
});
