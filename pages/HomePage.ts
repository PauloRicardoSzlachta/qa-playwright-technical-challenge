import { Page, Locator, expect } from '@playwright/test';

/**
 * Gerencia a página inicial, catálogo de produtos e filtros globais.
 */
export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly noResultsMessage: Locator;
  readonly priceSliderMin: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.productCards = page.locator('.card');
    this.noResultsMessage = page.locator('[data-test="search-results-empty"]');
    this.priceSliderMin = page.locator('.ngx-slider-pointer-min');
  }

  async navegar() {
    await this.page.goto('/');
    // Sincroniza com o carregamento inicial do catálogo para evitar flakiness.
    await this.page.waitForResponse(res => res.url().includes('/products') && res.status() === 200);
  }

  async buscar(termo: string) {
    await this.searchInput.fill(termo);
    const responsePromise = this.page.waitForResponse(res => res.url().includes('/products/search') && res.status() === 200);
    await this.searchButton.click();
    await responsePromise; // Garante que a lista de resultados foi processada pelo backend.
  }

  async aplicarFiltroCategoria(nomeCategoria: string) {
    const checkbox = this.page.getByRole('checkbox', { name: nomeCategoria });
    // Sidebar de categorias pode renderizar de forma tardia na SPA.
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    const responsePromise = this.page.waitForResponse(res => res.url().includes('/products') && res.status() === 200);
    await checkbox.check();
    await responsePromise;
  }

  async ajustarPrecoTeclado(passos: number) {
    await this.priceSliderMin.focus();
    // Interação via teclado simula o comportamento real do usuário e garante o disparo dos eventos de filtro.
    for (let i = 0; i < passos; i++) {
      await this.page.keyboard.press('ArrowRight');
    }
    await this.page.waitForResponse(res => res.url().includes('/products') && res.status() === 200);
  }
}