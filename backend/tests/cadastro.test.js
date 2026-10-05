// tests/cadastro.test.js - SCRUM-296
// Testes automatizados dos criterios de aceite do cadastro de usuario
// Execute com: npm test (na pasta backend, com o servidor rodando na porta 3000)

const http = require('http');

function requisicao(metodo, caminho, corpo) {
  return new Promise((resolve, reject) => {
    const dados = corpo ? JSON.stringify(corpo) : '{}';
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: caminho,
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dados),
      },
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    req.write(dados);
    req.end();
  });
}

async function runTests() {
  console.log('Iniciando testes de cadastro de usuario (SCRUM-293/294/295/296)...');

  const emailTeste = `cadastro.${Date.now()}@construlink.local`;

  // SCRUM-296: campos obrigatorios
  const t1 = await requisicao('POST', '/api/cadastro', {});
  if (t1.status !== 400) throw new Error('Falha: campos em branco deveriam retornar 400, recebeu ' + t1.status);
  console.log('PASSOU: campos obrigatorios rejeitados com 400');

  // SCRUM-296: formato de email invalido
  const t2 = await requisicao('POST', '/api/cadastro', {
    nome: 'Teste', email: 'emailinvalido', senha: '123456', papel: 'cliente'
  });
  if (t2.status !== 400) throw new Error('Falha: email invalido deveria retornar 400, recebeu ' + t2.status);
  console.log('PASSOU: e-mail invalido rejeitado com 400');

  // SCRUM-296: senha curta
  const t3 = await requisicao('POST', '/api/cadastro', {
    nome: 'Teste', email: emailTeste, senha: '123', papel: 'cliente'
  });
  if (t3.status !== 400) throw new Error('Falha: senha curta deveria retornar 400, recebeu ' + t3.status);
  console.log('PASSOU: senha curta rejeitada com 400');

  // SCRUM-296: papel invalido
  const t4 = await requisicao('POST', '/api/cadastro', {
    nome: 'Teste', email: emailTeste, senha: '123456', papel: 'admin'
  });
  if (t4.status !== 400) throw new Error('Falha: papel invalido deveria retornar 400, recebeu ' + t4.status);
  console.log('PASSOU: papel invalido rejeitado com 400');

  // SCRUM-295: cadastro de cliente com dados validos
  const t5 = await requisicao('POST', '/api/cadastro', {
    nome: 'Usuario Teste Cadastro', email: emailTeste, senha: '123456', papel: 'cliente'
  });
  if (t5.status !== 201) throw new Error('Falha: cadastro valido deveria retornar 201, recebeu ' + t5.status);
  if (t5.data.usuario?.papel !== 'cliente') throw new Error('Falha: papel cliente nao registrado');
  if (t5.data.usuario?.senha_hash) throw new Error('Falha: senha_hash exposta ao frontend');
  console.log('PASSOU: cliente cadastrado com sucesso (201), senha nao exposta');

  // SCRUM-296: email duplicado
  const t6 = await requisicao('POST', '/api/cadastro', {
    nome: 'Outro Nome', email: emailTeste, senha: '654321', papel: 'cliente'
  });
  if (t6.status !== 409) throw new Error('Falha: email duplicado deveria retornar 409, recebeu ' + t6.status);
  console.log('PASSOU: e-mail duplicado rejeitado com 409');

  // SCRUM-294: cadastro de profissional
  const emailProf = `prof.${Date.now()}@construlink.local`;
  const t7 = await requisicao('POST', '/api/cadastro', {
    nome: 'Profissional Teste',
    email: emailProf,
    senha: '123456',
    papel: 'profissional',
    descricao: 'Atuo com elétrica e manutenção residencial.'
  });
  if (t7.status !== 201) throw new Error('Falha: cadastro de profissional deveria retornar 201, recebeu ' + t7.status);
  if (t7.data.usuario?.papel !== 'profissional') throw new Error('Falha: papel profissional nao registrado');
  console.log('PASSOU: profissional cadastrado com sucesso (201)');

  const loginProfissional = await requisicao('POST', '/api/login', {
    email: emailProf, senha: '123456'
  });
  const profissionalId = loginProfissional.data.usuario?.profissional_id;
  if (loginProfissional.status !== 200 || !profissionalId) {
    throw new Error('Falha: profissional não ficou disponível após o cadastro');
  }

  const perfilProfissional = await requisicao('GET', `/api/profissionais/${profissionalId}`);
  if (perfilProfissional.data?.descricao !== 'Atuo com elétrica e manutenção residencial.') {
    throw new Error('Falha: descricao profissional nao foi persistida');
  }
  console.log('PASSOU: vínculo e descrição do profissional confirmados');

  console.log('Todos os testes de cadastro foram concluidos com sucesso!');
}

runTests().catch((err) => {
  console.error('Erro na execucao dos testes de cadastro:', err);
  process.exit(1);
});