import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model da página de contato.
 * Gerencia os seletores dos campos bipartidos (First/Last Name) e o dropdown de assunto,
 * garantindo resiliência contra a renderização assíncrona dos componentes da SPA.
 */
export class ContactPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectSelect: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.subjectSelect = page.locator('[data-test="subject"]');
    this.messageTextarea = page.locator('[data-test="message"]');
    this.submitButton = page.locator('[data-test="contact-submit"]');
    // A mensagem de sucesso é renderizada dinamicamente após a resposta da API.
    this.successMessage = page.locator('.alert-success');
  }

  /**
   * Navega para a rota de contato e aguarda a hidratação do formulário.
   */
  async navegar() {
    await this.page.goto('/contact');
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  /**
   * Preenche o formulário utilizando a estratégia de TAB para garantir que
   * os eventos de validação da SPA sejam disparados corretamente.
   */
  async preencherFormulario(dados: {
    first: string;
    last: string;
    email: string;
    subject: string;
    message: string;
  }) {
    await this.firstNameInput.fill(dados.first);
    await this.lastNameInput.fill(dados.last);
    await this.emailInput.fill(dados.email);
    await this.subjectSelect.selectOption({ label: dados.subject });
    await this.messageTextarea.fill(dados.message);
  }
}