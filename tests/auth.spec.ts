import { test, expect } from '@playwright/test';
import { RegistrationPage, RegistrationUser } from '../pages/RegistrationPage';
import { LoginPage } from '../pages/LoginPage';
import { faker } from '@faker-js/faker';

/**
 * Gera uma senha aleatória que atenda aos requisitos de complexidade do sistema.
 */
function gerarSenhaSegura(): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const senhaBase = Array.from({ length: 12 }, () => caracteres[Math.floor(Math.random() * caracteres.length)]);
  return senhaBase.join('') + '1aA!';
}

test.describe('Fluxo de Autenticação', () => {
  let registrationPage: RegistrationPage;
  let loginPage: LoginPage;

  const usuarioParaTeste: RegistrationUser = {
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

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    loginPage = new LoginPage(page);
  });

  test('Deve realizar login com sucesso após o registro de um novo usuário', async ({ page }) => {
    await registrationPage.navegar();
    
    // Sênior: Ajustado para 'registrar'
    await registrationPage.registrar(usuarioParaTeste);
    
    await page.waitForTimeout(2000);

    await loginPage.navegar();
    await loginPage.login(usuarioParaTeste.email, usuarioParaTeste.password);

    await expect(page).toHaveURL(/.*account/);
    await expect(page.locator('h1')).toContainText('My account');
  });
});