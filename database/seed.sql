-- SCRUM-362
-- Executar no banco construlink após aplicar schema.sql.

BEGIN;

-- USUÁRIOS PROFISSIONAIS
-- A senha abaixo é apenas um texto fictício e não serve para autenticação.
INSERT INTO usuario (nome, email, senha_hash, papel, foto_perfil_url)
VALUES
    ('Carlos Oliveira', 'carlos.oliveira.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),
    ('Mariana Costa', 'mariana.costa.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL),
    ('Rafael Santos', 'rafael.santos.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional', NULL)
ON CONFLICT (email) DO NOTHING;

-- PROFISSIONAIS
INSERT INTO profissional (usuario_id, descricao)
SELECT u.id, dados.descricao
FROM (
    VALUES
        ('carlos.oliveira.teste@construlink.local',
         'Profissional fictício especializado em pintura residencial.'),
        ('mariana.costa.teste@construlink.local',
         'Profissional fictícia especializada em serviços elétricos.'),
        ('rafael.santos.teste@construlink.local',
         'Profissional fictício especializado em reparos hidráulicos.')
) AS dados(email, descricao)
JOIN usuario u ON u.email = dados.email
WHERE NOT EXISTS (
    SELECT 1
    FROM profissional p
    WHERE p.usuario_id = u.id
);

-- SERVIÇOS
INSERT INTO servico (nome, descricao)
SELECT dados.nome, dados.descricao
FROM (
    VALUES
        ('Pintura residencial', 'Serviço fictício de pintura de ambientes.'),
        ('Instalação elétrica', 'Serviço fictício de instalação elétrica.'),
        ('Reparos hidráulicos', 'Serviço fictício de reparos hidráulicos.'),
        ('Montagem de móveis', 'Serviço fictício de montagem de móveis.')
) AS dados(nome, descricao)
WHERE NOT EXISTS (
    SELECT 1
    FROM servico s
    WHERE s.nome = dados.nome
);

-- OFERTAS DE SERVIÇO
INSERT INTO oferta_servico (profissional_id, servico_id)
SELECT p.id, s.id
FROM (
    VALUES
        ('carlos.oliveira.teste@construlink.local', 'Pintura residencial'),
        ('carlos.oliveira.teste@construlink.local', 'Montagem de móveis'),
        ('mariana.costa.teste@construlink.local', 'Instalação elétrica'),
        ('rafael.santos.teste@construlink.local', 'Reparos hidráulicos')
) AS dados(email, servico_nome)
JOIN usuario u ON u.email = dados.email
JOIN profissional p ON p.usuario_id = u.id
JOIN servico s ON s.nome = dados.servico_nome
ON CONFLICT (profissional_id, servico_id) DO NOTHING;

-- TRABALHOS REALIZADOS
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
