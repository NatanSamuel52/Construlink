const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

// Carrega as variáveis do .env que fica na raiz do projeto
dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

// Cria o pool de conexões com o PostgreSQL
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
// Exporta a conexão para ser utilizada pelo backend
module.exports = pool;