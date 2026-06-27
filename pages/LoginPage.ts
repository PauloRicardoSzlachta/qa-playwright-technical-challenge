import { Page, Locator } from '@playwright/test';

/**
 * Page Object responsável pela gestão das interações na tela de Login.
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly alertaErro: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('input[data-test="login-submit"]');
    // Localizador para mensagens de erro de autenticação (alertas do Bootstrap)
    this.alertaErro = page.locator('.alert-danger');
  }

  async navegar() {
    await this.page.goto('/auth/login');
  }

  /**
   * Realiza a tentativa de autenticação no sistema.
   */
  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}