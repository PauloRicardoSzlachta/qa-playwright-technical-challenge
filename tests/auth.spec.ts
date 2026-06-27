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

test.describe('Item 3.1 - Autenticação e Segurança de Sessão', () => {
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

  test('Login com credenciais válidas - validar redirecionamento e estado autenticado', async ({ page }) => {
    await registrationPage.navegar();
    await registrationPage.registrar(usuarioParaTeste);
    await page.waitForTimeout(2000);

    await loginPage.navegar();
    await loginPage.login(usuarioParaTeste.email, usuarioParaTeste.password);

    await expect(page).toHaveURL(/.*account/);
    await expect(page.locator('h1')).toContainText('My account');
  });

  test('Login com e-mail inválido - validar mensagem de erro', async ({ page }) => {
    await loginPage.navegar();
    await loginPage.login('email_inexistente@teste.com', 'Senha123!');
    
    await expect(loginPage.alertaErro).toBeVisible();
    await expect(loginPage.alertaErro).toContainText('Invalid email or password');
  });

  test('Login com senha incorreta - validar mensagem e bloqueio de redirecionamento', async ({ page }) => {
    await loginPage.navegar();
    await loginPage.login('admin@practicesoftwaretesting.com', 'senha_errada');
    
    await expect(loginPage.alertaErro).toBeVisible();
    await expect(page).not.toHaveURL(/.*account/);
  });

  test('Tentativa de acesso a página restrita sem autenticação - validar redirecionamento', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/.*login/);
  });

  test('Logout - validar encerramento de sessão e bloqueio de acesso posterior', async ({ page }) => {
    await registrationPage.navegar();
    await registrationPage.registrar(usuarioParaTeste);
    await page.waitForTimeout(2000);

    await loginPage.navegar();
    await loginPage.login(usuarioParaTeste.email, usuarioParaTeste.password);
    await expect(page).toHaveURL(/.*account/);

    // Sincronização: Aguarda o menu estar pronto para interação
    const menuUsuario = page.locator('[data-test="nav-menu"]');
    await menuUsuario.click();
    
    const botaoSair = page.locator('[data-test="nav-sign-out"]');
    await expect(botaoSair).toBeVisible();
    await botaoSair.click();

    // Valida o redirecionamento para a página de login
    await expect(page).toHaveURL(/.*login/);

    // Valida que o acesso direto à rota protegida é bloqueado após o logout
    await page.goto('/account');
    await expect(page).toHaveURL(/.*login/);
  });
});