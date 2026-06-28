/**
 * Suíte de Testes: Item 3.3 - Página de Detalhe do Produto
 * Responsabilidade: Validar a integridade das informações exibidas e o comportamento de adição ao carrinho.
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';

test.describe('Item 3.3 - Página de Detalhe do Produto', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    await homePage.navegar();
    
    // Seleciona o primeiro produto para garantir que o contexto do teste seja uma ProductPage válida.
    await homePage.productCards.first().click();
    
    // Sincronismo de rota: assegura que a transição da SPA foi concluída antes da execução dos steps.
    await expect(page).toHaveURL(/.*product\/\d+/);
  });

  test('Validar exibição correta dos detalhes do produto', async () => {
    // Valida se os elementos básicos de informação estão visíveis e devidamente populados via API.
    await expect(productPage.productName).not.toBeEmpty();
    await expect(productPage.productPrice).not.toBeEmpty();
    await expect(productPage.productDescription).not.toBeEmpty();
  });

  test('Validar botão de adicionar ao carrinho para produto em estoque', async () => {
    // Verifica se o estado do botão reflete a disponibilidade de estoque processada pela SPA.
    await expect(productPage.addToCartButton).toBeEnabled();
  });

  test('Validar comportamento com quantidade inválida (0 ou negativa)', async () => {
    // Teste de borda: valida a resiliência do campo contra inputs que violam a regra de negócio.
    await productPage.adicionarAoCarrinho('0');
    
    // No Toolshop, o sistema aplica um reset automático para '1' ao detectar valores inválidos.
    await expect(productPage.quantityInput).toHaveValue('1');
  });
});