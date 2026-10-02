const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseBody });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('Iniciando testes de autenticação (SCRUM-268)...');

  // Critério 1 e 6: Cliente autentica
  const t1 = await post('/api/login', { email: 'ana.silva.teste@construlink.local', senha: '123456' });
  if (t1.status !== 200 || t1.data.usuario?.papel !== 'cliente') {
    throw new Error('Falha no login de Cliente com credenciais válidas');
  }
  console.log('✔ Cliente autentica com sucesso (200)');

  // Critério 1 e 6: Profissional autentica
  const t2 = await post('/api/login', { email: 'carlos.oliveira.teste@construlink.local', senha: '123456' });
  if (t2.status !== 200 || t2.data.usuario?.papel !== 'profissional') {
    throw new Error('Falha no login de Profissional com credenciais válidas');
  }
  console.log('✔ Profissional autentica com sucesso (200)');

  // Critério 2: Senha incorreta
  const t3 = await post('/api/login', { email: 'ana.silva.teste@construlink.local', senha: 'senha_incorreta' });
  if (t3.status !== 401) {
    throw new Error('Falha: senha incorreta não foi rejeitada com 401');
  }
  console.log('✔ Senha incorreta rejeitada com 401');

  // Critério 2: Usuário inexistente
  const t4 = await post('/api/login', { email: 'inexistente@construlink.local', senha: '123456' });
  if (t4.status !== 401) {
    throw new Error('Falha: usuário inexistente não foi rejeitado com 401');
  }
  console.log('✔ Usuário inexistente rejeitado com 401');

  // Critério 5: Logout
  const t5 = await post('/api/logout', {});
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
