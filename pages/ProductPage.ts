import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly outOfStockMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('[data-test="product-name"]');
    this.productPrice = page.locator('[data-test="unit-price"]');
    this.productDescription = page.locator('[data-test="product-description"]');
    this.quantityInput = page.locator('[data-test="quantity"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.outOfStockMessage = page.locator('.alert-danger'); // Ajustar se houver data-test específico
  }

  async adicionarAoCarrinho(quantidade: string) {
    await this.quantityInput.fill(quantidade);
    await this.addToCartButton.click();
  }
}