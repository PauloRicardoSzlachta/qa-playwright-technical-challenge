import { test as base } from '@playwright/test';
import { RegistrationPage, RegistrationUser } from '../pages/RegistrationPage';
import { LoginPage } from '../pages/LoginPage';
import { gerarSenhaSegura } from '../utils/auth-helpers';
import { faker } from '@faker-js/faker';

/**
 * @file fixtures/auth-fixture.ts
 * @description Extensão do test do Playwright para garantir estado logado.
*/

type MyFixtures = {
  loggedPage: { page: any }; 
};

export const test = base.extend<MyFixtures>({
  loggedPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    const loginPage = new LoginPage(page);

    const usuario: RegistrationUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dob: '1990-01-01',
      address: faker.location.street(),
      houseNumber: '123',
      postcode: '12345',
      city: faker.location.city(),
      state: faker.location.state(),
      country: 'US',
      phone: faker.string.numeric(10),
      email: faker.internet.email(),
      password: gerarSenhaSegura()
    };

    // Executa o fluxo de garantia de estado (Setup) para prover contexto autenticado.
    await registrationPage.navegar();
    await registrationPage.registrar(usuario);
    await loginPage.navegar();
    await loginPage.login(usuario.email, usuario.password);

    // Valida a visibilidade do menu de navegação para confirmar que a SPA 
    // processou a sessão e renderizou o estado autenticado com sucesso.
    await page.locator('[data-test="nav-menu"]').waitFor({ state: 'visible' });

    await use({ page });
  },
});

export { expect } from '@playwright/test';