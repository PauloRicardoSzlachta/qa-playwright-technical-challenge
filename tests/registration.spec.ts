import { test, expect } from '@playwright/test';
import { RegistrationPage, RegistrationUser } from '../pages/RegistrationPage';
import { faker } from '@faker-js/faker';

/**
 * Gera uma senha aleatória que atenda aos requisitos de complexidade do sistema.
 */
function gerarSenhaSegura(): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const senhaBase = Array.from({ length: 12 }, () => caracteres[Math.floor(Math.random() * caracteres.length)]);
  return senhaBase.join('') + '1aA!';
}

test.describe('Fluxo de Registro de Usuário', () => {
  let registrationPage: RegistrationPage;

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
    await registrationPage.navegar();
  });

  test('Deve realizar o cadastro de um novo usuário com sucesso', async ({ page }) => {
    // Sênior: Chamada do método renomeado para 'registrar' conforme o Page Object
    await registrationPage.registrar(usuarioParaTeste);
    
    // Valida o redirecionamento para a tela de login após sucesso
    await expect(page).toHaveURL(/.*login/);
  });
});