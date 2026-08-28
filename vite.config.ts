import { defineConfig } from 'vite';
export default defineConfig({ root: 'site', publicDir: 'public', build: { outDir: '../dist/site', emptyOutDir: true, target: 'es2022' }, test: { environment: 'node', include: ['src/**/*.test.ts'] } });
