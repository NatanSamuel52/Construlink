// Importa o Express para podermos criar o servidor
const express = require('express');

// Cria uma aplicação Express
const app = express();

// Define a porta onde o servidor vai funcionar
const PORT = 3000;

// Cria uma rota para o endereço principal "/"
app.get('/', (req, res) => {
  // Envia uma resposta quando alguém acessar http://localhost:3000/
  res.send('Backend do Construlink funcionando!');
});

// Inicia o servidor na porta definida acima
app.listen(PORT, () => {
  // Mostra uma mensagem no terminal quando o servidor iniciar
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
