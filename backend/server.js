// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const salesController = require('./controllers/salesController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas da API
app.get('/api/sales/ranking', salesController.getRanking);
app.get('/api/sales/details/:vendedor', salesController.getVendedorDetails);

// Rota principal para o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT} no seu navegador`);
});