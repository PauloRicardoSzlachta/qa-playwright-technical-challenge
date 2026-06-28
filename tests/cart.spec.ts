/**
 * Suíte de Testes: Item 3.4 - Carrinho de Compras
 * Responsabilidade: Validar fluxos de adição, edição, remoção e persistência de itens em ambiente SPA.
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test.describe('Item 3.4 - Carrinho de Compras', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    await homePage.navegar();
  });

  test('Adicionar um produto ao carrinho e validar nome e preço', async () => {
    await homePage.productCards.first().click();
    
    // Captura dados na origem para evitar valores hardcoded e garantir integridade da validação.
    const nomeEsperado = await productPage.productName.innerText();
    const precoTexto = await productPage.page.locator('[data-test="unit-price"]').innerText();
    const precoEsperado = precoTexto.replace(/[^0-9.]/g, '');
    
    await productPage.adicionarAoCarrinho('1');
    await cartPage.navegar();
    await cartPage.aguardarHidratacao();

    // Localiza a linha via conteúdo para maior resiliência contra mudanças de ordem na tabela.
    const row = cartPage.cartRows.filter({ hasText: nomeEsperado }).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    
    const precoNoCarrinho = await row.locator('[data-test="product-price"]').first().innerText();
    expect(precoNoCarrinho).toContain(precoEsperado);
  });

  test('Adicionar múltiplos produtos e validar listagem', async () => {
    await homePage.productCards.nth(0).click();
    await productPage.adicionarAoCarrinho('1');
    await homePage.navegar();
    
    await homePage.productCards.nth(1).click();
    await productPage.adicionarAoCarrinho('1');

    await cartPage.navegar();
    // Sincronismo cirúrgico: aguarda a hidratação da tabela para evitar falsos negativos na contagem.
    await cartPage.aguardarHidratacao(); 
    
    await expect(cartPage.cartRows).toHaveCount(2);
    await expect(cartPage.totalPrice).toBeVisible({ timeout: 5000 });
  });

  test('Alterar quantidade e validar recálculo do subtotal', async () => {
    await homePage.productCards.first().click();
    await productPage.adicionarAoCarrinho('1');
    await cartPage.navegar();

    const precoUnitario = await cartPage.obterSubtotal(0);
    await cartPage.alterarQuantidade(0, '3');
    
    // Polling estratégico: aguarda a propagação do recálculo no estado da SPA.
    await expect(async () => {
      const novoSubtotal = await cartPage.obterSubtotal(0);
      expect(novoSubtotal).not.toBe(precoUnitario);
    }).toPass();
  });

  test('Remover produto e validar atualização do total', async () => {
    await homePage.productCards.first().click();
    await productPage.adicionarAoCarrinho('1');
    await cartPage.navegar();
    
    await cartPage.removerProduto(0);
    await expect(cartPage.cartRows).toHaveCount(0);
  });

  test('Validar que o carrinho persiste após navegar', async ({ page }) => {
    await homePage.productCards.first().click();
    await productPage.adicionarAoCarrinho('1');
    
    // Valida a persistência do Session State após navegação entre rotas da SPA.
    await page.goto('/contact');
    await cartPage.navegar();
    
    await expect(cartPage.cartRows).toHaveCount(1);
  });
});