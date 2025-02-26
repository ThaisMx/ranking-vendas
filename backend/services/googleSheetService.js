// services/googleSheetService.js
const { google } = require('googleapis');
const auth = require('../config/auth');

// ID da sua planilha do Google
const spreadsheetId = '1L-BNb1b-3NzR8RZ7ju0sfbXP0elkY3w4WQHXKI8_2BI';

// Funções auxiliares para calcular métricas
const calcularTicketMedio = (faturamento, quantidadeVendas) => {
  return quantidadeVendas > 0 ? Math.round(faturamento / quantidadeVendas) : 0;
};

// Percentual da meta (supondo meta de R$ 25.000,00)
const calcularPercentualMeta = (faturamento, meta = 25000) => {
  return Math.min(Math.round((faturamento / meta) * 100), 100);
};

exports.getRankingData = async () => {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Buscar dados da aba de vendas na planilha
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Vendas!A2:E', // Ajuste conforme sua planilha
    });
    
    const rows = response.data.values || [];
    
    // Processar dados para estrutura da aplicação
    const vendedores = {};
    
    // Agrupar vendas por vendedor
    rows.forEach(row => {
      const [data, email, vendedor, produto, valor] = row;
      
      if (!vendedores[vendedor]) {
        vendedores[vendedor] = {
          nome: vendedor,
          faturamento: 0,
          vendas: 0,
          vendasDetalhes: []
        };
      }
      
      // Remove símbolos e converte para número
      const valorNumerico = parseFloat(valor.replace('R$', '').replace('.', '').replace(',', '.').trim());
      
      vendedores[vendedor].faturamento += valorNumerico;
      vendedores[vendedor].vendas += 1;
      vendedores[vendedor].vendasDetalhes.push({
        data,
        email,
        produto,
        valor: `R$ ${valorNumerico.toFixed(2).replace('.', ',')}`
      });
    });
    
    // Converter para array e ordenar por faturamento
    let rankingArray = Object.values(vendedores);
    rankingArray.forEach(vendedor => {
      vendedor.ticketMedio = calcularTicketMedio(vendedor.faturamento, vendedor.vendas);
      vendedor.percentualMeta = calcularPercentualMeta(vendedor.faturamento);
      vendedor.faturamentoFormatado = `R$ ${vendedor.faturamento.toFixed(2).replace('.', ',')}`;
    });
    
    // Ordenar por faturamento (decrescente)
    rankingArray.sort((a, b) => b.faturamento - a.faturamento);
    
    // Calcular totais do time e do pódio
    const totalTime = rankingArray.reduce((acc, curr) => acc + curr.faturamento, 0);
    const totalPodium = rankingArray.slice(0, 3).reduce((acc, curr) => acc + curr.faturamento, 0);
    
    return {
      ranking: rankingArray,
      totalTime: `R$ ${totalTime.toFixed(2).replace('.', ',')}`,
      totalPodium: `R$ ${totalPodium.toFixed(2).replace('.', ',')}`
    };
  } catch (error) {
    console.error('Erro ao buscar dados da planilha:', error);
    throw error;
  }
};

exports.getVendedorSales = async (nomeVendedor) => {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Buscar dados da aba de vendas na planilha
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Vendas!A2:E', // Ajuste conforme sua planilha
    });
    
    const rows = response.data.values || [];
    
    // Filtrar apenas as vendas do vendedor solicitado
    const vendasVendedor = rows
      .filter(row => row[2] === nomeVendedor) // Posição do nome do vendedor
      .map(row => {
        const [data, email, vendedor, produto, valor] = row;
        return {
          email,
          dataHora: data,
          valor
        };
      });
    
    return vendasVendedor;
  } catch (error) {
    console.error(`Erro ao buscar vendas do vendedor ${nomeVendedor}:`, error);
    throw error;
  }
};