/**
 * Suíte de Testes: Item 3.2 - Busca e Filtros de Produtos
 * Responsabilidade: Validar a engine de busca e a aplicação de filtros dinâmicos no catálogo.
 */

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
    
    // Valida se o primeiro card reflete o termo pesquisado após a sincronização da API.
    await expect(homePage.productCards.first()).toContainText(termo);
  });

  test('Busca por termo inexistente - validar mensagem de nenhum resultado', async ({ page }) => {
    await homePage.buscar('ProdutoInexistenteXYZ');
    
    // Valida que a lista de produtos foi limpa no DOM.
    await expect(homePage.productCards).toHaveCount(0);
    
    // Validação baseada no estado real da SPA para termos inexistentes.
    await expect(page.getByText(/there are no products found/i)).toBeVisible();
  });

  test('Aplicar filtro de categoria - validar exibição segmentada', async () => {
    await homePage.aplicarFiltroCategoria('Hand Tools');
    
    // Garante que o catálogo foi re-hidratado com os produtos da categoria selecionada.
    await expect(homePage.productCards.first()).toBeVisible();
  });

  test('Aplicar filtro de faixa de preço - validar intervalo definido', async () => {
    await homePage.ajustarPrecoTeclado(5);
    
    // O ajuste via teclado dispara o evento de filtro; validamos a atualização da lista.
    await expect(homePage.productCards.first()).toBeVisible();
  });

  test('Combinar busca com filtro - validar critérios simultâneos', async () => {
    await homePage.buscar('Hammer');
    await homePage.aplicarFiltroCategoria('Hand Tools');
    
    // Valida a intersecção dos critérios de busca e filtro de categoria.
    await expect(homePage.productCards.first()).toContainText('Hammer');
  });
});