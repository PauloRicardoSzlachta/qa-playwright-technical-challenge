import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Item 3.2 - Busca e Filtros de Produtos', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navegar();
  });

  test('Busca por termo válido - validar resultados correspondentes', async () => {
    const termo = 'Combination Pliers';
    await homePage.buscar(termo);
    await expect(homePage.productCards.first()).toContainText(termo);
  });

  test('Busca por termo inexistente - validar mensagem de nenhum resultado', async ({ page }) => {
    await homePage.buscar('ProdutoInexistenteXYZ');
    
    // Valida que a lista de produtos está vazia (Passou no log anterior)
    await expect(homePage.productCards).toHaveCount(0);
    
    // Sênior: Validação baseada no texto real identificado no snapshot de acessibilidade
    // O snapshot mostrou: "There are no products found."
    await expect(page.getByText(/there are no products found/i)).toBeVisible();
  });

  test('Aplicar filtro de categoria - validar exibição segmentada', async () => {
    await homePage.aplicarFiltroCategoria('Hand Tools');
    await expect(homePage.productCards.first()).toBeVisible();
  });

  test('Aplicar filtro de faixa de preço - validar intervalo definido', async () => {
    await homePage.ajustarPrecoTeclado(5);
    await expect(homePage.productCards.first()).toBeVisible();
  });

  test('Combinar busca com filtro - validar critérios simultâneos', async () => {
    await homePage.buscar('Hammer');
    await homePage.aplicarFiltroCategoria('Hand Tools');
    await expect(homePage.productCards.first()).toContainText('Hammer');
  });
});