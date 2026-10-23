-- Corrige serviços e perfis de demonstração no banco local persistente.
-- As alterações preservam as contas e os vínculos já existentes.

BEGIN;

UPDATE servico
SET nome = 'Hidráulicos',
    descricao = 'Serviços de instalação e reparo hidráulico.'
WHERE nome ILIKE 'Reparos hidr%'
   OR nome = 'Hidráulicos';

UPDATE servico
SET nome = 'Elétricas',
    descricao = 'Serviços de instalação e manutenção elétrica.'
WHERE nome ILIKE 'Instala%'
   OR nome = 'Elétricas';

UPDATE servico
SET nome = 'Pintura Residencial',
    descricao = 'Serviços de pintura residencial.'
WHERE lower(nome) = lower('Pintura Residencial');

UPDATE servico
SET nome = 'Montagem de móveis',
    descricao = 'Serviços de montagem de móveis.'
WHERE nome ILIKE 'Montagem de%';

INSERT INTO servico (nome, descricao)
SELECT 'Alvenaria', 'Serviços de alvenaria e pequenos reparos.'
WHERE NOT EXISTS (
    SELECT 1
    FROM servico
    WHERE lower(nome) = lower('Alvenaria')
);

INSERT INTO oferta_servico (profissional_id, servico_id)
SELECT p.id, s.id
FROM profissional p
INNER JOIN usuario u ON u.id = p.usuario_id
INNER JOIN servico s ON lower(s.nome) = lower('Alvenaria')
WHERE lower(u.nome) = lower('opa teste 2')
ON CONFLICT (profissional_id, servico_id) DO NOTHING;

UPDATE usuario
SET nome = 'Natã Samuel dos Santos Chaves'
WHERE lower(nome) = lower('natã samuel dos santos chaves');

UPDATE usuario
SET nome = 'Opa Teste 2'
WHERE lower(nome) = lower('opa teste 2');

UPDATE profissional p
SET descricao = dados.descricao
FROM usuario u
INNER JOIN (
    VALUES
        (
            'Natã Samuel dos Santos Chaves',
            'Sou muito bom em elétrica.'
        ),
        (
            'Opa Teste 2',
            'Atuo com serviços de alvenaria.'
        )
) AS dados(nome, descricao) ON lower(u.nome) = lower(dados.nome)
WHERE p.usuario_id = u.id;

UPDATE profissional p
SET descricao = dados.descricao
FROM usuario u
INNER JOIN (
    VALUES
        (
            'carlos.oliveira.teste@construlink.local',
            'Profissional especializado em pintura residencial.'
        ),
        (
            'mariana.costa.teste@construlink.local',
            'Profissional especializada em serviços elétricos.'
        ),
        (
            'rafael.santos.teste@construlink.local',
            'Profissional especializado em reparos hidráulicos.'
        )
) AS dados(email, descricao) ON u.email = dados.email
WHERE p.usuario_id = u.id;

COMMIT;
