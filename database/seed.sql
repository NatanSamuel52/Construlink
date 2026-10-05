-- SCRUM-362
-- Executar no banco construlink após aplicar schema.sql.

BEGIN;

-- ============================================================
-- USUÁRIOS PROFISSIONAIS
-- ============================================================

-- A senha abaixo é apenas um texto fictício e não serve para autenticação.

INSERT INTO usuario (nome, email, senha_hash, papel, foto_perfil_url)
VALUES
    ('Carlos Oliveira', 'carlos.oliveira.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Mariana Costa', 'mariana.costa.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Rafael Santos', 'rafael.santos.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Lucas Almeida', 'lucas.almeida.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Fernanda Souza', 'fernanda.souza.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('João Martins', 'joao.martins.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Beatriz Lima', 'beatriz.lima.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('André Ferreira', 'andre.ferreira.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Camila Rodrigues', 'camila.rodrigues.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Pedro Henrique', 'pedro.henrique.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Juliana Alves', 'juliana.alves.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Marcelo Ribeiro', 'marcelo.ribeiro.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Larissa Mendes', 'larissa.mendes.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Gustavo Rocha', 'gustavo.rocha.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Amanda Martins', 'amanda.martins.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Felipe Costa', 'felipe.costa.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Renata Oliveira', 'renata.oliveira.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Diego Santos', 'diego.santos.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Bruna Almeida', 'bruna.almeida.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),

    ('Thiago Ferreira', 'thiago.ferreira.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL)

ON CONFLICT (email) DO NOTHING;


-- ============================================================
-- PROFISSIONAIS
-- ============================================================

INSERT INTO profissional (usuario_id, descricao)
SELECT u.id, dados.descricao
FROM (
    VALUES
        ('carlos.oliveira.teste@construlink.local',
         'Profissional fictício especializado em pintura residencial.'),

        ('mariana.costa.teste@construlink.local',
         'Profissional fictícia especializada em serviços elétricos.'),

        ('rafael.santos.teste@construlink.local',
         'Profissional fictício especializado em reparos hidráulicos.'),

        ('lucas.almeida.teste@construlink.local',
         'Profissional fictício especializado em serviços elétricos.'),

        ('fernanda.souza.teste@construlink.local',
         'Profissional fictícia especializada em pintura residencial e manutenção.'),

        ('joao.martins.teste@construlink.local',
         'Profissional fictício especializado em reparos hidráulicos.'),

        ('beatriz.lima.teste@construlink.local',
         'Profissional fictícia especializada em montagem de móveis e alvenaria.'),

        ('andre.ferreira.teste@construlink.local',
         'Profissional fictício especializado em instalações elétricas residenciais.'),

        ('camila.rodrigues.teste@construlink.local',
         'Profissional fictícia especializada em pintura residencial.'),

        ('pedro.henrique.teste@construlink.local',
         'Profissional fictício especializado em serviços hidráulicos.'),

        ('juliana.alves.teste@construlink.local',
         'Profissional fictícia especializada em montagem de móveis.'),

        ('marcelo.ribeiro.teste@construlink.local',
         'Profissional fictício especializado em serviços de alvenaria.'),

        ('larissa.mendes.teste@construlink.local',
         'Profissional fictícia especializada em instalações elétricas.'),

        ('gustavo.rocha.teste@construlink.local',
         'Profissional fictício especializado em pintura residencial.'),

        ('amanda.martins.teste@construlink.local',
         'Profissional fictícia especializada em reparos hidráulicos.'),

        ('felipe.costa.teste@construlink.local',
         'Profissional fictício especializado em montagem de móveis.'),

        ('renata.oliveira.teste@construlink.local',
         'Profissional fictícia especializada em serviços de alvenaria.'),

        ('diego.santos.teste@construlink.local',
         'Profissional fictício especializado em serviços elétricos.'),

        ('bruna.almeida.teste@construlink.local',
         'Profissional fictícia especializada em pintura residencial.'),

        ('thiago.ferreira.teste@construlink.local',
         'Profissional fictício especializado em reparos hidráulicos.')

) AS dados(email, descricao)
JOIN usuario u ON u.email = dados.email
WHERE NOT EXISTS (
    SELECT 1
    FROM profissional p
    WHERE p.usuario_id = u.id
);


-- ============================================================
-- SERVIÇOS
-- ============================================================

INSERT INTO servico (nome, descricao)
SELECT dados.nome, dados.descricao
FROM (
    VALUES
        ('Pintura Residencial',
         'Serviço fictício de pintura de ambientes.'),

        ('Elétricas',
         'Serviço fictício de serviços elétricos.'),

        ('Hidráulicos',
         'Serviço fictício de serviços hidráulicos.'),

        ('Montagem de móveis',
         'Serviço fictício de montagem de móveis.'),

        ('Alvenaria',
         'Serviço de alvenaria.')

) AS dados(nome, descricao)
WHERE NOT EXISTS (
    SELECT 1
    FROM servico s
    WHERE s.nome = dados.nome
);


-- ============================================================
-- OFERTAS DE SERVIÇO
-- ============================================================

INSERT INTO oferta_servico (profissional_id, servico_id)
SELECT p.id, s.id
FROM (
    VALUES
        ('carlos.oliveira.teste@construlink.local',
         'Pintura Residencial'),

        ('carlos.oliveira.teste@construlink.local',
         'Montagem de móveis'),

        ('mariana.costa.teste@construlink.local',
         'Elétricas'),

        ('rafael.santos.teste@construlink.local',
         'Hidráulicos'),

        ('lucas.almeida.teste@construlink.local',
         'Elétricas'),

        ('fernanda.souza.teste@construlink.local',
         'Pintura Residencial'),

        ('joao.martins.teste@construlink.local',
         'Hidráulicos'),

        ('beatriz.lima.teste@construlink.local',
         'Montagem de móveis'),

        ('beatriz.lima.teste@construlink.local',
         'Alvenaria'),

        ('andre.ferreira.teste@construlink.local',
         'Elétricas'),

        ('camila.rodrigues.teste@construlink.local',
         'Pintura Residencial'),

        ('pedro.henrique.teste@construlink.local',
         'Hidráulicos'),

        ('juliana.alves.teste@construlink.local',
         'Montagem de móveis'),

        ('marcelo.ribeiro.teste@construlink.local',
         'Alvenaria'),

        ('larissa.mendes.teste@construlink.local',
         'Elétricas'),

        ('gustavo.rocha.teste@construlink.local',
         'Pintura Residencial'),

        ('amanda.martins.teste@construlink.local',
         'Hidráulicos'),

        ('felipe.costa.teste@construlink.local',
         'Montagem de móveis'),

        ('renata.oliveira.teste@construlink.local',
         'Alvenaria'),

        ('diego.santos.teste@construlink.local',
         'Elétricas'),

        ('bruna.almeida.teste@construlink.local',
         'Pintura Residencial'),

        ('thiago.ferreira.teste@construlink.local',
         'Hidráulicos')

) AS dados(email, servico_nome)
JOIN usuario u ON u.email = dados.email
JOIN profissional p ON p.usuario_id = u.id
JOIN servico s ON s.nome = dados.servico_nome
ON CONFLICT (profissional_id, servico_id) DO NOTHING;


-- ============================================================
-- TRABALHOS REALIZADOS
-- ============================================================

INSERT INTO trabalho_realizado
    (profissional_id, titulo, foto_url, descricao)
SELECT p.id, dados.titulo, dados.foto_url, dados.descricao
FROM (
    VALUES
        ('carlos.oliveira.teste@construlink.local',
         'Pintura de sala',
         'https://example.com/imagens/pintura-sala.jpg',
         'Registro fictício de pintura de uma sala residencial.'),

        ('carlos.oliveira.teste@construlink.local',
         'Pintura de quarto',
         'https://example.com/imagens/pintura-quarto.jpg',
         'Registro fictício de pintura de um quarto.'),

        ('mariana.costa.teste@construlink.local',
         'Instalação de luminárias',
         'https://example.com/imagens/instalacao-luminarias.jpg',
         'Registro fictício de instalação de luminárias.'),

        ('rafael.santos.teste@construlink.local',
         'Reparo de torneira',
         'https://example.com/imagens/reparo-torneira.jpg',
         'Registro fictício de reparo hidráulico em torneira.')

) AS dados(email, titulo, foto_url, descricao)
JOIN usuario u ON u.email = dados.email
JOIN profissional p ON p.usuario_id = u.id
WHERE NOT EXISTS (
    SELECT 1
    FROM trabalho_realizado tr
    WHERE tr.profissional_id = p.id
      AND tr.titulo = dados.titulo
);


COMMIT;