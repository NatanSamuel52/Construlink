// Importa o Express
const express = require('express');
const cors = require('cors');

// Importa as rotas da API
const indexRoutes = require('./routes/index.routes');

// Cria a aplicação Express
const app = express();

// Permite receber e interpretar dados JSON
app.use(express.json());

// Permite requisições de outras origens
app.use(cors());

// Registra as rotas da API
app.use('/api', indexRoutes);

// Exporta a aplicação
module.exports = app;
