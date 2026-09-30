
const express = require('express');
const pool = require('../config/database');

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

// Exporta as rotas
module.exports = router;