// config/auth.js
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

// Usando uma conta de serviço (recomendado para produção)
// Ajuste o caminho para apontar para o arquivo de credenciais correto
const auth = new GoogleAuth({
  keyFile: path.join(__dirname, '../../credentials.json'), // Ajustando o path para o arquivo na raiz
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

module.exports = auth;