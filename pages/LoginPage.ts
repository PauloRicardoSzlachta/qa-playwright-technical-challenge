import { Page, Locator } from '@playwright/test';

/**
 * Gerencia os elementos e o fluxo de autenticação do sistema.
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
    // Localizador genérico para capturar diferentes falhas de autenticação (e-mail ou senha).
    this.alertaErro = page.locator('.alert-danger');
  }

  async navegar() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    
    // O submit dispara a validação de sessão; o sincronismo é tratado na asserção do teste.
    await this.loginButton.click();
  }
}