// config/auth.js
const { GoogleAuth } = require('google-auth-library');

// Há duas opções de autenticação:

// 1. Usando uma conta de serviço (recomendado para produção)
const auth = new GoogleAuth({
  keyFile: 'credentials.json', // Você precisará criar este arquivo
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

module.exports = auth;

/* 
2. Alternativa mais simples para desenvolvimento/teste
usando API Key (menos seguro):

const API_KEY = 'SUA_API_KEY_AQUI';
module.exports = API_KEY;

E então altere o serviço para usar:
const sheets = google.sheets({ version: 'v4', key: API_KEY });
*/