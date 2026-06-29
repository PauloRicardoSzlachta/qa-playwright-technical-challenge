import { faker } from '@faker-js/faker';

/**
 * Gera uma senha aleatória que atenda aos requisitos de complexidade 
 * e evite bloqueios de "data leak" da aplicação.
 */
export function gerarSenhaSegura(): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const senhaBase = Array.from({ length: 12 }, () => caracteres[Math.floor(Math.random() * caracteres.length)]);
  return senhaBase.join('') + '1aA!';
}