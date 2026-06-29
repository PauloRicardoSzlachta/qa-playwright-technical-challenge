import { test, expect } from '@playwright/test';

/**
 * Suíte de Testes: Contrato da API de Produtos
 * Justificativa: Validação de integridade entre camadas. 
 * Nota: A API do Toolshop reside em subdomínio dedicado (api.practicesoftwaretesting.com).
 */
test.describe('API Contract - Products', () => {

  // Definimos a URL da API separada da URL do frontend para evitar conflitos de roteamento da SPA.
  const API_URL = 'https://api.practicesoftwaretesting.com';

  test('GET /products — Validar integridade da lista de produtos', async ({ request }) => {
    // Chamada direta ao endpoint de produtos da API.
    const response = await request.get(`${API_URL}/products`);

    // Valida o status e o cabeçalho antes de processar o JSON para evitar SyntaxError.
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    
    // Suporte a payloads diretos ou paginados (padrão da API Toolshop).
    const products = Array.isArray(body) ? body : body.data;
    expect(Array.isArray(products)).toBe(true);

    test.skip(products.length === 0, 'Nenhum produto disponível para validação.');

    const product = products[0];

    // Validação de Contrato: Garante presença e tipos via asserções nativas.
    expect(product).toMatchObject({
      id: expect.any(String), // IDs no Toolshop são UUIDs/Strings.
      name: expect.any(String),
      price: expect.any(Number)
    });

    expect(product.price).toBeGreaterThanOrEqual(0);
  });

  test('GET /products/{id} — Validar schema do detalhe do produto', async ({ request }) => {
    const listResponse = await request.get(`${API_URL}/products`);
    const listBody = await listResponse.json();
    const products = Array.isArray(listBody) ? listBody : listBody.data;
    
    test.skip(products.length === 0, 'Nenhum produto disponível para obter ID.');

    const targetId = products[0].id;
    
    // Resolve a URL absoluta do recurso individual para garantir a integridade do detalhamento 
    // e evitar interceptações indevidas pelo roteamento de rotas inexistentes da SPA.
    const response = await request.get(`${API_URL}/products/${targetId}`);
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    
    const product = await response.json();

    expect(product).toMatchObject({
      id: targetId,
      name: expect.any(String),
      price: expect.any(Number)
    });
  });
});