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
    
    // Seleciona o primeiro produto da lista para testar o detalhe
    await homePage.productCards.first().click();
    // Aguarda a carga da página de detalhes (URL contém /product/)
    await expect(page).toHaveURL(/.*product\/\d+/);
  });

  test('Validar exibição correta dos detalhes do produto', async () => {
    // Valida se os elementos básicos de informação estão visíveis e populados
    await expect(productPage.productName).not.toBeEmpty();
    await expect(productPage.productPrice).not.toBeEmpty();
    await expect(productPage.productDescription).not.toBeEmpty();
  });

  test('Validar botão de adicionar ao carrinho para produto em estoque', async () => {
    // No Toolshop, se o produto está visível e não tem aviso de "Out of stock", o botão deve estar habilitado
    await expect(productPage.addToCartButton).toBeEnabled();
  });

  test('Validar comportamento com quantidade inválida (0 ou negativa)', async () => {
    // Tenta adicionar 0 unidades
    await productPage.adicionarAoCarrinho('0');
    
    // Regra de negócio: O sistema não deve permitir ou deve exibir erro de validação
    // No Toolshop, geralmente o botão não dispara a ação ou limpa o campo
    await expect(productPage.quantityInput).toHaveValue('1'); // Exemplo de reset automático
  });
});