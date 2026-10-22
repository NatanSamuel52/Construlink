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
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/c7796250-ae83-4b80-a1f8-425d03f88085.png'),

    ('Mariana Costa', 'mariana.costa.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/0365f2e0-00bf-43ac-a13c-5002f7dbe253.jpg'),

    ('Rafael Santos', 'rafael.santos.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/0373a1ee-490b-451c-81d2-898893b33aae.jpg'),

    ('Lucas Almeida', 'lucas.almeida.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/0e723305-1db7-45b8-a965-b7884cec942c.jpg'),

    ('Fernanda Souza', 'fernanda.souza.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/11d54a08-a884-47aa-aa38-d15435826792.png'),

    ('João Martins', 'joao.martins.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/1df1aaac-b061-4426-9141-1e2b3941db28.png'),

    ('Beatriz Lima', 'beatriz.lima.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/2aa169df-46f8-473f-a117-646a66e80024.png'),

    ('André Ferreira', 'andre.ferreira.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/31533488-b0d6-4eee-b23f-2ea1a2621986.jpg'),

    ('Camila Rodrigues', 'camila.rodrigues.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/36a98c8b-0c6a-42dc-bed7-eee04f0e6b05.jpg'),

    ('Pedro Henrique', 'pedro.henrique.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/399f7c71-437f-4404-aea1-103e5e3a9ca5.jpg'),

    ('Juliana Alves', 'juliana.alves.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/3e1ff4d4-53f6-4dfb-8756-e649d33a3467.png'),

    ('Marcelo Ribeiro', 'marcelo.ribeiro.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/4cfc587e-4dd3-4c92-8e5a-afe1b9408003.jpg'),

    ('Larissa Mendes', 'larissa.mendes.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/4e9016aa-9f9e-4562-adf2-a09d23d28b1b.png'),

    ('Gustavo Rocha', 'gustavo.rocha.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/50c86fcd-9c51-40c5-8a65-5522daecda56.jpg'),

    ('Amanda Martins', 'amanda.martins.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/53095c5b-6f4d-4fcc-9ade-041b6f172117.jpg'),

    ('Felipe Costa', 'felipe.costa.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/588f4d09-e828-45df-b9c1-6130f0d6e128.png'),

    ('Renata Oliveira', 'renata.oliveira.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/625967e8-9f03-4e43-8613-da540ede635f.jpg'),

    ('Diego Santos', 'diego.santos.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/7081892b-a5fc-44c5-8e90-128fe93a6a86.jpg'),

    ('Bruna Almeida', 'bruna.almeida.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/8c725a5e-4035-436a-9615-980ade1d4594.jpg'),

    ('Thiago Ferreira', 'thiago.ferreira.teste@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/89f87571-b7fd-454e-889e-f418c610b451.png')

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


-- USUÁRIOS CLIENTES
INSERT INTO usuario (nome, email, senha_hash, papel, foto_perfil_url)
VALUES
    ('Ana Silva', 'ana.silva.teste@construlink.local',
     '$2b$10$8gneou8J7tBAXzHMqQBTMOwQiT12CAgMjbwDcPb4HvSGQRey2tWra', 'cliente', NULL)
ON CONFLICT (email) DO NOTHING;

-- CLIENTES
INSERT INTO cliente (usuario_id)
SELECT u.id
FROM usuario u
WHERE u.email = 'ana.silva.teste@construlink.local'
  AND NOT EXISTS (
    SELECT 1
    FROM cliente c
    WHERE c.usuario_id = u.id
);

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
         'http://localhost:3000/uploads/8f7bb59a-f2a0-41a2-84bf-d145aaebe759.png',
         'Registro fictício de pintura de uma sala residencial.'),

        ('carlos.oliveira.teste@construlink.local',
         'Pintura de quarto',
         'http://localhost:3000/uploads/9058411b-0784-4238-a15e-da3b0c052f06.png',
         'Registro fictício de pintura de um quarto.'),

        ('mariana.costa.teste@construlink.local',
         'Instalação de luminárias',
         'http://localhost:3000/uploads/a094098c-a350-47de-aeb0-c7758491b8ef.png',
         'Registro fictício de instalação de luminárias.'),

        ('rafael.santos.teste@construlink.local',
         'Reparo de torneira',
         'http://localhost:3000/uploads/a3d44dae-e394-4289-b751-c36c38e38832.png',
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