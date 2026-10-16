const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const autenticar = require('../middlewares/autenticacao');
const uploadTrabalho = require('../config/upload');
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
      [filtro],
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar profissionais:', erro.message);
    res.status(500).json({
      mensagem: 'Erro ao consultar profissionais.',
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
      mensagem: 'Erro ao consultar serviços.',
    });
  }
});
router.get('/profissionais/quantidade', async (req, res) => {
  const resultado = await pool.query('SELECT COUNT(id) FROM profissional;');
  const quantidade = Number(resultado.rows[0].count);
  res.json({ quantidade });
});
// Lista os trabalhos realizados por um profissional
router.get('/profissionais/:id/trabalhos', async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      mensagem: 'O ID do profissional deve ser numérico.',
    });
  }

  try {
    const profissional = await pool.query(
      'SELECT id FROM profissional WHERE id = $1;',
      [id],
    );

    if (profissional.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Profissional não encontrado.',
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
      [id],
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar trabalhos do profissional:', erro.message);
    res.status(500).json({
      mensagem: 'Erro ao consultar trabalhos do profissional.',
    });
  }
});

// Lista os serviços oferecidos por um profissional
router.get('/profissionais/:id/servicos', async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      mensagem: 'O ID do profissional deve ser numérico.',
    });
  }

  try {
    const profissional = await pool.query(
      'SELECT id FROM profissional WHERE id = $1;',
      [id],
    );

    if (profissional.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Profissional não encontrado.',
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
      [id],
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar serviços do profissional:', erro.message);
    res.status(500).json({
      mensagem: 'Erro ao consultar serviços do profissional.',
    });
  }
});

// Remove um serviço do próprio perfil profissional - SCRUM-276
router.delete('/ofertas-servico/:servicoId', autenticar, async (req, res) => {
  if (req.usuario.papel !== 'profissional') {
    return res.status(403).json({
      mensagem: 'Acesso permitido somente a profissionais.',
    });
  }

  const { servicoId } = req.params;

  if (!/^[1-9]\d*$/.test(servicoId)) {
    return res.status(400).json({
      mensagem: 'Informe um ID de serviço válido.',
    });
  }

  try {
    const perfil = await pool.query(
      'SELECT id FROM profissional WHERE usuario_id = $1;',
      [req.usuario.id],
    );

    if (perfil.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Perfil profissional não encontrado.',
      });
    }

    const resultado = await pool.query(
      `DELETE FROM oferta_servico
       WHERE profissional_id = $1 AND servico_id = $2
       RETURNING id;`,
      [perfil.rows[0].id, servicoId],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Este serviço não está associado ao seu perfil.',
      });
    }

    return res.status(200).json({
      mensagem: 'Serviço removido do seu perfil com sucesso.',
    });
  } catch (erro) {
    console.error('Erro ao remover serviço do perfil:', erro.message);

    return res.status(500).json({
      mensagem: 'Erro ao remover serviço do perfil.',
    });
  }
});

// Consulta o perfil de um profissional pelo ID
router.get('/profissionais/:id', async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      mensagem: 'O ID do profissional deve ser numérico.',
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
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Profissional não encontrado.',
      });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao consultar perfil:', erro.message);
    res.status(500).json({
      mensagem: 'Erro ao consultar perfil do profissional.',
    });
  }
});

// Consulta o perfil do profissional autenticado - SCRUM-275
router.get('/meu-perfil-profissional', autenticar, async (req, res) => {
  if (req.usuario.papel !== 'profissional') {
    return res.status(403).json({
      mensagem: 'Acesso permitido somente a profissionais.',
    });
  }

  try {
    const resultado = await pool.query(
      `
        SELECT
          p.id AS profissional_id,
          u.id AS usuario_id,
          u.nome,
          u.email,
          u.foto_perfil_url,
          p.descricao
        FROM profissional p
        INNER JOIN usuario u ON u.id = p.usuario_id
        WHERE u.id = $1;
      `,
      [req.usuario.id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Perfil profissional não encontrado.',
      });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao consultar perfil autenticado:', erro.message);
    return res.status(500).json({
      mensagem: 'Erro ao consultar o perfil profissional.',
    });
  }
});

// Atualiza o perfil profissional autenticado
router.put('/meu-perfil-profissional', autenticar, async (req, res) => {
  if (req.usuario.papel !== 'profissional') {
    return res.status(403).json({
      mensagem: 'Acesso permitido somente a profissionais.',
    });
  }

  const corpoValido =
    req.body !== null &&
    typeof req.body === 'object' &&
    !Array.isArray(req.body);

  if (!corpoValido) {
    return res.status(400).json({
      mensagem: 'O corpo da requisição deve ser um objeto válido.',
    });
  }

  const camposPermitidos = ['nome', 'foto_perfil_url', 'descricao'];
  const camposRecebidos = Object.keys(req.body);

  if (
    camposRecebidos.length === 0 ||
    camposRecebidos.some((campo) => !camposPermitidos.includes(campo))
  ) {
    return res.status(400).json({
      mensagem: 'Informe campos válidos para atualizar o perfil profissional.',
    });
  }

  const nomeInformado = Object.prototype.hasOwnProperty.call(
    req.body,
    'nome',
  );
  const fotoInformada = Object.prototype.hasOwnProperty.call(
    req.body,
    'foto_perfil_url',
  );
  const descricaoInformada = Object.prototype.hasOwnProperty.call(
    req.body,
    'descricao',
  );

  let nome;
  if (nomeInformado) {
    if (typeof req.body.nome !== 'string') {
      return res.status(400).json({
        mensagem: 'O nome deve ser um texto entre 2 e 150 caracteres.',
      });
    }

    nome = req.body.nome.trim();
    const tamanhoNome = Array.from(nome).length;

    if (tamanhoNome < 2 || tamanhoNome > 150) {
      return res.status(400).json({
        mensagem: 'O nome deve ter entre 2 e 150 caracteres.',
      });
    }
  }

  if (
    (fotoInformada &&
      req.body.foto_perfil_url !== null &&
      typeof req.body.foto_perfil_url !== 'string') ||
    (descricaoInformada &&
      req.body.descricao !== null &&
      typeof req.body.descricao !== 'string')
  ) {
    return res.status(400).json({
      mensagem: 'A foto e a descrição devem ser textos ou nulas.',
    });
  }

  const fotoPerfilUrl =
    typeof req.body.foto_perfil_url === 'string'
      ? req.body.foto_perfil_url.trim() || null
      : req.body.foto_perfil_url;
  const descricao =
    typeof req.body.descricao === 'string'
      ? req.body.descricao.trim() || null
      : req.body.descricao;

  let client;
  let transacaoIniciada = false;

  try {
    client = await pool.connect();
    await client.query('BEGIN');
    transacaoIniciada = true;

    const perfil = await client.query(
      'SELECT id FROM profissional WHERE usuario_id = $1 FOR UPDATE;',
      [req.usuario.id],
    );

    if (perfil.rows.length === 0) {
      await client.query('ROLLBACK');
      transacaoIniciada = false;

      return res.status(404).json({
        mensagem: 'Perfil profissional não encontrado.',
      });
    }

    const profissionalId = perfil.rows[0].id;
    const camposUsuario = [];
    const valoresUsuario = [];

    if (nomeInformado) {
      valoresUsuario.push(nome);
      camposUsuario.push(`nome = $${valoresUsuario.length}`);
    }

    if (fotoInformada) {
      valoresUsuario.push(fotoPerfilUrl);
      camposUsuario.push(`foto_perfil_url = $${valoresUsuario.length}`);
    }

    if (camposUsuario.length > 0) {
      valoresUsuario.push(req.usuario.id);

      const usuarioAtualizado = await client.query(
        `UPDATE usuario
         SET ${camposUsuario.join(', ')}
         WHERE id = $${valoresUsuario.length}
         RETURNING id;`,
        valoresUsuario,
      );

      if (usuarioAtualizado.rowCount !== 1) {
        throw new Error('Não foi possível atualizar os dados do usuário.');
      }
    }

    if (descricaoInformada) {
      const profissionalAtualizado = await client.query(
        `UPDATE profissional
         SET descricao = $1
         WHERE id = $2 AND usuario_id = $3
         RETURNING id;`,
        [descricao, profissionalId, req.usuario.id],
      );

      if (profissionalAtualizado.rowCount !== 1) {
        throw new Error('Não foi possível atualizar o perfil profissional.');
      }
    }

    const resultado = await client.query(
      `
        SELECT
          p.id AS profissional_id,
          u.id AS usuario_id,
          u.nome,
          u.email,
          u.foto_perfil_url,
          p.descricao
        FROM profissional p
        INNER JOIN usuario u ON u.id = p.usuario_id
        WHERE p.id = $1 AND u.id = $2;
      `,
      [profissionalId, req.usuario.id],
    );

    if (resultado.rows.length !== 1) {
      throw new Error('Não foi possível consultar o perfil atualizado.');
    }

    await client.query('COMMIT');
    transacaoIniciada = false;

    return res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    if (client && transacaoIniciada) {
      try {
        await client.query('ROLLBACK');
      } catch (erroRollback) {
        console.error('Erro ao reverter atualização do perfil:', erroRollback);
      }
    }

    console.error('Erro ao atualizar perfil profissional:', erro.message);
    return res.status(500).json({
      mensagem: 'Erro ao atualizar o perfil profissional.',
    });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// Rota inicial da API
router.get('/', (req, res) => {
  res.json({
    mensagem: 'API do Construlink funcionando!',
  });
});

// Rota para validar a conexão com o PostgreSQL
router.get('/db-check', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');

    res.json({
      mensagem: 'Conexão com o PostgreSQL funcionando!',
    });
  } catch (error) {
    console.error('Erro ao conectar com o PostgreSQL:', error.message);

    res.status(500).json({
      mensagem: 'Não foi possível conectar ao banco de dados.',
    });
  }
});

// Exporta as rotas

// Autenticação de usuário (Cliente ou Profissional) - SCRUM-268
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ mensagem: 'E-mail e senha são obrigatórios.' });
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
      'LIMIT 1',
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

    const token = jwt.sign(
      {
        sub: String(usuario.id),
        papel: usuario.papel,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' },
    );

    return res.status(200).json({
      mensagem: 'Autenticado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
        foto_perfil_url: usuario.foto_perfil_url,
        cliente_id: usuario.cliente_id,
        profissional_id: usuario.profissional_id,
      },
    });
  } catch (erro) {
    console.error('Erro na autenticação:', erro);
    return res
      .status(500)
      .json({ mensagem: 'Erro interno ao realizar autenticação.' });
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
        mensagem: 'Nome, e-mail, senha e papel são obrigatórios.',
      });
    }

    const nomeFormatado = String(nome).trim();
    const emailFormatado = String(email).trim().toLowerCase();
    const papelFormatado = String(papel).trim().toLowerCase();

    if (nomeFormatado.length < 2) {
      return res
        .status(400)
        .json({ mensagem: 'O nome deve ter pelo menos 2 caracteres.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFormatado)) {
      return res.status(400).json({ mensagem: 'Formato de e-mail inválido.' });
    }

    if (String(senha).length < 6) {
      return res
        .status(400)
        .json({ mensagem: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    if (!['cliente', 'profissional'].includes(papelFormatado)) {
      return res
        .status(400)
        .json({ mensagem: 'Papel inválido. Use "cliente" ou "profissional".' });
    }

    if (
      papelFormatado === 'profissional' &&
      descricao != null &&
      typeof descricao !== 'string'
    ) {
      return res
        .status(400)
        .json({ mensagem: 'A descrição profissional deve ser um texto.' });
    }

    const descricaoFormatada =
      typeof descricao === 'string' ? descricao.trim() || null : null;

    // Verificação de unicidade do e-mail - SCRUM-296
    const emailExistente = await client.query(
      'SELECT id FROM usuario WHERE LOWER(email) = $1 LIMIT 1;',
      [emailFormatado],
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
      [nomeFormatado, emailFormatado, senhaHash, papelFormatado],
    );

    const novoUsuario = resultadoUsuario.rows[0];

    if (papelFormatado === 'cliente') {
      const resultadoCliente = await client.query(
        'INSERT INTO cliente (usuario_id) VALUES ($1) RETURNING id, usuario_id;',
        [novoUsuario.id],
      );

      if (
        resultadoCliente.rows.length !== 1 ||
        String(resultadoCliente.rows[0].usuario_id) !== String(novoUsuario.id)
      ) {
        throw new Error(
          'Não foi possível confirmar o vínculo do cliente com o usuário.',
        );
      }
    } else {
      const resultadoProfissional = await client.query(
        'INSERT INTO profissional (usuario_id, descricao) VALUES ($1, $2) RETURNING id, usuario_id;',
        [novoUsuario.id, descricaoFormatada],
      );

      if (
        resultadoProfissional.rows.length !== 1 ||
        String(resultadoProfissional.rows[0].usuario_id) !==
          String(novoUsuario.id)
      ) {
        throw new Error(
          'Não foi possível confirmar o vínculo do profissional com o usuário.',
        );
      }
    }

    await client.query('COMMIT');

    return res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso.',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        papel: novoUsuario.papel,
        foto_perfil_url: novoUsuario.foto_perfil_url,
      },
    });
  } catch (erro) {
    await client.query('ROLLBACK');
    console.error('Erro no cadastro:', erro);
    return res
      .status(500)
      .json({ mensagem: 'Erro interno ao realizar cadastro.' });
  } finally {
    client.release();
  }
});

// Encerramento de sessão - SCRUM-268
router.post('/logout', (req, res) => {
  return res.status(200).json({ mensagem: 'Sessão encerrada com sucesso.' });
});

// Cadastra um trabalho realizado pelo profissional autenticado
router.post(
  '/trabalhos',
  autenticar,
  (req, res, next) => {
    if (req.usuario.papel !== 'profissional') {
      return res.status(403).json({
        mensagem: 'Acesso permitido somente a profissionais.',
      });
    }

    uploadTrabalho.single('foto')(req, res, (erro) => {
      if (erro) {
        const mensagem =
          erro.code === 'LIMIT_FILE_SIZE'
            ? 'A imagem deve ter no máximo 5 MB.'
            : erro.message || 'Erro ao enviar a imagem.';

        return res.status(400).json({ mensagem });
      }

      next();
    });
  },
  async (req, res) => {
    let caminhoFoto;

    try {
      const titulo = String(req.body.titulo || '').trim();
      const descricao = String(req.body.descricao || '').trim();

      if (!titulo || titulo.length > 150) {
        return res.status(400).json({
          mensagem: 'Informe um título com até 150 caracteres.',
        });
      }

      if (!descricao || descricao.length > 500) {
        return res.status(400).json({
          mensagem: 'Informe uma descrição com até 500 caracteres.',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          mensagem: 'A foto do trabalho é obrigatória.',
        });
      }

      caminhoFoto = req.file.path;

      const perfil = await pool.query(
        'SELECT id FROM profissional WHERE usuario_id = $1;',
        [req.usuario.id],
      );

      if (perfil.rows.length === 0) {
        const fs = require('fs/promises');
        await fs.unlink(caminhoFoto);
        return res.status(404).json({
          mensagem: 'Perfil profissional não encontrado.',
        });
      }

      const profissionalId = perfil.rows[0].id;
      const fotoUrl = `${process.env.PUBLIC_API_URL}/uploads/${req.file.filename}`;

      const resultado = await pool.query(
        `INSERT INTO trabalho_realizado
        (profissional_id, titulo, foto_url, descricao)
       VALUES ($1, $2, $3, $4)
       RETURNING id, profissional_id, titulo, foto_url, descricao;`,
        [profissionalId, titulo, fotoUrl, descricao],
      );

      return res.status(201).json({
        mensagem: 'Trabalho cadastrado com sucesso.',
        trabalho: resultado.rows[0],
      });
    } catch (erro) {
      if (caminhoFoto) {
        const fs = require('fs/promises');
        await fs.unlink(caminhoFoto).catch(() => {});
      }

      console.error('Erro ao cadastrar trabalho:', erro.message);

      return res.status(500).json({
        mensagem: 'Erro ao cadastrar trabalho.',
      });
    }
  },
);

/** Cadastro de oferta de serviço - SCRUM-276 */
router.post('/ofertas-servico', autenticar, async (req, res) => {
  if (req.usuario.papel !== 'profissional') {
    return res.status(403).json({
      mensagem: 'Acesso permitido somente a profissionais.',
    });
  }

  const { servico_id } = req.body;

  if (
    servico_id === undefined ||
    servico_id === null ||
    !/^[1-9]\d*$/.test(String(servico_id))
  ) {
    return res.status(400).json({
      mensagem: 'Informe um ID de serviço válido.',
    });
  }

  try {
    const perfil = await pool.query(
      'SELECT id FROM profissional WHERE usuario_id = $1;',
      [req.usuario.id],
    );

    if (perfil.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Perfil profissional não encontrado.',
      });
    }

    const profissionalId = perfil.rows[0].id;

    const servico = await pool.query('SELECT id FROM servico WHERE id = $1;', [
      servico_id,
    ]);

    if (servico.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Serviço não encontrado.',
      });
    }

    const ofertaExistente = await pool.query(
      `SELECT id
       FROM oferta_servico
       WHERE profissional_id = $1 AND servico_id = $2;`,
      [profissionalId, servico_id],
    );

    if (ofertaExistente.rows.length > 0) {
      return res.status(409).json({
        mensagem: 'Este serviço já está associado ao seu perfil.',
      });
    }

    const resultado = await pool.query(
      `INSERT INTO oferta_servico (profissional_id, servico_id)
       VALUES ($1, $2)
       RETURNING id, profissional_id, servico_id;`,
      [profissionalId, servico_id],
    );

    return res.status(201).json({
      mensagem: 'Serviço associado ao perfil com sucesso.',
      oferta: resultado.rows[0],
    });
  } catch (erro) {
    if (erro.code === '23505') {
      return res.status(409).json({
        mensagem: 'Este serviço já está associado ao seu perfil.',
      });
    }

    console.error('Erro ao cadastrar oferta de serviço:', erro.message);

    return res.status(500).json({
      mensagem: 'Erro ao cadastrar oferta de serviço.',
    });
  }
});

module.exports = router;
