import { test, expect } from '../fixtures/auth-fixture';
import { ContactPage } from '../pages/ContactPage';
import { faker } from '@faker-js/faker';

/**
 * Suíte de Testes: Item 3.6 - Formulário de Contato
 * Valida o envio de mensagens e as regras de obrigatoriedade de campos.
 */
test.describe('Item 3.6 - Formulário de Contato', () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.navegar();
  });

  /**
   * Valida o caminho feliz com dados dinâmicos.
   * Aguarda a estabilização da SPA após o clique para validar a mensagem de sucesso.
   */
  test('Envio com todos os campos preenchidos corretamente — validar mensagem de sucesso', async () => {
    await contactPage.preencherFormulario({
      first: faker.person.firstName(),
      last: faker.person.lastName(),
      email: faker.internet.email(),
      subject: 'Customer service',
      message: faker.lorem.paragraph()
    });

    await contactPage.submitButton.click();

    // Sincronismo: A SPA exibe o alerta de sucesso após o processamento do backend.
    await expect(contactPage.successMessage).toBeVisible();
    await expect(contactPage.successMessage).toContainText('Thanks for your message! We will contact you shortly.');
  });

//   /**
//    * Valida a interceptação de formatos inválidos de e-mail pela SPA.
//    */
  test('Envio com campo de e-mail em formato inválido — validar mensagem de erro de formato', async ({ page }) => {
    await contactPage.preencherFormulario({
      first: faker.person.firstName(),
      last: faker.person.lastName(),
      email: 'formato_invalido',
      subject: 'Webmaster',
      message: faker.lorem.paragraph()
    });

    await contactPage.submitButton.click();

    // Valida a mensagem de erro específica para o formato de e-mail.
    await expect(page.locator('.alert-danger')).toContainText('Email format is invalid');
  });

//   /**
//    * Valida a obrigatoriedade dos campos disparando a validação via submissão vazia.
//    */
  test('Envio com campos obrigatórios em branco — validar que cada campo exibe sua respectiva mensagem de erro', async ({ page }) => {
    await contactPage.submitButton.click();

    // O Playwright realiza retentativas automáticas para cobrir a latência na renderização dos erros.
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Last name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Subject is required')).toBeVisible();
    await expect(page.getByText('Message is required')).toBeVisible();
  });
});

