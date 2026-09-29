// Importa o Express
const express = require('express');

// Importa as rotas da API
const indexRoutes = require('./routes/index.routes');

// Cria a aplicação Express
const app = express();

// Permite receber e interpretar dados JSON
app.use(express.json());

// Registra as rotas da API
app.use('/api', indexRoutes);

// Exporta a aplicação
module.exports = app;
