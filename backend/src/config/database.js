// Carrega as variáveis do arquivo .env localizado na raiz do projeto
require('dotenv').config({
  path: require('path').resolve(__dirname, '../../../.env')
});

const { Pool } = require('pg');

// Cria o pool de conexões com o PostgreSQL
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

module.exports = pool;