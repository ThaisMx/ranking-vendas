// server.js
const express = require('express');
const cors = require('cors');
const salesController = require('./controllers/salesController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.get('/api/sales/ranking', salesController.getRanking);
app.get('/api/sales/details/:vendedor', salesController.getVendedorDetails);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});