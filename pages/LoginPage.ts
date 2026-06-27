import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    // Usando o botão pelo texto para garantir o clique
    this.loginButton = page.getByRole('button', { name: 'Login' });
    // Seletor mais genérico para qualquer alerta de erro que apareça
    this.errorMessage = page.locator('.alert, [data-test="login-error"]');
  }

  async navigate() {
    // O Playwright usará a baseURL do config e navegará para o path relativo
    await this.page.goto('/auth/login');
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}