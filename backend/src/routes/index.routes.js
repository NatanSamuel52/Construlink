// Importa o Express
const express = require('express');

// Cria um roteador
const router = express.Router();

// Rota inicial da API
router.get('/', (req, res) => {
  res.json({
    mensagem: 'API do Construlink funcionando!'
  });
});

// Exporta as rotas
module.exports = router;
