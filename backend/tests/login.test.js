const http = require('http');

function requisicao(metodo, caminho, corpo = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(corpo);

    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: caminho,
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
          responseBody += chunk;
        });

        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode,
              data: JSON.parse(responseBody),
            });
          } catch {
            resolve({
              status: res.statusCode,
              data: responseBody,
            });
          }
        });
      },
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('Iniciando testes de autenticação (SCRUM-268)...');

  const identificador = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const cliente = {
    nome: 'Cliente Teste Login',
    email: `login.cliente.${identificador}@construlink.local`,
    senha: '123456',
    papel: 'cliente',
  };

  const profissional = {
    nome: 'Profissional Teste Login',
    email: `login.profissional.${identificador}@construlink.local`,
    senha: '123456',
    papel: 'profissional',
    descricao: 'Profissional criado para teste automatizado de login.',
  };

  // Prepara as contas de teste pela API de cadastro.
  const cadastroCliente = await requisicao('POST', '/api/cadastro', cliente);

  if (cadastroCliente.status !== 201) {
    throw new Error(
      `Falha ao preparar cliente de teste: HTTP ${cadastroCliente.status}`,
    );
  }

  const cadastroProfissional = await requisicao(
    'POST',
    '/api/cadastro',
    profissional,
  );

  if (cadastroProfissional.status !== 201) {
    throw new Error(
      `Falha ao preparar profissional de teste: HTTP ${cadastroProfissional.status}`,
    );
  }

  // Critérios 1 e 6: cliente autentica.
  const t1 = await requisicao('POST', '/api/login', {
    email: cliente.email,
    senha: cliente.senha,
  });

  if (t1.status !== 200 || t1.data.usuario?.papel !== 'cliente') {
    throw new Error('Falha no login de Cliente com credenciais válidas');
  }

  console.log('✔ Cliente autentica com sucesso (200)');

  // Critérios 1 e 6: profissional autentica.
  const t2 = await requisicao('POST', '/api/login', {
    email: profissional.email,
    senha: profissional.senha,
  });

  if (t2.status !== 200 || t2.data.usuario?.papel !== 'profissional') {
    throw new Error('Falha no login de Profissional com credenciais válidas');
  }

  console.log('✔ Profissional autentica com sucesso (200)');

  // Critério 2: senha incorreta.
  const t3 = await requisicao('POST', '/api/login', {
    email: cliente.email,
    senha: 'senha_incorreta',
  });

  if (t3.status !== 401) {
    throw new Error('Falha: senha incorreta não foi rejeitada com 401');
  }

  console.log('✔ Senha incorreta rejeitada com 401');

  // Critério 2: usuário inexistente.
  const t4 = await requisicao('POST', '/api/login', {
    email: `inexistente.${identificador}@construlink.local`,
    senha: '123456',
  });

  if (t4.status !== 401) {
    throw new Error('Falha: usuário inexistente não foi rejeitado com 401');
  }

  console.log('✔ Usuário inexistente rejeitado com 401');

  // Critério 5: logout.
  const t5 = await requisicao('POST', '/api/logout', {});

  if (t5.status !== 200) {
    throw new Error('Falha no endpoint de logout');
  }

  console.log('✔ Logout concluído com sucesso (200)');

  console.log('Todos os testes de autenticação foram concluídos com sucesso!');
}

runTests().catch((err) => {
  console.error('Erro na execução dos testes:', err);
  process.exit(1);
});
