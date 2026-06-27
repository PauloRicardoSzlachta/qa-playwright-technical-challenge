import { Page, Locator, expect } from '@playwright/test';

/**
 * Interface para definição do contrato de dados do usuário.
 * Centraliza a estrutura para facilitar a manutenção dos testes.
 */
export interface RegistrationUser {
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
  postcode: string;
  houseNumber: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
}

export class RegistrationPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dobInput: Locator;
  readonly countrySelect: Locator;
  readonly postcodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.dobInput = page.locator('#dob');
    this.countrySelect = page.locator('#country');
    this.postcodeInput = page.locator('#postcode');
    this.houseNumberInput = page.locator('#house_number');
    this.addressInput = page.locator('#street');
    this.cityInput = page.locator('#city');
    this.stateInput = page.locator('#state');
    this.phoneInput = page.locator('#phone');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.registerButton = page.locator('button[data-test="register-submit"]');
  }

  async navigate() {
    await this.page.goto('/auth/register');
  }

  /**
   * Realiza o fluxo completo de registro.
   * Nota: Utilizamos interações de teclado em campos específicos para garantir 
   * o disparo de eventos de validação e reatividade do framework da página.
   */
  async register(user: RegistrationUser) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    
    // Preenchimento da data seguido de Tab para garantir o processamento da validação
    await this.dobInput.fill(user.dob);
    await this.page.keyboard.press('Tab');

    // A seleção do país dispara a habilitação dos campos de endereço
    await this.countrySelect.selectOption(user.country);
    await this.page.keyboard.press('Tab');

    // Uso de digitação direta para contornar latências de renderização da SPA
    await this.page.keyboard.type(user.postcode, { delay: 50 });
    await this.page.keyboard.press('Tab');

    await this.page.keyboard.type(user.houseNumber, { delay: 50 });
    await this.page.keyboard.press('Tab');

    await this.page.keyboard.type(user.address, { delay: 50 });
    await this.page.keyboard.press('Tab');

    await this.page.keyboard.type(user.city, { delay: 50 });
    await this.page.keyboard.press('Tab');

    await this.page.keyboard.type(user.state, { delay: 50 });
    await this.page.keyboard.press('Tab');

    await this.phoneInput.fill(user.phone);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);

    await this.registerButton.click();
  }
}