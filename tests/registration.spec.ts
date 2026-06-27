import { test, expect } from '@playwright/test';
import { RegistrationPage, RegistrationUser } from '../pages/RegistrationPage';
import { faker } from '@faker-js/faker';

/**
 * Função utilitária para gerar senhas que atendam aos requisitos de complexidade
 * e evitem bloqueios por bases de dados de vazamentos comuns.
 */
function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const randomArray = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]);
  return randomArray.join('') + '1aA!';
}

test.describe('Fluxo de Registro de Usuário', () => {
  let registrationPage: RegistrationPage;

  const userData: RegistrationUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dob: '1990-01-01',
    address: faker.location.street(),
    houseNumber: faker.number.int({ min: 1, max: 99 }).toString(),
    postcode: faker.location.zipCode('#####'),
    city: faker.location.city(),
    state: faker.location.state(),
    country: 'US',
    phone: faker.string.numeric(10), // Apenas números para evitar erro de máscara
    email: faker.internet.email(),
    password: generateSecurePassword()
  };

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();
  });

  test('Deve realizar o cadastro de um novo usuário com sucesso', async ({ page }) => {
    await registrationPage.register(userData);
    
    // Valida o redirecionamento para a tela de login após sucesso
    await expect(page).toHaveURL(/.*login/);
  });
});