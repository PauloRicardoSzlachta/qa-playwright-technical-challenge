/**
 * Suíte de Testes: Item 3.4 - Registro de Usuário
 * Responsabilidade: Validar o fluxo de criação de conta e persistência de novos registros.
 */

import { test, expect } from '@playwright/test';
import { RegistrationPage, RegistrationUser } from '../pages/RegistrationPage';
import { faker } from '@faker-js/faker';
import { gerarSenhaSegura } from '../utils/auth-helpers';

test.describe('Fluxo de Registro de Usuário', () => {
  let registrationPage: RegistrationPage;

  // Massa de dados dinâmica via Faker para garantir isolamento total entre execuções de teste.
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
    // A lógica de preenchimento e sincronismo de eventos da SPA está encapsulada no Page Object.
    await registrationPage.registrar(usuarioParaTeste);
    
    // Valida o redirecionamento para a tela de login, confirmando a persistência no backend.
    await expect(page).toHaveURL(/.*login/);
  });
});