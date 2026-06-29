import { Page, Locator } from '@playwright/test';

export interface DadosEntrega {
  endereco: string; cidade: string; estado: string; pais: string; cep: string;
}

/**
 * Gerencia o wizard de checkout e as transições de estado da SPA.
 */
export class CheckoutPage {
  readonly page: Page;
  readonly btnStep1: Locator;
  readonly btnStep2: Locator;
  readonly btnStep3: Locator;
  readonly inputEndereco: Locator;
  readonly msgConfirmacao: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btnStep1 = page.locator('[data-test="proceed-1"]');
    this.btnStep2 = page.locator('[data-test="proceed-2"]');
    this.btnStep3 = page.locator('[data-test="proceed-3"]');
    this.inputEndereco = page.locator('#address');
    this.msgConfirmacao = page.locator('.help-block, [data-test="order-confirmation"]');
  }

  /**
   * Navega do carrinho até o formulário de endereço.
   * Trata o Step 2 de forma condicional para garantir a continuidade do fluxo 
   * caso a sessão exija re-autenticação durante a transição de estados.
   */
  async avancarParaEndereco(email: string, pass: string) {
    await this.btnStep1.click();
    
    // Verifica a necessidade de login no Step 2 com timeout reduzido para evitar bloqueios.
    const loginInput = this.page.locator('#email');
    if (await loginInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await loginInput.fill(email);
      await this.page.locator('#password').fill(pass);
      await this.page.locator('[data-test="login-submit"]').click();
    }

    // Aguarda a estabilização do botão de prosseguir após a validação da conta.
    await this.btnStep2.waitFor({ state: 'visible' });
    await this.btnStep2.click();
    
    // Garante que o formulário de endereço foi renderizado e está interativo.
    await this.inputEndereco.waitFor({ state: 'visible' });
  }

  /**
   * Realiza o preenchimento dos dados de entrega e valida a transição para o pagamento.
   */
  async preencherEntrega(dados: DadosEntrega) {
    await this.inputEndereco.fill(dados.endereco);
    await this.page.locator('#city').fill(dados.cidade);
    await this.page.locator('#state').fill(dados.estado);
    await this.page.locator('#country').fill(dados.pais);
    await this.page.locator('#postcode').fill(dados.cep);
    await this.btnStep3.click();
    
    // Sincroniza com a carga do componente de seleção de método de pagamento.
    await this.page.locator('#payment_method').waitFor({ state: 'visible' });
  }

  /**
   * Conclui o pedido e valida a exibição da mensagem de sucesso no DOM.
   */
  async concluirPedido(metodo: string) {
    await this.page.locator('#payment_method').selectOption({ label: metodo });
    await this.page.locator('[data-test="finish"]').click();
    
    // Confirma a transição final para a tela de sucesso do pedido.
    await this.msgConfirmacao.waitFor({ state: 'visible' });
  }
}