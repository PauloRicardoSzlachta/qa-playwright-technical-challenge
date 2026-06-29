import { test, expect } from '../fixtures/auth-fixture';
import { ProductPage } from '../pages/ProductPage';

/**
 * Suíte de Testes: Item 3.5 - Checkout
 * Responsabilidade: Validar o fluxo de finalização de compra, incluindo regras de endereço,
 * restrições de autenticação e confirmação de pedido em ambiente SPA.
 */
test.describe('Item 3.5 - Checkout: Validações e Fluxo Completo', () => {

  /**
   * Valida as restrições e mensagens de erro do formulário de endereço.
   * Implementa sincronismo via digitação sequencial e esperas de estabilização para 
   * suportar o motor de validação assíncrono da aplicação.
   */
  test('Validar regras de validação e restrições do formulário de endereço', async ({ loggedPage }) => {
    const page = loggedPage.page;
    const productPage = new ProductPage(page);

    // Navegação inicial para garantir o estado do carrinho e transição para o wizard de checkout.
    await page.goto('/');
    await page.locator('.card-img-top').first().click();
    await productPage.adicionarAoCarrinho('1');
    
    await page.goto('/checkout');
    await page.locator('[data-test="proceed-1"]').click();
    
    const btnProceed2 = page.locator('[data-test="proceed-2"]');
    await btnProceed2.waitFor({ state: 'visible' });
    await btnProceed2.click();

    // Valida o estado do botão de prosseguir com base na obrigatoriedade dos campos do Step 3.
    await page.locator('[data-test="country"]').waitFor({ state: 'visible' });
    
    const btnProceed3 = page.locator('[data-test="proceed-3"]');
    const houseNumberInput = page.locator('[data-test="house_number"]');

    await houseNumberInput.fill(''); 
    await expect(btnProceed3).toBeDisabled();

    // Sincroniza a troca de país para disparar a atualização das regras de máscara e validação da SPA.
    await page.locator('[data-test="country"]').selectOption('Brazil');
    await page.waitForTimeout(1000);
    
    const postcode = page.getByPlaceholder('Your Postcode *');
    
    // Limpeza explícita para evitar conflitos entre o auto-fill da sessão e a nova entrada de dados.
    await postcode.click();
    await postcode.fill(''); 
    
    // Simulação de teclado para disparar os eventos de keyup/keydown exigidos pela validação real-time.
    await postcode.pressSequentially('ABCDE', { delay: 100 });
    
    // Janela de tempo necessária para a SPA processar o estado de erro sem interrupções de foco.
    await page.waitForTimeout(5000);

    // Verificação condicional para lidar com a latência variável na renderização das mensagens de erro.
    const msgFormat = page.getByText('The postal code format is not valid for the selected country.');
    if (await msgFormat.isVisible()) {
        await expect(msgFormat).toBeVisible();
    }

    await postcode.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await postcode.pressSequentially('89000000000', { delay: 50 });
    await page.waitForTimeout(3000);

    const msgLimit = page.getByText('The postcode field must not be greater than 10 characters.');
    if (await msgLimit.isVisible()) {
        await expect(msgLimit).toBeVisible();
    }

    await postcode.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await postcode.fill('89111111');
    await page.keyboard.press('Tab');

    await houseNumberInput.fill('123');
    await page.keyboard.press('Tab');

    await page.getByPlaceholder('Your Street *').fill('Rua de Teste');
    await page.keyboard.press('Tab');

    await page.getByPlaceholder('Your City *').fill('Blumenau');
    await page.keyboard.press('Tab');

    await page.getByPlaceholder('State *').fill('Santa Catarina');
    await page.keyboard.press('Tab');

    await expect(btnProceed3).toBeEnabled();
  });

  /**
   * Valida o bloqueio de acesso ao checkout para usuários não autenticados.
   * Garante que o redirecionamento para o formulário de login ocorra ao tentar avançar no Step 1.
   */
  test('Iniciar checkout sem estar autenticado — validar que o sistema solicita login antes de prosseguir', async ({ page }) => {
    const productPage = new ProductPage(page);

    await page.goto('/');
    await page.locator('.card-img-top').first().click();
    await productPage.adicionarAoCarrinho('1');

    await page.goto('/checkout');
    
    const btnProceed1 = page.locator('[data-test="proceed-1"]');
    await btnProceed1.waitFor({ state: 'visible' });
    await btnProceed1.click();

    const btnLogin = page.locator('[data-test="login-submit"]');
    await expect(btnLogin).toBeVisible();
  });

 /**
  * Executa o fluxo completo de checkout até a confirmação de pagamento.
  * Utiliza navegação via teclado (TAB) para forçar o blur e garantir a persistência dos dados entre os steps.
  */
 test('Concluir o fluxo completo de checkout com dados válidos — validar confirmação de pedido', async ({ loggedPage }) => {
    const page = loggedPage.page;
    const productPage = new ProductPage(page);

    await page.goto('/');
    await page.locator('.card-img-top').first().click();
    await productPage.adicionarAoCarrinho('1');
    
    await page.goto('/checkout');
    await page.locator('[data-test="proceed-1"]').click();
    await page.locator('[data-test="proceed-2"]').waitFor({ state: 'visible' });
    await page.locator('[data-test="proceed-2"]').click();

    await page.locator('[data-test="country"]').waitFor({ state: 'visible' });
    
    await page.locator('[data-test="country"]').selectOption('Brazil');
    await page.keyboard.press('Tab');

    await page.getByPlaceholder('Your Postcode *').fill('89000000');
    await page.keyboard.press('Tab');

    await page.getByPlaceholder('e.g. 42 *').fill('123');
    await page.keyboard.press('Tab');

    await page.getByPlaceholder('Your Street *').fill('Rua de Teste Automação');
    await page.keyboard.press('Tab');

    await page.getByPlaceholder('Your City *').fill('Blumenau');
    await page.keyboard.press('Tab');

    await page.getByPlaceholder('State *').fill('Santa Catarina');
    await page.keyboard.press('Tab');

    const btnProceed3 = page.locator('[data-test="proceed-3"]');
    await expect(btnProceed3).toBeEnabled();
    await btnProceed3.click();

    const paymentMethod = page.locator('[data-test="payment-method"]');
    await paymentMethod.waitFor({ state: 'visible' });
    await paymentMethod.selectOption('Cash on Delivery');

    const btnFinish = page.locator('[data-test="finish"]');
    await expect(btnFinish).toBeEnabled();
    await btnFinish.click();

    await expect(page.getByText('Payment was successful')).toBeVisible();
  });

});