import { Page, Locator, expect } from '@playwright/test';

/**
 * Gerencia as interações na página de detalhes do produto e adição ao carrinho.
 */
export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;  
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('[data-test="product-name"]');
    this.productPrice = page.locator('[data-test="unit-price"]');
    this.productDescription = page.locator('[data-test="product-description"]');    
    this.quantityInput = page.locator('[data-test="quantity"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.cartBadge = page.locator('[data-test="cart-quantity"]');
  }

  async adicionarAoCarrinho(quantidade: string) {
    await expect(this.productName).toBeVisible();
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantidade);

    // Sincroniza com a API para garantir persistência no servidor antes da navegação.
    const responsePromise = this.page.waitForResponse(
      res => res.url().includes('/carts') && res.status() < 400 && res.request().method() !== 'GET'
    );
    await this.addToCartButton.click();
    await responsePromise;
    
    // Aguarda o ciclo de vida do Toast para garantir que a sessão da SPA foi atualizada.
    const toast = this.page.locator('.toast-body, [role="alert"]');
    await expect(toast).toBeVisible();
    await expect(toast).toBeHidden({ timeout: 10000 });
  }

  /**
   * Recupera a quantidade do badge com tratamento de erro para estados de carrinho vazio.
   */
  async obterQuantidadeBadge(): Promise<number> {
    const visivel = await this.cartBadge.isVisible({ timeout: 2000 }).catch(() => false);
    if (!visivel) return 0;
    
    const texto = await this.cartBadge.innerText();
    return texto ? parseInt(texto) : 0;
  }
}