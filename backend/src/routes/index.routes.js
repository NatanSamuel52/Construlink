const bcrypt = require('bcryptjs');

const express = require('express');

// Importa o pool de conexão com o PostgreSQL
const pool = require('../config/database');

// Cria um roteador
const router = express.Router();

// Lista profissionais para a busca, com filtro opcional por serviço
router.get('/profissionais', async (req, res) => {
  try {
    const termo = String(req.query.servico || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Relaciona "eletricista" ao serviço cadastrado "Instalação elétrica"
    const termoBusca = ['eletricista', 'eletricistas'].includes(termo)
      ? 'eletrica'
      : termo;

    const filtro = termoBusca ? `%${termoBusca}%` : null;

    const resultado = await pool.query(
      `
        SELECT
          p.id,
          u.nome,
          p.descricao,
          u.foto_perfil_url
        FROM profissional p
        INNER JOIN usuario u ON u.id = p.usuario_id
        WHERE
          $1::text IS NULL
          OR EXISTS (
            SELECT 1
            FROM oferta_servico os
            INNER JOIN servico s ON s.id = os.servico_id
            WHERE
              os.profissional_id = p.id
              AND translate(
                lower(s.nome),
                'áàâãäéèêëíìîïóòôõöúùûüç',
                'aaaaaeeeeiiiiooooouuuuc'
              ) ILIKE $1
          )
        ORDER BY u.nome;
      `,
      [filtro]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar profissionais:', erro.message);
    res.status(500).json({
      mensagem: 'Erro ao consultar profissionais.'
    });
  }
});

// Lista os serviços disponíveis
router.get('/servicos', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        id,
        nome,
        descricao
      FROM servico
      ORDER BY nome;
    `);

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar serviços:', erro.message);
    res.status(500).json({
      mensagem: 'Erro ao consultar serviços.'
    });
  }
});

// Lista os trabalhos realizados por um profissional
router.get('/profissionais/:id/trabalhos', async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      mensagem: 'O ID do profissional deve ser numérico.'
    });
  }

  try {
    const profissional = await pool.query(
      'SELECT id FROM profissional WHERE id = $1;',
      [id]
    );

    if (profissional.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Profissional não encontrado.'
      });
    }

    const resultado = await pool.query(
      `
        SELECT
          id,
          titulo,
          foto_url,
          descricao
        FROM trabalho_realizado
        WHERE profissional_id = $1
        ORDER BY id;
      `,
      [id]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar trabalhos do profissional:', erro.message);
    res.status(500).json({
      mensagem: 'Erro ao consultar trabalhos do profissional.'
    });
  }
});

// Lista os serviços oferecidos por um profissional
router.get('/profissionais/:id/servicos', async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      mensagem: 'O ID do profissional deve ser numérico.'
    });
  }

  try {
    const profissional = await pool.query(
      'SELECT id FROM profissional WHERE id = $1;',
      [id]
    );

    if (profissional.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Profissional não encontrado.'
      });
    }

    const resultado = await pool.query(
      `
        SELECT
          s.id,
          s.nome,
          s.descricao
        FROM oferta_servico os
        INNER JOIN servico s ON s.id = os.servico_id
        WHERE os.profissional_id = $1
        ORDER BY s.nome;
      `,
      [id]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar serviços do profissional:', erro.message);
    res.status(500).json({
      mensagem: 'Erro ao consultar serviços do profissional.'
    });
  }
});

// Consulta o perfil de um profissional pelo ID
router.get('/profissionais/:id', async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      mensagem: 'O ID do profissional deve ser numérico.'
    });
  }

  try {
    const resultado = await pool.query(
      `
        SELECT
          p.id,
          u.nome,
          p.descricao,
          u.foto_perfil_url
        FROM profissional p
        INNER JOIN usuario u ON u.id = p.usuario_id
        WHERE p.id = $1;
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Profissional não encontrado.'
      });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao consultar perfil:', erro.message);
    res.status(500).json({
      mensagem: 'Erro ao consultar perfil do profissional.'
    });
  }
});

// Rota inicial da API
router.get('/', (req, res) => {
  res.json({
    mensagem: 'API do Construlink funcionando!'
  });
});

// Rota para validar a conexão com o PostgreSQL
router.get('/db-check', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');

    res.json({
      mensagem: 'Conexão com o PostgreSQL funcionando!'
    });
  } catch (error) {
    console.error('Erro ao conectar com o PostgreSQL:', error.message);

    res.status(500).json({
      mensagem: 'Não foi possível conectar ao banco de dados.'
    });
  }
});

// Exporta as rotas


// Autenticação de usuário (Cliente ou Profissional) - SCRUM-268
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
    }

    const emailFormatado = String(email).trim().toLowerCase();

    const query = [
      'SELECT',
      '  u.id,',
      '  u.nome,',
      '  u.email,',
      '  u.senha_hash,',
      '  u.papel,',
      '  u.foto_perfil_url,',
      '  c.id AS cliente_id,',
      '  p.id AS profissional_id',
      'FROM usuario u',
      'LEFT JOIN cliente c ON c.usuario_id = u.id',
      'LEFT JOIN profissional p ON p.usuario_id = u.id',
      'WHERE LOWER(u.email) = $1',
      'LIMIT 1'
    ].join(' ');

    const resultado = await pool.query(query, [emailFormatado]);

    if (resultado.rows.length === 0) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const usuario = resultado.rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    return res.status(200).json({
      mensagem: 'Autenticado com sucesso.',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
        foto_perfil_url: usuario.foto_perfil_url,
        cliente_id: usuario.cliente_id,
        profissional_id: usuario.profissional_id
      }
    });
  } catch (erro) {
    console.error('Erro na autenticação:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao realizar autenticação.' });
  }
});


// Cadastro de novo usuário (Cliente ou Profissional) - SCRUM-293/295/296
router.post('/cadastro', async (req, res) => {
  const client = await pool.connect();

  try {
    const { nome, email, senha, papel, descricao } = req.body;

    // Validação de campos obrigatórios - SCRUM-296
    if (!nome || !email || !senha || !papel) {
      return res.status(400).json({
        mensagem: 'Nome, e-mail, senha e papel são obrigatórios.'
      });
    }

    const nomeFormatado = String(nome).trim();
    const emailFormatado = String(email).trim().toLowerCase();
    const papelFormatado = String(papel).trim().toLowerCase();

    if (nomeFormatado.length < 2) {
      return res.status(400).json({ mensagem: 'O nome deve ter pelo menos 2 caracteres.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFormatado)) {
      return res.status(400).json({ mensagem: 'Formato de e-mail inválido.' });
    }

    if (String(senha).length < 6) {
      return res.status(400).json({ mensagem: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    if (!['cliente', 'profissional'].includes(papelFormatado)) {
      return res.status(400).json({ mensagem: 'Papel inválido. Use "cliente" ou "profissional".' });
    }

    if (papelFormatado === 'profissional' && descricao != null && typeof descricao !== 'string') {
      return res.status(400).json({ mensagem: 'A descrição profissional deve ser um texto.' });
    }

    const descricaoFormatada = typeof descricao === 'string'
      ? descricao.trim() || null
      : null;

    // Verificação de unicidade do e-mail - SCRUM-296
    const emailExistente = await client.query(
      'SELECT id FROM usuario WHERE LOWER(email) = $1 LIMIT 1;',
      [emailFormatado]
    );

    if (emailExistente.rows.length > 0) {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
    }

    // Início da transação para garantir que não fiquem registros incompletos
    await client.query('BEGIN');

    // Hash da senha - SCRUM-295
    const senhaHash = await bcrypt.hash(String(senha), 10);

    // Inserção do usuário - SCRUM-295
    const resultadoUsuario = await client.query(
      `INSERT INTO usuario (nome, email, senha_hash, papel)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, papel, criado_em, foto_perfil_url;`,
      [nomeFormatado, emailFormatado, senhaHash, papelFormatado]
    );

    const novoUsuario = resultadoUsuario.rows[0];

    if (papelFormatado === 'cliente') {
      const resultadoCliente = await client.query(
        'INSERT INTO cliente (usuario_id) VALUES ($1) RETURNING id, usuario_id;',
        [novoUsuario.id]
      );

      if (
        resultadoCliente.rows.length !== 1 ||
        String(resultadoCliente.rows[0].usuario_id) !== String(novoUsuario.id)
      ) {
        throw new Error('Não foi possível confirmar o vínculo do cliente com o usuário.');
      }
    } else {
      await client.query(
        'INSERT INTO profissional (usuario_id, descricao) VALUES ($1, $2);',
        [novoUsuario.id, descricaoFormatada]
      );
    }

    await client.query('COMMIT');

    return res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso.',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        papel: novoUsuario.papel,
        foto_perfil_url: novoUsuario.foto_perfil_url
      }
    });
  } catch (erro) {
    await client.query('ROLLBACK');
    console.error('Erro no cadastro:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao realizar cadastro.' });
  } finally {
    client.release();
  }
});

// Encerramento de sessão - SCRUM-268
router.post('/logout', (req, res) => {
  return res.status(200).json({ mensagem: 'Sessão encerrada com sucesso.' });
});

module.exports = router;
