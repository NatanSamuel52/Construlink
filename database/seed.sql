-- Dados fictícios para os perfis públicos da demonstração V1.0.
-- As contas de demonstração não têm senha válida para autenticação.

BEGIN;

INSERT INTO usuario (nome, email, senha_hash, papel, foto_perfil_url)
VALUES
    ('Lucas Almeida', 'demo.profissional01@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/1df1aaac-b061-4426-9141-1e2b3941db28.png'),
    ('Fernanda Souza', 'demo.profissional02@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/demo-profissional-web-01.jpg'),
    ('João Martins', 'demo.profissional03@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/4cfc587e-4dd3-4c92-8e5a-afe1b9408003.jpg'),
    ('Beatriz Lima', 'demo.profissional04@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/demo-profissional-web-02.jpg'),
    ('André Ferreira', 'demo.profissional05@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/4e9016aa-9f9e-4562-adf2-a09d23d28b1b.png'),
    ('Camila Rodrigues', 'demo.profissional06@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/demo-profissional-web-03.jpg'),
    ('Pedro Henrique', 'demo.profissional07@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/8f7bb59a-f2a0-41a2-84bf-d145aaebe759.png'),
    ('Juliana Alves', 'demo.profissional08@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/demo-profissional-web-04.jpg'),
    ('Marcelo Ribeiro', 'demo.profissional09@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/588f4d09-e828-45df-b9c1-6130f0d6e128.png'),
    ('Rafael Costa', 'demo.profissional10@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/6cf6f76f-2be8-4e34-a2bf-b3169e3f7c1b.png'),
    ('Carlos Santos', 'demo.profissional11@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/c31f9c4d-623d-42cd-9098-c846ad3ea8f8.jpg'),
    ('Gustavo Rocha', 'demo.profissional12@construlink.local',
     'HASH_FICTICIO_NAO_VALIDO_PARA_LOGIN', 'profissional',
     'http://localhost:3000/uploads/cdf4fb5e-a98b-4757-981a-81df416a2c82.png')
ON CONFLICT (email) DO NOTHING;

INSERT INTO profissional (usuario_id, descricao)
SELECT u.id, dados.descricao
FROM (
    VALUES
        ('demo.profissional01@construlink.local',
         'Profissional experiente em hidráulica residencial e montagem cuidadosa de móveis.'),
        ('demo.profissional02@construlink.local',
         'Eletricista residencial, com foco em instalações seguras e manutenção preventiva.'),
        ('demo.profissional03@construlink.local',
         'Atua com pintura residencial e pequenos serviços de alvenaria.'),
        ('demo.profissional04@construlink.local',
         'Especialista em montagem e organização de móveis para diferentes ambientes.'),
        ('demo.profissional05@construlink.local',
         'Profissional de instalações elétricas e reparos de alvenaria.'),
        ('demo.profissional06@construlink.local',
         'Pintora residencial dedicada a acabamentos e renovação de ambientes.'),
        ('demo.profissional07@construlink.local',
         'Trabalha com instalações e manutenção hidráulica em residências.'),
        ('demo.profissional08@construlink.local',
         'Profissional de montagem de móveis e pintura para renovar sua casa.'),
        ('demo.profissional09@construlink.local',
         'Pedreiro com experiência em alvenaria e reparos residenciais.'),
        ('demo.profissional10@construlink.local',
         'Atende serviços elétricos e hidráulicos para manutenção de residências.'),
        ('demo.profissional11@construlink.local',
         'Pintor residencial com atenção à preparação e ao acabamento das superfícies.'),
        ('demo.profissional12@construlink.local',
         'Profissional de alvenaria e montagem de móveis para projetos residenciais.')
) AS dados(email, descricao)
JOIN usuario u ON u.email = dados.email
WHERE NOT EXISTS (
    SELECT 1 FROM profissional p WHERE p.usuario_id = u.id
);

INSERT INTO servico (nome, descricao)
SELECT dados.nome, dados.descricao
FROM (
    VALUES
        ('Elétricas', 'Serviços de instalação e manutenção elétrica.'),
        ('Hidráulicos', 'Serviços de instalação e reparo hidráulico.'),
        ('Pintura Residencial', 'Serviços de pintura residencial.'),
        ('Montagem de móveis', 'Serviços de montagem de móveis.'),
        ('Alvenaria', 'Serviços de alvenaria e pequenos reparos.')
) AS dados(nome, descricao)
WHERE NOT EXISTS (
    SELECT 1 FROM servico s WHERE lower(s.nome) = lower(dados.nome)
);

INSERT INTO oferta_servico (profissional_id, servico_id)
SELECT p.id, s.id
FROM (
    VALUES
        ('demo.profissional01@construlink.local', 'Hidráulicos'),
        ('demo.profissional01@construlink.local', 'Montagem de móveis'),
        ('demo.profissional02@construlink.local', 'Elétricas'),
        ('demo.profissional03@construlink.local', 'Alvenaria'),
        ('demo.profissional03@construlink.local', 'Pintura Residencial'),
        ('demo.profissional04@construlink.local', 'Montagem de móveis'),
        ('demo.profissional05@construlink.local', 'Alvenaria'),
        ('demo.profissional05@construlink.local', 'Elétricas'),
        ('demo.profissional06@construlink.local', 'Pintura Residencial'),
        ('demo.profissional07@construlink.local', 'Hidráulicos'),
        ('demo.profissional08@construlink.local', 'Montagem de móveis'),
        ('demo.profissional08@construlink.local', 'Pintura Residencial'),
        ('demo.profissional09@construlink.local', 'Alvenaria'),
        ('demo.profissional10@construlink.local', 'Elétricas'),
        ('demo.profissional10@construlink.local', 'Hidráulicos'),
        ('demo.profissional11@construlink.local', 'Pintura Residencial'),
        ('demo.profissional12@construlink.local', 'Alvenaria'),
        ('demo.profissional12@construlink.local', 'Montagem de móveis')
) AS dados(email, servico_nome)
JOIN usuario u ON u.email = dados.email
JOIN profissional p ON p.usuario_id = u.id
JOIN servico s ON lower(s.nome) = lower(dados.servico_nome)
ON CONFLICT (profissional_id, servico_id) DO NOTHING;

INSERT INTO trabalho_realizado (profissional_id, titulo, foto_url, descricao)
SELECT p.id, dados.titulo, dados.foto_url, dados.descricao
FROM (
    VALUES
        ('demo.profissional01@construlink.local',
         'Instalação de chuveiro',
         'http://localhost:3000/uploads/b5e5727d-f43c-4194-a11d-21bdb751308e.jpg',
         'Serviço de instalação de chuveiro e acabamento hidráulico em banheiro residencial.'),
        ('demo.profissional02@construlink.local',
         'Revisão de quadro elétrico',
         'http://localhost:3000/uploads/0e723305-1db7-45b8-a965-b7884cec942c.jpg',
         'Organização e verificação de componentes em quadro de distribuição residencial.'),
        ('demo.profissional03@construlink.local',
         'Construção de parede de tijolos',
         'http://localhost:3000/uploads/3e1ff4d4-53f6-4dfb-8756-e649d33a3467.png',
         'Execução de parede de alvenaria com tijolos para área residencial.'),
        ('demo.profissional04@construlink.local',
         'Montagem de ambiente de sala',
         'http://localhost:3000/uploads/31533488-b0d6-4eee-b23f-2ea1a2621986.jpg',
         'Montagem e organização de móveis para compor uma sala residencial.'),
        ('demo.profissional05@construlink.local',
         'Instalação de tomadas e interruptores',
         'http://localhost:3000/uploads/89f87571-b7fd-454e-889e-f418c610b451.png',
         'Instalação de tomadas e interruptores com acabamento alinhado à parede.'),
        ('demo.profissional06@construlink.local',
         'Preparação de paredes para pintura',
         'http://localhost:3000/uploads/a5ebf390-0c75-4752-bde4-e7e91b5362e9.jpg',
         'Preparação e acabamento das paredes de um ambiente residencial antes da pintura.'),
        ('demo.profissional07@construlink.local',
         'Instalação de tubulação hidráulica',
         'http://localhost:3000/uploads/50c86fcd-9c51-40c5-8a65-5522daecda56.jpg',
         'Instalação de tubulação aparente para distribuição de água em ambiente residencial.'),
        ('demo.profissional08@construlink.local',
         'Organização de sala residencial',
         'http://localhost:3000/uploads/cba79bec-42ce-4c29-a493-986a61b38d45.jpg',
         'Montagem e disposição de móveis em uma sala residencial clara e funcional.'),
        ('demo.profissional09@construlink.local',
         'Construção de muro de blocos',
         'http://localhost:3000/uploads/399f7c71-437f-4404-aea1-103e5e3a9ca5.jpg',
         'Construção de muro com blocos de concreto para delimitação de terreno.'),
        ('demo.profissional10@construlink.local',
         'Montagem de quadro de distribuição',
         'http://localhost:3000/uploads/11d54a08-a884-47aa-aa38-d15435826792.png',
         'Montagem e identificação dos circuitos de um quadro elétrico residencial.'),
        ('demo.profissional11@construlink.local',
         'Acabamento de teto com iluminação embutida',
         'http://localhost:3000/uploads/db515167-c64e-4fd9-be1c-67df495afdba.png',
         'Acabamento de teto e renovação visual de ambiente residencial.'),
        ('demo.profissional12@construlink.local',
         'Acabamento externo de fachada',
         'http://localhost:3000/uploads/2aa169df-46f8-473f-a117-646a66e80024.png',
         'Execução de acabamento externo em fachada de residência.')
) AS dados(email, titulo, foto_url, descricao)
JOIN usuario u ON u.email = dados.email
JOIN profissional p ON p.usuario_id = u.id
WHERE NOT EXISTS (
    SELECT 1
    FROM trabalho_realizado t
    WHERE t.profissional_id = p.id
      AND t.titulo = dados.titulo
);

COMMIT;
