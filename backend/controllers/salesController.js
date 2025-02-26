// controllers/salesController.js
const googleSheetService = require('../services/googleSheetService');

exports.getRanking = async (req, res) => {
  try {
    // Buscar dados da planilha
    const data = await googleSheetService.getRankingData();
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ error: 'Erro ao buscar dados de ranking' });
  }
};

exports.getVendedorDetails = async (req, res) => {
  try {
    const { vendedor } = req.params;
    const vendasVendedor = await googleSheetService.getVendedorSales(vendedor);
    res.json(vendasVendedor);
  } catch (error) {
    console.error(`Erro ao buscar detalhes do vendedor ${req.params.vendedor}:`, error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do vendedor' });
  }
};