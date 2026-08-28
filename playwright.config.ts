import { defineConfig } from 'playwright/test';

export default defineConfig({
  testDir: './site/e2e',
  use: { baseURL: 'http://127.0.0.1:4174' },
  webServer: {
    command: 'npm run build:site && npx vite preview site --host 127.0.0.1 --port 4174 --strictPort --outDir ../dist/site',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
  },
});
