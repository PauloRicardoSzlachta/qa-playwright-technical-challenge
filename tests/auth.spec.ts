import { test, expect } from '@playwright/test';
import { RegistrationPage, RegistrationUser } from '../pages/RegistrationPage';
import { LoginPage } from '../pages/LoginPage';
import { faker } from '@faker-js/faker';

/**
 * Função utilitária para geração de credenciais seguras.
 */
function gerarSenhaForte(): string {
  return faker.internet.password({ length: 12 }) + '1aA!';
}

test.describe('Fluxo de Autenticação', () => {
  let registrationPage: RegistrationPage;
  let loginPage: LoginPage;

  // Massa de dados persistida para o ciclo de vida deste bloco de testes
  const usuarioTeste: RegistrationUser = {
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
    password: gerarSenhaForte()
  };

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    loginPage = new LoginPage(page);
  });

  test('Deve realizar login com sucesso após o registro de um novo usuário', async ({ page }) => {
    // 1. Garante que o usuário existe através do registro
    await registrationPage.navigate();
    await registrationPage.register(usuarioTeste);
    
    // 2. Realiza o login com as credenciais recém-criadas
    await loginPage.navegar();
    await loginPage.login(usuarioTeste.email, usuarioTeste.password);

    // 3. Valida se o login foi bem-sucedido (ex: redirecionamento para o perfil ou home)
    await expect(page).toHaveURL(/.*account/);
    await expect(page.locator('h1')).toContainText('My account');
  });
});