import { Page, Locator } from '@playwright/test';

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

/**
 * Gerencia o formulário de registro de novos clientes e validações de cadastro.
 */
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

  async navegar() {
    await this.page.goto('/auth/register');
  }

  /**
   * Preenche o formulário utilizando interações de teclado para garantir o disparo
   * dos eventos de reatividade (blur/change) da SPA.
   */
  async registrar(user: RegistrationUser) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    
    // O uso de Tab é essencial para processar as máscaras e validações de data de nascimento.
    await this.dobInput.fill(user.dob);
    await this.page.keyboard.press('Tab');

    await this.countrySelect.selectOption(user.country);
    await this.page.keyboard.press('Tab');

    // Preenchimento via teclado com delay mitiga bloqueios de estado do framework durante a digitação.
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

    // Aguarda a transição de rota para confirmar a persistência do registro no backend.
    await this.page.waitForURL(/.*login/);
  }
}