import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('input[data-test="login-submit"]');
  }

  async navegar() {
    await this.page.goto('/auth/login');
  }

  /**
   * Realiza o login no sistema.
   * Nota: Aguardamos o estado de 'networkidle' para garantir que os tokens
   * de autenticação e a sessão sejam processados antes das asserções.
   */
  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
    
    // Garante que a aplicação processou a resposta do servidor
    await this.page.waitForLoadState('networkidle');
  }
}