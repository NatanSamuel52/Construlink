-- SCRUM-361
-- Esquema PostgreSQL conforme o MER atual do Construlink V1.0

-- USUÁRIO
CREATE TABLE usuario (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    papel VARCHAR(30) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    foto_perfil_url TEXT
);

-- CLIENTE
CREATE TABLE cliente (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_cliente_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
);

-- PROFISSIONAL
CREATE TABLE profissional (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    descricao TEXT,
    CONSTRAINT fk_profissional_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
);

-- TRABALHO_REALIZADO
CREATE TABLE trabalho_realizado (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profissional_id BIGINT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    foto_url TEXT NOT NULL,
    descricao TEXT,
    CONSTRAINT fk_trabalho_profissional
        FOREIGN KEY (profissional_id)
        REFERENCES profissional(id)
);

-- SERVIÇO
CREATE TABLE servico (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT
);

-- OFERTA_SERVIÇO
CREATE TABLE oferta_servico (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profissional_id BIGINT NOT NULL,
    servico_id BIGINT NOT NULL,
    CONSTRAINT fk_oferta_profissional
        FOREIGN KEY (profissional_id)
        REFERENCES profissional(id),
    CONSTRAINT fk_oferta_servico
        FOREIGN KEY (servico_id)
        REFERENCES servico(id),
    CONSTRAINT uq_oferta_profissional_servico
        UNIQUE (profissional_id, servico_id)
);

-- CONVERSA
CREATE TABLE conversa (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    servico_id BIGINT NOT NULL,
    cliente_id BIGINT NOT NULL,
    profissional_id BIGINT NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_conversa_servico
        FOREIGN KEY (servico_id)
        REFERENCES servico(id),
    CONSTRAINT fk_conversa_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id),
    CONSTRAINT fk_conversa_profissional
        FOREIGN KEY (profissional_id)
        REFERENCES profissional(id)
);

-- MENSAGEM
CREATE TABLE mensagem (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conversa_id BIGINT NOT NULL,
    remetente_usuario_id BIGINT NOT NULL,
    conteudo TEXT NOT NULL,
    enviada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mensagem_conversa
        FOREIGN KEY (conversa_id)
        REFERENCES conversa(id),
    CONSTRAINT fk_mensagem_remetente
        FOREIGN KEY (remetente_usuario_id)
        REFERENCES usuario(id)
);