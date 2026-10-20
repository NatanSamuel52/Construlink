// tests/integracao.test.js - SCRUM-278 / SCRUM-349 / SCRUM-282
// Teste automatizado de integracao ponta a ponta dos fluxos da V1.0

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
  // Testa se a porta 3000 ja esta respondendo
  try {
    await requisicao('GET', '/api');
    porta = 3000;
  } catch {
    // Sobe em porta alternativa para o teste
    porta = 3002;
    servidor = app.listen(porta);
    await new Promise((r) => setTimeout(r, 400));
  }
}

async function rodarTestesIntegracao() {
  console.log('Iniciando testes de integracao ponta a ponta (SCRUM-278)...');
  await iniciarServidor();

  try {
    // 1. Busca publica de servicos cadastrados no PostgreSQL
    console.log('\n[Fluxo 1] Consulta de Servicos e Profissionais:');
    const resServicos = await requisicao('GET', '/api/servicos');
    checar(resServicos.status === 200, 'Endpoint /api/servicos respondeu 200');
    checar(Array.isArray(resServicos.data) && resServicos.data.length > 0, 'Servicos reais retornados do banco');

    const resProfissionais = await requisicao('GET', '/api/profissionais');
    checar(resProfissionais.status === 200, 'Endpoint /api/profissionais respondeu 200');
    checar(Array.isArray(resProfissionais.data) && resProfissionais.data.length > 0, 'Profissionais retornados do banco');

    const primeiroProfissional = resProfissionais.data[0];
    const resPerfil = await requisicao('GET', `/api/profissionais/${primeiroProfissional.id}`);
    checar(resPerfil.status === 200, 'Perfil publico do profissional retornado com 200');
    checar(resPerfil.data.nome === primeiroProfissional.nome, 'Dados consistentes do profissional');

    // 2. Cadastro de um novo cliente
    console.log('\n[Fluxo 2] Cadastro e Autenticacao de Cliente:');
    const emailCliente = `cliente.integracao.${Date.now()}@construlink.local`;
    const resCadastro = await requisicao('POST', '/api/cadastro', {
      nome: 'Cliente Integracao Teste',
      email: emailCliente,
      senha: 'senhaSegura123',
      papel: 'cliente',
    });
    checar(resCadastro.status === 201, 'Cadastro de cliente concluido com 201');
    checar(resCadastro.data.usuario?.email === emailCliente, 'Usuario persistido no PostgreSQL');
    checar(!resCadastro.data.usuario?.senha_hash, 'Hash de senha nao exposta ao frontend');

    // 3. Login do cliente recem-cadastrado
    const resLogin = await requisicao('POST', '/api/login', {
      email: emailCliente,
      senha: 'senhaSegura123',
    });
    checar(resLogin.status === 200, 'Login do novo cliente efetuado com 200');
    checar(!!resLogin.data.token, 'Token JWT retornado');
    const token = resLogin.data.token;

    // 4. Iniciar conversa com o profissional sobre um servico
    console.log('\n[Fluxo 3] Comunicacao: Conversa e Mensagens:');
    const resConversa = await requisicao(
      'POST',
      '/api/conversas',
      { profissional_id: primeiroProfissional.id },
      token,
    );
    checar(
      resConversa.status === 200 || resConversa.status === 201,
      'Conversa iniciada/recuperada no PostgreSQL',
    );
    const conversaId = resConversa.data.conversa.id;
    checar(!!conversaId, 'ID da conversa gerado pelo banco relacional');

    // 5. Enviar mensagem na conversa
    const textoMensagem = 'Ola, gostaria de solicitar um orcamento para reforma!';
    const resMensagem = await requisicao(
      'POST',
      `/api/conversas/${conversaId}/mensagens`,
      { conteudo: textoMensagem },
      token,
    );
    checar(resMensagem.status === 201, 'Mensagem salva com sucesso com status 201');
    checar(resMensagem.data.conteudo === textoMensagem, 'Conteudo da mensagem persistido fielmente');

    // 6. Consultar mensagens da conversa e validar persistencia
    const resListaMsgs = await requisicao(
      'GET',
      `/api/conversas/${conversaId}/mensagens`,
      null,
      token,
    );
    checar(resListaMsgs.status === 200, 'Historico de mensagens retornado com 200');
    checar(Array.isArray(resListaMsgs.data) && resListaMsgs.data.length > 0, 'Mensagens recuperadas do PostgreSQL');
    checar(
      resListaMsgs.data.some((m) => m.conteudo === textoMensagem),
      'Mensagem enviada consta no historico cronologico',
    );

    console.log('\nTodos os fluxos ponta a ponta da V1.0 foram validados com sucesso!');
  } finally {
    if (servidor) {
      servidor.close();
    }
  }
}

rodarTestesIntegracao().catch((err) => {
  console.error('\nErro no teste de integracao:', err);
  if (servidor) servidor.close();
  process.exit(1);
});
