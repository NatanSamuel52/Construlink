// Importa o Express
const express = require('express');
const cors = require('cors');

// Importa as rotas da API
const indexRoutes = require('./routes/index.routes');

// Cria a aplicação Express
const app = express();

// Habilita CORS para requisições do frontend
app.use(cors());

// Permite receber e interpretar dados JSON
app.use(express.json());

// Registra as rotas da API
app.use('/api', indexRoutes);

// Exporta a aplicação
module.exports = app;
