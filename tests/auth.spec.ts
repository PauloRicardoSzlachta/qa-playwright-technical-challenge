import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Autenticação - Cenários de Exceção', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Deve exibir erro ao tentar login com e-mail em formato inválido', async () => {
    await loginPage.login('email_sem_arroba', 'senha123');
    // Verifica se algum alerta de erro aparece na tela
    const error = loginPage.errorMessage.first();
    await expect(error).toBeVisible({ timeout: 7000 });
  });

  test('Deve exibir erro ao tentar login com senha incorreta', async () => {
    await loginPage.login('customer@practicesoftwaretesting.com', 'senha_errada');
    const error = loginPage.errorMessage.first();
    
    await expect(error).toBeVisible({ timeout: 7000 });
    
    // Aceita a mensagem de erro de credenciais ou de conta bloqueada
    await expect(error).toContainText(/Invalid email or password|Account locked/);
  });
});