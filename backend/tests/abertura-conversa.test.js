// tests/abertura-conversa.test.js - SCRUM-273 / SCRUM-326
// Testes automatizados dos criterios de aceite de abertura de conversa

const http = require('http');
const app = require('../src/app');

let servidor;
let porta = 3000;

function requisicao(metodo, caminho, corpo = null, token = null) {
  return new Promise((resolve, reject) => {
    const dados = corpo ? JSON.stringify(corpo) : null;
    const cabecalhos = {
      'Content-Type': 'application/json',
      ...(dados ? { 'Content-Length': Buffer.byteLength(dados) } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const req = http.request(
      {
        hostname: 'localhost',
        port: porta,
        path: caminho,
        method: metodo,
        headers: cabecalhos,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, data: body });
          }
        });
      },
    );

    req.on('error', reject);
    if (dados) req.write(dados);
    req.end();
  });
}

function checar(condicao, mensagem) {
  if (!condicao) {
    throw new Error('FALHA: ' + mensagem);
  }
  console.log('  PASSOU:', mensagem);
}

async function iniciarServidor() {
  try {
    await requisicao('GET', '/api');
    porta = 3000;
  } catch {
    porta = 3003;
    servidor = app.listen(porta);
    await new Promise((r) => setTimeout(r, 400));
  }
}

async function rodarTestesAberturaConversa() {
  console.log('Iniciando testes de abertura de conversa (SCRUM-273 / SCRUM-326)...\n');
  await iniciarServidor();

  try {
    // 1. Obter profissionais e servicos existentes
    const resProfissionais = await requisicao('GET', '/api/profissionais');
    checar(resProfissionais.status === 200 && resProfissionais.data.length > 0, 'Profissionais consultados do banco');
    const profissional = resProfissionais.data[0];

    const resServicosProf = await requisicao('GET', `/api/profissionais/${profissional.id}/servicos`);
    checar(resServicosProf.status === 200 && resServicosProf.data.length > 0, 'Servicos do profissional consultados');
    const servicoValido = resServicosProf.data[0];

    // Criar e autenticar um cliente de teste
    const emailCliente = `cliente.conversa.${Date.now()}@construlink.local`;
    await requisicao('POST', '/api/cadastro', {
      nome: 'Cliente Teste Conversa',
      email: emailCliente,
      senha: 'senhaSegura123',
      papel: 'cliente',
    });

    const resLogin = await requisicao('POST', '/api/login', {
      email: emailCliente,
      senha: 'senhaSegura123',
    });
    const tokenCliente = resLogin.data.token;
    checar(!!tokenCliente, 'Cliente autenticado com sucesso');

    // TESTE 1: SCRUM-322 - Exigir autenticacao (sem token deve retornar 401)
    console.log('\n[Criterio 1: Exigir autenticacao]');
    const resSemToken = await requisicao('POST', '/api/conversas', {
      profissional_id: profissional.id,
    });
    checar(resSemToken.status === 401, 'Rejeita abertura de conversa sem autenticacao (401)');

    // TESTE 2: SCRUM-323 - Rejeitar sem profissional
    console.log('\n[Criterio 2: Identificar profissional obrigatorio]');
    const resSemProf = await requisicao('POST', '/api/conversas', {}, tokenCliente);
    checar(resSemProf.status === 400, 'Rejeita abertura sem profissional informado (400)');

    // TESTE 3: SCRUM-323 - Rejeitar profissional inexistente
    const resProfInexistente = await requisicao(
      'POST',
      '/api/conversas',
      { profissional_id: 999999 },
      tokenCliente,
    );
    checar(resProfInexistente.status === 404, 'Rejeita profissional inexistente (404)');

    // TESTE 4: SCRUM-324 - Rejeitar servico invalido para o profissional
    console.log('\n[Criterio 3: Associar servico valido a conversa]');
    const resServicoInvalido = await requisicao(
      'POST',
      '/api/conversas',
      { profissional_id: profissional.id, servico_id: 999999 },
      tokenCliente,
    );
    checar(resServicoInvalido.status === 400, 'Rejeita servico nao oferecido pelo profissional (400)');

    // TESTE 5: SCRUM-325 - Criar CONVERSA com sucesso
    console.log('\n[Criterio 4: Criar registro em CONVERSA]');
    const resCriarConversa = await requisicao(
      'POST',
      '/api/conversas',
      { profissional_id: profissional.id, servico_id: servicoValido.id },
      tokenCliente,
    );
    checar(
      resCriarConversa.status === 201 || resCriarConversa.status === 200,
      'Conversa criada com sucesso no PostgreSQL',
    );
    const conversa = resCriarConversa.data.conversa;
    checar(Number(conversa.profissional_id) === Number(profissional.id), 'Profissional associado corretamente');
    checar(Number(conversa.servico_id) === Number(servicoValido.id), 'Servico associado corretamente');
    checar(!!conversa.cliente_id, 'Cliente identificado e associado');

    // TESTE 6: Nao duplicar conversa para o mesmo cliente, profissional e servico
    console.log('\n[Criterio 5: Nao duplicar conversa existente]');
    const resReaproveitar = await requisicao(
      'POST',
      '/api/conversas',
      { profissional_id: profissional.id, servico_id: servicoValido.id },
      tokenCliente,
    );
    checar(resReaproveitar.status === 200, 'Conversa existente reaproveitada com status 200');
    checar(resReaproveitar.data.conversa.id === conversa.id, 'Retorna o mesmo ID de conversa');

    console.log('\nTodos os criterios da SCRUM-273 foram validados com sucesso!');
  } finally {
    if (servidor) {
      servidor.close();
    }
  }
}

rodarTestesAberturaConversa().catch((err) => {
  console.error('\nErro nos testes de abertura de conversa:', err);
  if (servidor) servidor.close();
  process.exit(1);
});
