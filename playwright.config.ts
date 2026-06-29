import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

/**
 * Carrega variáveis de ambiente do arquivo .env
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',  
  timeout: 90000,

  expect: {
     timeout: 90000,
  },  

  use: {
    /* Utiliza a URL definida no .env */
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    actionTimeout: 90000,
    navigationTimeout: 90000,    
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});