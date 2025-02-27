// controllers/salesController.js
const googleSheetService = require('../services/googleSheetService');

exports.getRanking = async (req, res) => {
  try {
    console.log('Requisição recebida para obter ranking de vendas');
    // Buscar dados da planilha
    const data = await googleSheetService.getRankingData();
    console.log('Dados de ranking obtidos com sucesso');
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar dados de ranking',
      message: error.message
    });
  }
};

exports.getVendedorDetails = async (req, res) => {
  try {
    const { vendedor } = req.params;
    console.log(`Requisição recebida para obter detalhes do vendedor: ${vendedor}`);
    
    const vendasVendedor = await googleSheetService.getVendedorSales(vendedor);
    console.log(`Detalhes do vendedor ${vendedor} obtidos com sucesso`);
    
    res.json(vendasVendedor);
  } catch (error) {
    console.error(`Erro ao buscar detalhes do vendedor ${req.params.vendedor}:`, error);
    res.status(500).json({ 
      error: 'Erro ao buscar detalhes do vendedor',
      message: error.message
    });
  }
};