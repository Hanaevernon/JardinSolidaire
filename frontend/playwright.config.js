// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/testsE2E',
  timeout: 30000,
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
    video: 'off',
    screenshot: 'only-on-failure',
    baseURL: 'http://localhost:3000',
  },
});
