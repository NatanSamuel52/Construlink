// Importa o Express
const express = require('express');

// Importa o pool de conexão com o PostgreSQL
const pool = require('../config/database');

// Cria um roteador
const router = express.Router();

// Rota inicial da API
router.get('/', (req, res) => {
  res.json({
    mensagem: 'API do Construlink funcionando!'
  });
});

// Rota para validar a conexão com o PostgreSQL
router.get('/db-check', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');

    res.json({
      mensagem: 'Conexão com o PostgreSQL funcionando!'
    });
  } catch (error) {
    console.error('Erro ao conectar com o PostgreSQL:', error.message);

    res.status(500).json({
      mensagem: 'Não foi possível conectar ao banco de dados.'
    });
  }
});

// Exporta as rotas
module.exports = router;