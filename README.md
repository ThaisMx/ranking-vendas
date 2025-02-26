# Ranking de Vendas

Sistema de ranking de vendas que exibe um pódio com os 3 melhores vendedores e uma lista completa de todos os vendedores, com integração ao Google Sheets para atualização automática dos dados.

## Funcionalidades

- Exibição de pódio com os 3 melhores vendedores
- Lista completa de vendedores ordenada por faturamento
- Visualização de métricas: faturamento total, faturamento do top 3, ticket médio
- Detalhes de vendas individuais em modal
- Contagem regressiva para o encerramento do período de vendas
- Atualização automática dos dados da planilha do Google

## Tecnologias

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Integração**: Google Sheets API

## Configuração

### Pré-requisitos

- Node.js (v14+)
- Conta Google com acesso à planilha de vendas
- Google Cloud Platform com API Sheets habilitada

### Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/ranking-vendas.git
   cd ranking-vendas
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure a autenticação do Google Sheets (veja abaixo)

4. Inicie o servidor:
   ```
   npm start
   ```

5. Acesse o aplicativo em http://localhost:3000

### Configuração da autenticação

Siga as instruções no arquivo `google-auth-setup.md` para configurar a autenticação com a API do Google Sheets.

## Estrutura da Planilha

A aplicação espera uma planilha com a seguinte estrutura:

**Aba "Vendas"**:
- Coluna A: Data da venda
- Coluna B: Email do comprador
- Coluna C: Nome do vendedor
- Coluna D: Produto vendido
- Coluna E: Valor da venda (formato R$ X.XXX,XX)

## Desenvolvimento

Para rodar em modo de desenvolvimento com recarga automática:

```
npm run dev
```

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).