Desafio Técnico QA

AUTOMAÇÃO TOOLSHOP - PLAYWRIGHT

Framework de Testes E2E e Validação de Contrato de API

29 de junho de 2026

---

### 1. Introdução

Este projeto consiste em um framework de automação de testes robusto desenvolvido para a plataforma Toolshop (Practices Software Testing). A solução abrange testes de interface (E2E) e testes de contrato de API, utilizando o Playwright como motor principal. O objetivo é garantir a qualidade dos fluxos críticos de negócio, como busca de produtos, filtragem e integridade dos dados retornados pelo backend.

### 2. Pré-requisitos

Para a correta execução deste projeto, é necessário que o ambiente possua as seguintes ferramentas instaladas:

*   **Node.js:** Versão **LTS** (recomendado v18 ou superior).
*   **npm:** Gerenciador de pacotes nativo do Node.js.
*   **Git:** Para clonagem e versionamento do repositório.

### 3. Instruções de Instalação

Siga os passos abaixo para configurar o ambiente localmente:

1. Clone o repositório para sua máquina local.
2. Navegue até a pasta raiz do projeto via terminal.
3. Execute o comando para instalar as dependências do projeto:
```bash
npm install
```
4. Instale os navegadores necessários para o Playwright:
```bash
npx playwright install
```

### 4. Configuração de Variáveis de Ambiente

O projeto utiliza o pacote dotenv para gerenciar configurações sensíveis e URLs de ambiente, evitando o uso de hardcoded values conforme as boas práticas de engenharia de software.

1. Na raiz do projeto, crie um arquivo chamado `.env`.
2. Adicione a seguinte chave ao arquivo:
```env
BASE_URL=https://practicesoftwaretesting.com
```

Nota: Certifique-se de que o arquivo .env não seja enviado ao controle de versão (já configurado no .gitignore).


### 5. Instruções de Execução

O framework permite diferentes modos de execução para atender às necessidades de desenvolvimento e integração contínua:

#### 5.1 Execução em Modo Headless (Padrão)
Ideal para ambientes de CI/CD, executa os testes sem interface gráfica:

```bash
npx playwright test
```

#### 5.2 Execução com Interface (UI Mode)
Proporciona uma experiência visual para depuração e acompanhamento dos steps:

```bash
npx playwright test --ui
```

#### 5.3 Execução de Testes de API
Para executar especificamente a suíte de contrato de API:

```bash
npx playwright test tests/api-contract.spec.ts
```

### 6. Descrição Técnica

A arquitetura do projeto foi desenhada focando em manutenibilidade, escalabilidade e performance, utilizando os seguintes conceitos:

*   **Page Object Model (POM):** Encapsulamento da lógica de interação com a interface em classes específicas, reduzindo a duplicidade de código e facilitando manutenções futuras.
*   **Testes de Contrato de API:** Validação da integridade dos payloads utilizando a fixture nativa request do Playwright, assegurando que o backend respeite os tipos e estruturas esperadas.
*   **CI/CD com GitHub Actions:** Pipeline automatizado que executa a suíte completa a cada push ou pull request, garantindo feedback rápido sobre a saúde da aplicação.
*   **Relatórios:** Geração automática de relatórios em HTML para análise detalhada de falhas e evidências.

### 7. Diferenciais Implementados

Além dos requisitos básicos, este projeto contempla os seguintes diferenciais técnicos (Item 4.2):

*   **Automação de API:** Suíte dedicada para validar os endpoints de produtos, garantindo que a comunicação entre camadas esteja íntegra.
*   **Pipeline de CI:** Integração total com GitHub Actions, incluindo a gestão de segredos (Secrets) para proteção da BASE_URL e publicação de artefatos de teste.

---

*Documento elaborado em 29 de junho de 2026. As informações contidas são de responsabilidade do solicitante.*