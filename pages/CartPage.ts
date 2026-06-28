import { Page, Locator, expect } from '@playwright/test';

/**
 * Gerencia as interações e o estado do carrinho de compras (Checkout).
 */
export class CartPage {
  readonly page: Page;
  readonly cartRows: Locator;
  readonly totalPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    // Filtra apenas linhas com inputs de quantidade para ignorar cabeçalhos e totais.
    this.cartRows = page.locator('table tbody tr').filter({ 
      has: page.locator('[data-test="product-quantity"]') 
    });
    
    // Fallback estratégico caso o atributo data-test não seja renderizado a tempo.
    this.totalPrice = page.locator('[data-test="total-price"]')
      .or(page.locator('td:has(strong:has-text("Total")) + td'));
  }

  async navegar() {
    await this.page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(/.*checkout/);
  }

  /**
   * Garante que a SPA terminou de popular a tabela de itens (Hydration).
   */
  async aguardarHidratacao() {
    await expect(this.cartRows.first()).toBeVisible({ timeout: 10000 });
  }

  async alterarQuantidade(indice: number, quantidade: string) {
    await this.aguardarHidratacao();
    const input = this.cartRows.nth(indice).locator('[data-test="product-quantity"]');
    
    await input.waitFor({ state: 'visible' });
    await input.clear();
    await input.fill(quantidade);
    await input.press('Enter');
    
    // Sincroniza com a API para garantir o processamento do cálculo no backend.
    await this.page.waitForResponse(res => res.url().includes('/carts') && res.status() < 400);
  }

  async removerProduto(indice: number) {
    await this.aguardarHidratacao();
    const deleteBtn = this.cartRows.nth(indice).locator('[data-test="delete-item"]').or(this.page.locator('.btn-danger'));
    
    await deleteBtn.waitFor({ state: 'visible' });
    
    await Promise.all([
      this.page.waitForResponse(res => res.url().includes('/carts') && res.status() < 400),
      deleteBtn.click()
    ]);
  }

  async obterSubtotal(indice: number): Promise<string> {
    await this.aguardarHidratacao();
    return await this.cartRows.nth(indice).locator('[data-test="line-price"]').innerText();
  }
}